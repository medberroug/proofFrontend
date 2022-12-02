<script>
/**
 * User list component
 */
import { eoLocale } from "date-fns/locale/eo";
import { format, parseISO } from "date-fns";
// import parseISO from 'date-fns/parseISO'
import axios from "axios";
import Products from "../products.vue";
export default {
  head() {
    return {
      title: `${this.title} | Proof BackOffice`,
    };
  },
  data() {
    return {
      title: "Producers",
      baseUrl: null,
      items: [
        {
          text: "Market",
        },
        {
          text: "Producers",
          active: true,
        },
      ],
      addNewProducerModal: false,
      myNewProducer: { name: null },
      producers: [],
      chosenProducer: null,
      editProducerModal: false,
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      sortBy: "age",
      sortDesc: false,
      fields: [
        {
          key: "id",
          label: "Id",
        },
        {
          key: "name",
          label: "Name",
          sortable: true
        },
/*         {
          key: "nbProducts",
          label: "Products",
          sortable: true
        }, */
        "actions",
      ],
      editedProducer: {
        name: null,
        id: null,
        rank: null,
      },
    };
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.producers.length;
    },
  },

  async mounted() {
    try {
      this.totalRows = this.items.length;
      try {
        this.baseUrl = process.env.baseUrl;
        let result = await axios.get(process.env.baseUrl + "/producers");
        result = result.data;
        this.producers = result.reverse();
        console.log(result);
        for (let i = 0; i < this.producers.length; i++) {

          this.producers[i].nbProducts = 0

        }
        for (let i = 0; i < this.producers.length; i++) {
          let listProducts = await axios.get(process.env.baseUrl + "/products");
          listProducts = listProducts.data;
          console.log(listProducts);
          for (let j = 0; j < listProducts.length; j++) {
            if (this.producers[i].name == listProducts[j].producer.name) {
              this.producers[i].nbProducts = this.producers[i].nbProducts + 1
            }
          }
        }
        console.log(this.producers);
      } catch (error) { }
    } catch (error) { }
  },
  methods: {
    /**
     * Search the table data with search input
     */
    formateDate(date) {
      let result = format(parseISO(date), "dd/MM/yyyy hh:mm", {
        locale: eoLocale,
      });
      return result;
    },
    async actionOnCategory(action) {
      let result = await axios.get(
        process.env.baseUrl + "/actionOnPost/" + id + "/" + action
      );
      this.$router.go();
    },
    async addNewProducer() {
      let result = await axios.post(process.env.baseUrl + "/producers", {
        name: this.myNewProducer.name,
      });
      this.$router.go();
    },
    async deleteProducer(id) {

      let result = await axios.delete(process.env.baseUrl + "/producers/" + id)
      this.$router.go();
    },
    async editProducer(id) {
      let result = await axios.put(process.env.baseUrl + "/producers/" + id, {
        name: this.editedProducer.name,
      });
      this.editProducerModal = false;
      this.chosenProducer = 0;
      this.$router.go();
    },
    showEditCategoryModal(id) {
      this.editedProducer.id = id;
      for (let i = 0; i < this.producers.length; i++) {
        if (this.producers[i].id == id) {
          this.chosenProducer = i;
          this.editProducerModal = true;
          break;
        }
      }
    },
    onFiltered(filteredItems) {
      // Trigger pagination to update the number of buttons/pages due to filtering
      this.totalRows = filteredItems.length;
      this.currentPage = 1;
    },
  },
  middleware: "authentication",
};
</script>

<template>
  <div>
    <b-modal v-model="editProducerModal" centered hide-footer v-if="producers">
      <template #modal-title> Edit producer's name </template>

      <label for="input-live">New prodocer's name:</label>
      <b-form-input v-model="editedProducer.name" type="text"></b-form-input>

      <center>
        <b-button class="mt-3" block variant="primary" @click="editProducer(editedProducer.id)">
          Edit</b-button>
      </center>
    </b-modal>
    <!-- NEWW CATEGORY XXXXXXXXXXXXXXXXXXXXXXX vvvvvvvvvvvvvvvv -->
    <b-modal v-model="addNewProducerModal" centered hide-footer v-if="producers">
      <template #modal-title> Add new producer </template>

      <label for="input-live">Producer name:</label>
      <b-form-input v-model="myNewProducer.name" type="text"></b-form-input>

      <center>
        <b-button class="mt-3" block variant="primary" @click="addNewProducer()">
          Add</b-button>
      </center>
    </b-modal>
    <PageHeader :title="title" :items="items" />
    <div class="row" v-if="producers">
      <div class="col-sm-12 col-md-3">
        <b-button variant="primary" @click="addNewProducerModal = true">
          <i class="uil uil-plus mr-2"></i>
          Add new
        </b-button>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <!-- Table -->
            <div class="table-responsive mb-0">
              <b-table class="table table-centered table-nowrap" :items="producers" :fields="fields" responsive="sm"
                :per-page="perPage" :current-page="currentPage" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
                :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered">
                <!-- <template v-slot:cell(check)="data">
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input" :id="`contacusercheck${data.item.id}`" />
                                    <label class="custom-control-label" :for="`contacusercheck${data.item.id}`"></label>
                                </div>
                            </template> -->
                <template v-slot:cell(actions)="data">
                  <ul class="list-inline mb-0">
                    <li class="list-inline-item" @click="showEditCategoryModal(data.item.id)">
                      <a href="javascript:void(0);" class="px-2 text-primary" v-b-tooltip.hover title="Edit">
                        <i class="uil uil-pen font-size-18"></i>
                      </a>
                    </li>

                    <li class="list-inline-item" @click="deleteProducer(data.item.id)">
                      <a href="javascript:void(0);" class="px-2 text-danger" v-b-tooltip.hover title="Delete">
                        <i class="uil uil-trash-alt font-size-18"></i>
                      </a>
                    </li>
                    <!-- <b-dropdown
                      class="list-inline-item"
                      variant="white"
                      right
                      toggle-class="text-muted font-size-18 px-2"
                    >
                      <template v-slot:button-content>
                        <i class="uil uil-ellipsis-v"></i>
                      </template>

                      <a class="dropdown-item" href="#">Block</a>
                      <a class="dropdown-item" href="#">Confirm</a>
                    </b-dropdown> -->
                  </ul>
                </template>

                <template v-slot:cell(nbProducts)="data">
                  <p> {{ data.item.nbProducts }}</p>
                </template>
              </b-table>
            </div>
            <div class="row">
              <div class="col">
                <div class="dataTables_paginate paging_simple_numbers float-end">
                  <ul class="pagination pagination-rounded mb-0">
                    <!-- pagination -->
                    <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage"></b-pagination>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
