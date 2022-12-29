<script>
/**
 * Checkout component
 */
import axios from "axios";
export default {
    head() {
        return {
            title: `${this.title} | Proof BackOffice`,
        };
    },
    methods: {
        goBack() {
            this.$router.go(-1);
        },
        async statusAction(action) {
            try {
                let newStatus = [...this.order.status]
                newStatus = newStatus.reverse()
                newStatus.push({
                    date: new Date(),
                    name: action
                })
                let result = await axios.put(process.env.baseUrl + "/orders/" + this.$route.params.id, {
                    status: newStatus
                })
                this.$router.go()
            } catch (error) {
                console.log(error);
            }
        }
    },
    data() {
        return {
            title: "Order",
            items: [{
                text: "Market",
            },
            {
                text: "Order",
                active: true,
            },
            ],
            baseUrl: null,
            order: null
        };
    },
    async mounted() {
        try {
            this.baseUrl = process.env.baseUrl;
            let result = await axios.get(process.env.baseUrl + "/orders/" + this.$route.params.id);
            result = result.data;
            this.order = result;
            this.order.status.reverse()

        } catch (error) {
            console.log(error);
        }
    },
    middleware: "authentication",
};
</script>

<template>
    <div>
        <PageHeader :title="title" :items="items" />
        <div class="row mb-4 justify-content-between" v-if="order">
            <div class="col-auto">
                <b-button variant="primary" @click="goBack">
                    <i class="uil uil-arrow-left mr-4"></i>
                    go back
                </b-button>
            </div>
            <div class="col-auto">
                <b-button variant="primary" @click="statusAction('validated')" v-if="order.status[0].name == 'created'">
                    <i class="uil uil-check mr-4"></i>
                    Validate
                </b-button>

                <b-button variant="danger" @click="statusAction('notValidated')"
                    v-if="order.status[0].name == 'created'">
                    <i class="uil uil-times mr-4"></i>
                    Refuse
                </b-button>

                <b-button variant="success" @click="statusAction('shipped')" v-if="order.status[0].name == 'validated'">
                    <i class="uil uil-truck-loading mr-4"></i>
                    Shipped
                </b-button>

                <b-button variant="danger" @click="statusAction('returned')" v-if="order.status[0].name == 'shipped'">
                    <i class="uil uil-exchange-alt mr-4"></i>
                    Returned
                </b-button>
            </div>
        </div>
        <div class="row" v-if="order">
            <div class="col-xl-8">
                <div class="custom-accordion">
                    <div class="card">
                        <a href="javascript: void(0);" class="text-dark" data-toggle="collapse"
                            v-b-toggle.checkout-billinginfo-collapse>
                            <div class="p-4">
                                <div class="media align-items-center">
                                    <div class="me-3">
                                        <i class="uil uil-receipt text-primary h2"></i>
                                    </div>
                                    <div class="media-body overflow-hidden">
                                        <h5 class="font-size-16 mb-1">Client details</h5>
                                        <p class="text-muted text-truncate mb-0">Here you will find the details of the
                                            client</p>
                                    </div>
                                    <i class="mdi mdi-chevron-up accor-down-icon font-size-24"></i>
                                </div>
                            </div>
                        </a>

                        <b-collapse id="checkout-billinginfo-collapse" visible>
                            <div class="p-4 border-top">
                                <form>
                                    <div>
                                        <div class="row">
                                            <div class="col-lg-4">
                                                <div class="form-group mb-4">
                                                    <label for="billing-name">First Name</label>
                                                    <input type="text" class="form-control" id="billing-name"
                                                        v-model="order.client.firstName" disabled />
                                                </div>
                                            </div>
                                            <div class="col-lg-4">
                                                <div class="form-group mb-4">
                                                    <label for="billing-email-address">Last Name</label>
                                                    <input type="email" class="form-control" id="billing-email-address"
                                                        v-model="order.client.lastName" disabled />
                                                </div>
                                            </div>
                                            <div class="col-lg-4">
                                                <div class="form-group mb-4">
                                                    <label for="billing-phone">Phone</label>
                                                    <input type="text" class="form-control" id="billing-phone"
                                                        v-model="order.client.phone" disabled />
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group mb-4">
                                            <label for="billing-address">Address</label>
                                            <textarea class="form-control" id="billing-address" rows="3"
                                                v-model="order.client.address.street" disabled></textarea>
                                        </div>

                                        <div class="row">
                                            <div class="col-lg-4">
                                                <div class="form-group mb-4 mb-lg-0">
                                                    <label>Country</label>

                                                    <input type="text" class="form-control" id="billing-city"
                                                        v-model="order.client.address.contry" disabled />
                                                </div>
                                            </div>

                                            <div class="col-lg-4">
                                                <div class="form-group mb-4 mb-lg-0">
                                                    <label for="billing-city">City</label>
                                                    <input type="text" class="form-control" id="billing-city"
                                                        v-model="order.client.address.city" disabled />
                                                </div>
                                            </div>

                                            <!-- <div class="col-lg-4">
                                                <div class="form-group mb-0">
                                                    <label for="zip-code">Zip / Postal code</label>
                                                    <input type="text" class="form-control" id="zip-code"
                                                        placeholder="Enter Postal code" />
                                                </div>
                                            </div> -->
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </b-collapse>
                    </div>

                    <div class="card">
                        <a href="javascript: void(0);" class="text-dark" data-toggle="collapse"
                            v-b-toggle.checkout-shippinginfo-collapse>
                            <div class="p-4">
                                <div class="media align-items-center">
                                    <div class="me-3">
                                        <i class="uil uil-truck text-primary h2"></i>
                                    </div>
                                    <div class="media-body overflow-hidden">
                                        <h5 class="font-size-16 mb-1">Shipping Info</h5>
                                        <p class="text-muted text-truncate mb-0">Client's shipping address in Google
                                            Maps</p>
                                    </div>
                                    <i class="mdi mdi-chevron-up accor-down-icon font-size-24"></i>
                                </div>
                            </div>
                        </a>

                        <b-collapse id="checkout-shippinginfo-collapse">
                            <div class="p-4 border-top">
                                <!-- <h5 class="font-size-14 mb-3">Shipping Info</h5> -->
                                <div class="row">

                                    <div class="col-6">
                                        <h5 class="font-size-16 mb-2">Scheduled for</h5>
                                        <p>{{ order.shippingTime }}</p>
                                    </div>
                                    <div class="col-6">
                                        <h5 class="font-size-16 mb-2">Location</h5><a
                                            :href="'https://maps.google.com/?q=' + order.client.address.lat + ',' + order.client.address.long"
                                            target="_blank"
                                            v-if="order.client.address.lat && order.client.address.long">
                                            <b-button variant="primary">
                                                Location in Google Maps
                                                <i class="uil uil-arrow-from-right mr-4"></i>
                                            </b-button>

                                        </a>
                                        <p v-else>No location was been submitted</p>
                                    </div>
                                </div>
                                <div class="row">


                                </div>
                            </div>
                        </b-collapse>
                    </div>

                    <!-- <div class="card">
                        <a class="collapsed text-dark" data-toggle="collapse" href="javascript:void(0);"
                            v-b-toggle.checkout-paymentinfo-collapse>
                            <div class="p-4">
                                <div class="media align-items-center">
                                    <div class="me-3">
                                        <i class="uil uil-bill text-primary h2"></i>
                                    </div>
                                    <div class="media-body overflow-hidden">
                                        <h5 class="font-size-16 mb-1">Payment Info</h5>
                                        <p class="text-muted text-truncate mb-0">Duis arcu tortor, suscipit eget</p>
                                    </div>
                                    <i class="mdi mdi-chevron-up accor-down-icon font-size-24"></i>
                                </div>
                            </div>
                        </a>

                        <b-collapse id="checkout-paymentinfo-collapse">
                            <div class="p-4 border-top">
                                <div>
                                    <h5 class="font-size-14 mb-3">Payment method :</h5>

                                    <div class="row">
                                        <div class="col-lg-3 col-sm-6">
                                            <div data-toggle="collapse">
                                                <label class="card-radio-label">
                                                    <input type="radio" name="pay-method" id="pay-methodoption1"
                                                        class="card-radio-input" />

                                                    <span class="card-radio text-center text-truncate">
                                                        <i class="uil uil-postcard d-block h2 mb-3"></i>
                                                        Credit / Debit Card
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        <div class="col-lg-3 col-sm-6">
                                            <div>
                                                <label class="card-radio-label">
                                                    <input type="radio" name="pay-method" id="pay-methodoption2"
                                                        class="card-radio-input" />

                                                    <span class="card-radio text-center text-truncate">
                                                        <i class="uil uil-paypal d-block h2 mb-3"></i>
                                                        Paypal
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        <div class="col-lg-3 col-sm-6">
                                            <div>
                                                <label class="card-radio-label">
                                                    <input type="radio" name="pay-method" id="pay-methodoption3"
                                                        class="card-radio-input" checked />

                                                    <span class="card-radio text-center text-truncate">
                                                        <i class="uil uil-money-bill d-block h2 mb-3"></i>
                                                        <span>Cash on Delivery</span>
                                                    </span>
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </b-collapse>
                    </div> -->
                </div>


                <!-- end row-->
            </div>
            <div class="col-xl-4">
                <div class="card checkout-order-summary">
                    <div class="card-body">
                        <div class="p-3 bg-light mb-4">
                            <h5 class="font-size-16 mb-0">
                                Order N° {{ order.id }}
                                <span class="float-end ms-2"></span>
                            </h5>
                        </div>
                        <div class="table-responsive">
                            <table class="table table-centered mb-0 table-nowrap">
                                <thead>
                                    <tr>
                                        <th class="border-top-0" style="width: 110px;" scope="col">Image</th>
                                        <th class="border-top-0" scope="col">Product Desc</th>
                                        <th class="border-top-0" scope="col">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in order.items" :key="index">
                                        <th scope="row">
                                            <img :src="baseUrl + item.productId.topPhoto.url" alt="product-img"
                                                title="product-img" class="avatar-md" />
                                        </th>
                                        <td>
                                            <h5 class="font-size-14 text-truncate">
                                                <nuxt-link :to="'/admin/market/myproduct/' + item.id" class="text-dark">
                                                    {{ item.productId.name }}
                                                </nuxt-link>
                                            </h5>
                                            <p class="text-muted mb-0">{{ item.quantity }} x {{ item.up }} dh</p>
                                        </td>
                                        <td>{{ item.subTotal }} dh</td>
                                    </tr>

                                    <tr>
                                        <td colspan="2">
                                            <h5 class="font-size-14 m-0">Sub Total :</h5>
                                        </td>
                                        <td>{{ order.subTotal }} dh</td>
                                    </tr>
                                    <!-- <tr>
                                        <td colspan="2">
                                            <h5 class="font-size-14 m-0">Discount :</h5>
                                        </td>
                                        <td>- $ 78</td>
                                    </tr> -->

                                    <tr>
                                        <td colspan="2">
                                            <h5 class="font-size-14 m-0">Shipping fee :</h5>
                                        </td>
                                        <td v-if="order.shippingFees != 0">{{ order.shippingFees }} dh</td>
                                        <td v-else class="text-success"><b>Gratuit</b></td>
                                    </tr>
                                    <tr>
                                        <td colspan="2">
                                            <h5 class="font-size-14 m-0">Tax :</h5>
                                        </td>
                                        <td>{{ order.tax }} dh</td>
                                    </tr>

                                    <tr class="bg-light">
                                        <td colspan="2">
                                            <h5 class="font-size-14 m-0">Total:</h5>
                                        </td>
                                        <td><b>{{ order.total }} dh</b></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div>
                    <orderstatus :status="order.status" />
                </div>
            </div>
        </div>
        <!-- end row -->
    </div>
</template>
