<script>
/**
 * User list component
 */
import { eoLocale } from "date-fns/locale/eo";
import { format, parseISO } from "date-fns";
// import parseISO from 'date-fns/parseISO'
import axios from "axios";
export default {
  head() {
    return {
      title: `${this.title} | Proof BackOffice`,
    };
  },
  data() {
    return {
      title: "Categories",
      baseUrl: null,
      items: [
        {
          text: "Categories",
        },
        {
          text: "Categorie's list",
          active: true,
        },
      ],
      addNewCategoryModal: false,
      myNewCategory: { name: null, rank: null },
      categories: [],
      chosenCategory: null,
      editCategoryModal: false,
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
        {
          key: "rank",
          label: "Rank",
                sortable: true
        },
        "actions",
      ],
      editedCategory: {
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
      return this.categories.length;
    },
  },

  async mounted() {
    try {
      this.totalRows = this.items.length;
      try {
        this.baseUrl = process.env.baseUrl;
        let result = await axios.get(process.env.baseUrl + "/categories");
        result = result.data.category;
        this.categories = result.reverse();
        console.log(result);
      } catch (error) {}
    } catch (error) {}
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
    async addNewCategory() {
      this.categories.push({
        name: this.myNewCategory.name,
        rank: this.myNewCategory.rank,
      });
      let result = await axios.put(process.env.baseUrl + "/categories", {
        category: this.categories,
      });
      this.$router.go();
    },
    async deleteCategory(id) {
      for (let i = 0; i < this.categories.length; i++) {
        if (this.categories[i].id == id) {
          this.categories.splice(i, 1);
        }
      }
      let result = await axios.put(process.env.baseUrl + "/categories", {
        category: this.categories,
      });
      this.$router.go();
    },
    async editCategory(id) {
      
      for (let i = 0; i < this.categories.length; i++) {
        if (this.categories[i].id == this.editedCategory.id) {
          this.categories[i].name=this.editedCategory.name;
           this.categories[i].rank=this.editedCategory.rank;
        }
      }
      let result = await axios.put(process.env.baseUrl + "/categories", {
        category: this.categories,
      });
      this.editCategoryModal = false;
      this.chosenCategory = 0;
      this.$router.go();
    },
    showEditCategoryModal(id) {
      this.editedCategory.id = id;
      for (let i = 0; i < this.categories.length; i++) {
        if (this.categories[i].id == id) {
          this.chosenCategory = i;
          this.editCategoryModal = true;
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
    <b-modal v-model="editCategoryModal" centered hide-footer v-if="categories">
      <template #modal-title> Edit category </template>

      <label for="input-live">Category name:</label>
      <b-form-input v-model="editedCategory.name" type="text"></b-form-input>
      <label for="input-live" class="mt-3">Category rank:</label>
      <b-form-input v-model="editedCategory.rank" type="text"></b-form-input>
      <center>
        <b-button
          class="mt-3"
          block
          variant="primary"
          @click="editCategory(editedCategory.id)"
        >
          Add</b-button
        >
      </center></b-modal
    >
    <!-- NEWW CATEGORY XXXXXXXXXXXXXXXXXXXXXXX vvvvvvvvvvvvvvvv -->
    <b-modal
      v-model="addNewCategoryModal"
      centered
      hide-footer
      v-if="categories"
    >
      <template #modal-title> Add new category </template>

      <label for="input-live">Category name:</label>
      <b-form-input v-model="myNewCategory.name" type="text"></b-form-input>
      <label for="input-live" class="mt-3">Category rank:</label>
      <b-form-input v-model="myNewCategory.rank" type="text"></b-form-input>
      <center>
        <b-button
          class="mt-3"
          block
          variant="primary"
          @click="addNewCategory()"
        >
          edit</b-button
        >
      </center></b-modal
    >
    <PageHeader :title="title" :items="items" />
    <div class="row" v-if="categories">
      <div class="col-sm-12 col-md-3">
        <b-button variant="primary" @click="addNewCategoryModal = true">
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
              <b-table
                class="table table-centered table-nowrap"
                :items="categories"
                :fields="fields"
                responsive="sm"
                :per-page="perPage"
                :current-page="currentPage"
                :sort-by.sync="sortBy"
                :sort-desc.sync="sortDesc"
                :filter="filter"
                :filter-included-fields="filterOn"
                @filtered="onFiltered"
              >
                <!-- <template v-slot:cell(check)="data">
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input" :id="`contacusercheck${data.item.id}`" />
                                    <label class="custom-control-label" :for="`contacusercheck${data.item.id}`"></label>
                                </div>
                            </template> -->
                <template v-slot:cell(actions)="data">
                  <ul class="list-inline mb-0">
                    <li
                      class="list-inline-item"
                      @click="showEditCategoryModal(data.item.id)"
                    >
                      <a
                        href="javascript:void(0);"
                        class="px-2 text-primary"
                        v-b-tooltip.hover
                        title="Edit"
                      >
                        <i class="uil uil-pen font-size-18"></i>
                      </a>
                    </li>

                    <li
                      class="list-inline-item"
                      @click="deleteCategory(data.item.id)"
                    >
                      <a
                        href="javascript:void(0);"
                        class="px-2 text-danger"
                        v-b-tooltip.hover
                        title="Delete"
                      >
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
              </b-table>
            </div>
            <div class="row">
              <div class="col">
                <div
                  class="dataTables_paginate paging_simple_numbers float-end"
                >
                  <ul class="pagination pagination-rounded mb-0">
                    <!-- pagination -->
                    <b-pagination
                      v-model="currentPage"
                      :total-rows="rows"
                      :per-page="perPage"
                    ></b-pagination>
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
