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
      title: "Blog Posts",
      baseUrl: null,
      items: [
        {
          text: "Blog",
        },
        {
          text: "Blog Posts",
          active: true,
        },
      ],

      categories: [],
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
        },
        {
          key: "rank",
          label: "Rank",
        },
        "actions",
      ],
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
        let result = await axios.get(
          process.env.baseUrl + "/categories"
        );
        result = result.data.category;
        this.categories = result.reverse();
        console.log(result);
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
    async actionOnPost(id, action) {
      let result = await axios.get(
        process.env.baseUrl + "/actionOnPost/" + id + "/" + action
      );
      this.$router.go();
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
    <PageHeader :title="title" :items="items" />
    <div class="row">
      <div class="col-sm-12 col-md-3">
        <b-button variant="primary">
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
              <b-table class="table table-centered table-nowrap" :items="categories" :fields="fields" responsive="sm"
                :per-page="perPage" :current-page="currentPage" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc"
                :filter="filter" :filter-included-fields="filterOn" @filtered="onFiltered">
                <!-- <template v-slot:cell(check)="data">
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input" :id="`contacusercheck${data.item.id}`" />
                                    <label class="custom-control-label" :for="`contacusercheck${data.item.id}`"></label>
                                </div>
                            </template> -->
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
