<script>
/**
 * User list component
 */
import { eoLocale } from "date-fns/locale/fr";
import { format, parseISO } from "date-fns";
import formatDistanceToNow from "date-fns/formatDistanceToNow";
import axios from "axios";
export default {
    head() {
        return {
            title: `${this.title} | Proof BackOffice`,
        };
    },
    data() {
        return {
            title: "Archived Orders",
            baseUrl: null,
            items: [
                {
                    text: "Orders",
                },
                {
                    text: "Archived  Orders",
                    active: true,
                },
            ],

            babies: [],
            totalRows: 1,
            currentPage: 1,
            perPage: 10,
            pageOptions: [10, 25, 50, 100],
            filter: null,
            filterOn: [],
            sortBy: "age",
            sortDesc: false,
            ordersList: [],
            fields: [
                {
                    key: "id",
                    label: "ID",
                    sortable: true,
                },
                {
                    key: "clients",
                    label: "Clients",
                    sortable: true,
                },
                {
                    key: "total",
                    label: "Total TTC",
                    sortable: true,
                },
                {
                    key: "phone",
                    label: "Phone",
                    sortable: true,
                },
                {
                    key: "shippingTime",
                    label: "Shipping time",
                    sortable: true,
                },
                {
                    key: "status",
                    label: "Status",
                    sortable: true,
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
            return this.ordersList.length;
        },
    },

    async mounted() {
        try {
            this.totalRows = this.items.length;
            this.baseUrl = process.env.baseUrl;

            let result = await axios.get(process.env.baseUrl + "/orders");
            result = result.data;
            let orders = [];
            for (let i = 0; i < result.length; i++) {
                let anOrder = {
                    id: result[i].id,
                    clients: result[i].client.firstName + " " + result[i].client.lastName,
                    total: result[i].total,
                    phone: result[i].client.phone,
                    shippingTime: result[i].shippingTime,
                    status: result[i].status[result[i].status.length - 1].name,
                };
                if (anOrder.status == 'closed' || anOrder.status == 'cancelled' || anOrder.status == 'returned'
                    || anOrder.status == 'notValidated') {
                    orders.push(anOrder);
                }
            }
            this.ordersList = orders;
            console.log("XX");
        } catch (error) {
            console.log(error);
        }
    },
    methods: {
        /**
         * Search the table data with search input
         */
        async actionOnUser(id, action) {
            try {
                if (action == "confirm") {
                    let result = await axios.put(process.env.baseUrl + "/users/" + id, {
                        confirmed: true,
                    });
                } else if (action == "block") {
                    let result = await axios.put(process.env.baseUrl + "/users/" + id, {
                        blocked: true,
                    });
                } else if (action == "unblock") {
                    let result = await axios.put(process.env.baseUrl + "/users/" + id, {
                        blocked: false,
                    });
                } else if (action == "unconfirm") {
                    let result = await axios.put(process.env.baseUrl + "/users/" + id, {
                        confirmed: false,
                    });
                } else if (action == "delete") {
                    let result = await axios.delete(process.env.baseUrl + "/users/" + id);
                }
                this.$router.go();
            } catch (error) { }
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

        <!-- <div class="row">
            <div class="col-sm-12 col-md-3">
                <NuxtLink to="/admin/market/newProduct">
                    <b-button variant="primary">
                        <i class="uil uil-plus mr-2"></i>
                        Add new
                    </b-button>
                </NuxtLink>
            </div>
        </div> -->
        <div class="row mt-3">
            <!-- <center ><p>There's no archived orders for the moment</p></center> -->
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <!-- Table -->
                        <div class="table-responsive mb-0">
                            <b-table class="table table-centered table-nowrap" :items="ordersList" :fields="fields"
                                responsive="sm" :per-page="perPage" :current-page="currentPage" :sort-by.sync="sortBy"
                                :sort-desc.sync="sortDesc" :filter="filter" :filter-included-fields="filterOn"
                                @filtered="onFiltered">
                                <!-- <template v-slot:cell(check)="data">
                                <div class="custom-control custom-checkbox">
                                    <input type="checkbox" class="custom-control-input" :id="`contacusercheck${data.item.id}`" />
                                    <label class="custom-control-label" :for="`contacusercheck${data.item.id}`"></label>
                                </div>
                            </template> -->




                                <template v-slot:cell(status)="data">
                                    <div class="
                      badge badge-pill
                      bg-soft-success
                      font-size-12
                      bg-soft-dark
                    " v-if="data.item.status == 'draft'">
                                        <span>{{ data.item.status }}</span>
                                    </div>


                                    <div class="
                      badge badge-pill
                      bg-soft-success
                      font-size-12
                      bg-soft-warning
                    " v-if="data.item.status == 'created'">
                                        <span>{{ data.item.status }}</span>
                                    </div>


                                    <div class="
                      badge badge-pill
                      bg-soft-success
                      font-size-12
                      bg-soft-primary
                    " v-if="data.item.status == 'validated'">
                                        <span>{{ data.item.status }}</span>
                                    </div>


                                    <div class="
                      badge badge-pill
                      bg-soft-success
                      font-size-12
                      bg-soft-danger
                    " v-if="data.item.status == 'notValidated'">
                                        <span>{{ data.item.status }}</span>
                                    </div>


                                    <div class="
                      badge badge-pill
                      bg-soft-success
                      font-size-12
                      bg-soft-success
                    " v-if="data.item.status == 'shipped'">
                                        <span>{{ data.item.status }}</span>
                                    </div>


                                    <div class="
                      badge badge-pill
                      bg-soft-success
                      font-size-12
                      bg-soft-danger
                    " v-if="data.item.status == 'cancelled'">
                                        <span>{{ data.item.status }}</span>
                                    </div>


                                    <div class="
                      badge badge-pill
                      bg-soft-success
                      font-size-12
                      bg-soft-success
                    " v-if="data.item.status == 'closed'">
                                        <span>{{ data.item.status }}</span>
                                    </div>

                                    <div class="
                      badge badge-pill
                      bg-soft-success
                      font-size-12
                      bg-soft-danger
                    " v-if="data.item.status == 'returned'">
                                        <span>{{ data.item.status }}</span>
                                    </div>




                                </template>
                                <template v-slot:cell(actions)="data">
                                    <ul class="list-inline mb-0">
                                        <Nuxt-link :to="'/admin/market/orders/myOrder/' + data.item.id">
                                            <li class="list-inline-item">
                                                <a href="javascript:void(0);" class="px-2 text-primary"
                                                    v-b-tooltip.hover title="View">
                                                    <i class="uil uil-eye font-size-18"></i>
                                                </a>
                                            </li>
                                        </Nuxt-link>

                                        <!-- <li
                      class="list-inline-item"
                      v-if="!data.item.confirmed"
                      @click="actionOnUser(data.item.userid, 'confirm')"
                    >
                      <a
                        href="javascript:void(0);"
                        class="px-2 text-success"
                        v-b-tooltip.hover
                        title="Confirm"
                      >
                        <i class="uil uil-shield-check font-size-18"></i>
                      </a>
                    </li>
                    <li
                      class="list-inline-item"
                      v-if="data.item.confirmed"
                      @click="actionOnUser(data.item.userid, 'unconfirm')"
                    >
                      <a
                        href="javascript:void(0);"
                        class="px-2 text-warning"
                        v-b-tooltip.hover
                        title="UnConfirm"
                      >
                        <i class="uil uil-shield-slash font-size-18"></i>
                      </a>
                    </li>
                    <li
                      class="list-inline-item"
                      v-if="!data.item.blocked"
                      @click="actionOnUser(data.item.userid, 'block')"
                    >
                      <a
                        href="javascript:void(0);"
                        class="px-2 text-warning"
                        v-b-tooltip.hover
                        title="Block"
                      >
                        <i class="uil uil-file-block-alt font-size-18"></i>
                      </a>
                    </li>
                    <li
                      class="list-inline-item"
                      v-if="data.item.blocked"
                      @click="actionOnUser(data.item.userid, 'unblock')"
                    >
                      <a
                        href="javascript:void(0);"
                        class="px-2 text-success"
                        v-b-tooltip.hover
                        title="UnBlock"
                      >
                        <i class="uil uil-file-check font-size-18"></i>
                      </a>
                    </li> -->
                                        <!-- <li class="list-inline-item" @click="actionOnUser(data.item.userid, 'delete')">
                      <a
                        href="javascript:void(0);"
                        class="px-2 text-danger"
                        v-b-tooltip.hover
                        title="Delete"
                      >
                        <i class="uil uil-trash-alt font-size-18"></i>
                      </a>
                    </li> -->
                                    </ul>
                                </template>
                            </b-table>
                        </div>
                        <div class="row">
                            <div class="col">
                                <div class="dataTables_paginate paging_simple_numbers float-end">
                                    <ul class="pagination pagination-rounded mb-0">
                                        <!-- pagination -->
                                        <b-pagination v-model="currentPage" :total-rows="rows"
                                            :per-page="perPage"></b-pagination>
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
