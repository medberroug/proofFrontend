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

      blogPosts: [],
      blogPosts: [],
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
          key: "title",
          label: "Title",
        },
        {
          key: "category",
          label: "Category",
        },
        {
          key: "when",
          label: "Created on",
        },
        {
          key: "nbOfLikes",
          label: "# Of likes",
        },
        {
          key: "nbOfComments",
          label: "# Of Comments",
        },
        {
          key: "status",
          label: "Status",
        },
        {
          key: "publishTime",
          label: "Publish Time",
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
      return this.blogPosts.length;
    },
  },

  async mounted() {
    try {
      this.totalRows = this.items.length;
      try {
        this.baseUrl = process.env.baseUrl;
        let result = await axios.get(
          process.env.baseUrl + "/getBlogPostsAdmin"
        );
        result = result.data;
        this.blogPosts = result.reverse();
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
        <NuxtLink to="/admin/blog/newBlog">
          <b-button variant="primary">
            <i class="uil uil-plus mr-2"></i>
            Add new
          </b-button></NuxtLink
        >
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
                :items="blogPosts"
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
                <template v-slot:cell(fullName)="data">
                  <img
                    v-if="data.item.photo"
                    :src="data.item.photo"
                    alt
                    class="avatar-xs rounded-circle me-2"
                  />
                  <div
                    v-if="!data.item.photo"
                    class="avatar-xs d-inline-block me-2"
                  >
                    <div
                      class="
                        avatar-title
                        bg-soft-Primary
                        rounded-circle
                        text-Primary
                      "
                    >
                      <i class="mdi mdi-account-circle m-0"></i>
                    </div>
                  </div>
                  <a href="#" class="text-body">
                    <b> {{ data.item.fullName }}</b>
                  </a>
                </template>
                <template v-slot:cell(status)="data">
                  <div
                    class="badge badge-pill bg-soft-success font-size-12"
                    :class="{
                      'bg-soft-success': data.item.status === true,
                      'bg-soft-danger': data.item.status === false,
                    }"
                  >
                    <span v-if="data.item.status">Published</span>
                    <span v-else>Draft</span>
                  </div>
                </template>
                <template v-slot:cell(category)="data">
                  <div class="badge badge-pill bg-soft-primary font-size-12">
                    {{ data.item.category }}
                  </div>
                </template>
                <template v-slot:cell(title)="data">
                  <div class="font-size-14">
                    <b> {{ data.item.title }}</b>
                  </div>
                </template>
                <template v-slot:cell(publishTime)="data">
                  <div class="font-size-12">
                    {{ formateDate(data.item.publishTime) }}
                  </div>
                </template>
                <template v-slot:cell(when)="data">
                  <div class="font-size-12">
                    {{ formateDate(data.item.when) }}
                  </div>
                </template>
                <template v-slot:cell(actions)="data">
                  <ul class="list-inline mb-0">
                    <li class="list-inline-item">
                      <a
                        href="javascript:void(0);"
                        class="px-2 text-primary"
                        v-b-tooltip.hover
                        title="View"
                      >
                        <i class="uil uil-eye font-size-18"></i>
                      </a>
                    </li>
                    <li class="list-inline-item">
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
                      v-if="data.item.status"
                      @click="actionOnPost(data.item.id, 'unpublish')"
                    >
                      <a
                        href="javascript:void(0);"
                        class="px-2 text-danger"
                        v-b-tooltip.hover
                        title="Unpublish"
                      >
                        <i class="uil uil-file-lanscape-slash font-size-18"></i>
                      </a>
                    </li>
                    <li
                      class="list-inline-item"
                      v-else
                      @click="actionOnPost(data.item.id, 'publish')"
                    >
                      <a
                        href="javascript:void(0);"
                        class="px-2 text-success"
                        v-b-tooltip.hover
                        title="Publish"
                      >
                        <i class="uil uil-file-landscape font-size-18"></i>
                      </a>
                    </li>
                    <li
                      class="list-inline-item"
                      @click="actionOnPost(data.item.id, 'delete')"
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
