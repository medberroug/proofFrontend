<script>
/**
 * User list component
 */
import axios from "axios";
export default {
  head() {
    return {
      title: `${this.title} | Proof BackOffice`,
    };
  },
  data() {
    return {
      title: "Users List",
      baseUrl: null,
      items: [
        {
          text: "Users",
        },
        {
          text: "Users List",
          active: true,
        },
      ],

      profiles: [],
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
          key: "fullName",
          label: "Full Name",
        },
        {
          key: "phone",
          label: "Phone",
        },
        {
          key: "city",
          label: "City",
        },
        {
          key: "accountStatus",
          label: "Status",
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
      return this.profiles.length;
    },
  },

  async mounted() {
    try {
      this.totalRows = this.items.length;
      this.baseUrl = process.env.baseUrl;
      console.log(process.env.baseUrl + "/userprofiles");
      let result = await axios.get(process.env.baseUrl + "/userprofiles");
      result = result.data;

      for (let i = 0; i < result.length; i++) {
        let accountStatus = "active";
        if (result[i].userId.blocked) {
          accountStatus = "blocked";
        } else if (!result[i].userId.confirmed && !result[i].userId.blocked) {
          accountStatus = "pending";
        }
        let newProfile = {
          fullName: result[i].firstName + " " + result[i].lastName,
          city: result[i].address.city,
          photo: this.baseUrl + result[i].photo.url,
          phone: result[i].phone,
          accountStatus: accountStatus,
        };
        this.profiles.push(newProfile);
      }
      console.log(this.profiles);
    } catch (error) {}
  },
  methods: {
    /**
     * Search the table data with search input
     */
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
              <b-table
                class="table table-centered table-nowrap"
                :items="profiles"
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
                <template v-slot:cell(accountStatus)="data">
                  <div
                    class="badge badge-pill bg-soft-success font-size-12"
                    :class="{
                      'bg-soft-warning': data.item.accountStatus === 'pending',
                      'bg-soft-success': data.item.accountStatus === 'active',
                      'bg-soft-danger': data.item.accountStatus === 'blocked',
                    }"
                  >
                    {{ data.item.accountStatus }}
                  </div>
                </template>
                <template v-slot:cell(actions)>
                  <ul class="list-inline mb-0">
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
                    <li class="list-inline-item">
                      <a
                        href="javascript:void(0);"
                        class="px-2 text-danger"
                        v-b-tooltip.hover
                        title="Delete"
                      >
                        <i class="uil uil-trash-alt font-size-18"></i>
                      </a>
                    </li>
                    <b-dropdown
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
                    </b-dropdown>
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
