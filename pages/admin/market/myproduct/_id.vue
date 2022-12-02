<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import vue2Dropzone from "vue2-dropzone";
import { eoLocale } from "date-fns/locale/eo";
import { format, parseISO } from "date-fns";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import countTo from "vue-count-to";

/**
 * Editor component
 */
export default {
  components: {
    ckeditor: CKEditor.component,
    vueDropzone: vue2Dropzone,
    countTo,
  },
  head() {
    return {
      title: `${this.title} | Proof BackOffice`,
    };
  },

  data() {
    return {
      title: "Product details",
      items: [
        {
          text: "Products",
          href: "/madmin/market/products",
        },
        {
          text: "Product details",
          active: true,
        },
      ],
      loading: false,
      dropzoneOptions: {
        url: "https://api.proof.ma/upload",
        thumbnailWidth: 150,
        maxFilesize: 0.5,

        uploadMultiple: false,
        maxFiles: 1,
      },
      slide: 0,
      slide1: 0,
      sliding: null,
      editor: ClassicEditor,
      editorData:
        "<h3>Hello World!</h3><h5><b>This is an simple editable area.</b></h5>",
      status: false,
      baseUrl: null,
      showCreated: false,
      categoriesList: null,
      fileMissing: false,
      file: "",
      file2: "",
      blogPost: {
        title: null,
        text: null,
        status: false,
        images: [],
        by: null,
        category: null,
        badge: null,
        publishTime: null,
      },
      uploadedImages: [],
      producersList: null,
      newProduct: null,
      rowsRatings: 1,
      currentPageRatings: 1,
      perPageRatings: 10,
      pageOptionsRatings: [10, 25, 50, 100],
      totalRowsStock: 1,
      currentPageStock: 1,
      perPageStock: 10,
      pageOptionsStock: [10, 25, 50, 100],
      aqCalculator: 0,
      fieldsRatings: [
        {
          key: "id",
          label: "Id",
          sortable: true,
        },
        {
          key: "Rating",
          label: "rating",
          sortable: true,
        },
        {
          key: "by",
          label: "by",
          sortable: true,
        },
        {
          key: "added",
          label: "Date",
          sortable: true,
        },

        // "actions",
      ],
      avgPrice: 0,
      stockOut: 0,
      stockIn: 0,
      spent: 0,
      sortDesc: false,
      addStockModal: false,
      QuantityAdded: null,
      QuantityPrice: null,
      fieldsStock: [
        {
          key: "id",
          label: "Id",
          sortable: true,
        },
        {
          key: "initialQuantity",
          label: "Initial Quantity",
          sortable: true,
        },
        {
          key: "avalaibleQuantity",
          label: "Avalaible Quantity",
          sortable: true,
        },
        {
          key: "unitBuyingPrice",
          label: "Unit Buying Price (TTC en DH)",
          sortable: true,
        },

        {
          key: "added",
          label: "Date",
          sortable: true,
        },

        // "actions",
      ],
    };
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    formateDate(date) {
      let result = format(parseISO(date), "dd/MM/yyyy hh:mm", {
        locale: eoLocale,
      });
      return result;
    },
    goBack() {
      this.$router.go(-1);
    },
    async uploadImages() {
      this.file2 = this.$refs.file2.files[0];
      if (this.file2) {
        let formData = new FormData();
        formData.append("files", this.file2);
        let myImage = await axios
          .post(process.env.baseUrl + "/upload", formData)
          .catch((err) => {
            this.fileMissing = true;
          });

        this.uploadedImages.push(myImage.data[0]);
      }
    },
    async update(action) {
      if (action == "desactivate") {
        let response = await axios
          .put(process.env.baseUrl + "/products/" + this.$route.params.id, {
            status: false,
          })
          .catch((err) => {
            this.fileMissing = true;
          });
        this.$router.go();
      } else if (action == "activate") {
        let response = await axios
          .put(process.env.baseUrl + "/products/" + this.$route.params.id, {
            status: true,
          })
          .catch((err) => {
            this.fileMissing = true;
          });
        this.$router.go();
      } else if (action == "delete") {
        let response = await axios
          .delete(process.env.baseUrl + "/products/" + this.$route.params.id)
          .catch((err) => {
            this.fileMissing = true;
          });
        this.$router.push("/admin/market/products");
      }
    },
    async addToStock() {
      if (this.QuantityAdded && this.QuantityPrice) {
        this.newProduct.stock.reverse();
        let newStock = []
        for(let i=0;i<this.newProduct.stock.length;i++){
            newStock.push(this.newProduct.stock[i])
        }
         newStock.push({
          added: new Date(),
          initialQuantity: this.QuantityAdded,
          avalaibleQuantity: this.QuantityAdded,
          unitBuyingPrice: this.QuantityPrice,
        });
        let response = await axios
          .put(process.env.baseUrl + "/products/" + this.$route.params.id, {
            stock: newStock,
          })
         console.log(newStock);
        this.$router.go();
      }
    },
    async submit() {
      this.loading = true;
      let formData = new FormData();

      // this.fileMissing = true;
      if (this.file) {
        formData.append("files", this.file);
        try {
          let myImage = await axios
            .post(process.env.baseUrl + "/upload", formData)
            .catch((err) => {
              this.fileMissing = true;
            });
          myImage = myImage.data;
          this.newProduct.topPhoto = {
            id: myImage[0].id,
          };
          for (let m = 0; m < this.uploadedImages.length; m++) {
            this.newProduct.photos.push({
              id: this.uploadedImages[m].id,
            });
          }
          // this.$router.push("/clients/note-de-frais/" + result.data.id);
          let mySpecLines = this.newProduct.specsInit.split("\n");
          for (let i = 0; i < mySpecLines.length; i++) {
            this.newProduct.specs.push({
              specText: mySpecLines[i],
            });
          }

          for (let j = 0; j < this.categoriesList.length; j++) {
            if (this.newProduct.category.id == this.categoriesList[j].name) {
              this.newProduct.category.id = this.categoriesList[j].id;
            }
          }

          for (let k = 0; k < this.producersList.length; k++) {
            if (this.newProduct.producer.id == this.producersList[k].name) {
              this.newProduct.producer.id = this.producersList[k].id;
            }
          }

          this.newProduct.stock = [
            {
              added: new Date(),
              initialQuantity: this.newProduct.initialQuantity,
              avalaibleQuantity: this.newProduct.initialQuantity,
              unitBuyingPrice: this.newProduct.unitBuyingPrice,
            },
          ];
          let result2 = await axios.post(
            process.env.baseUrl + "/products",
            this.newProduct
          );
          console.log(result2.data);
          this.showCreated = true;
          const delay = (ms) => new Promise((res) => setTimeout(res, ms));
          await delay(5000);
          //   this.$router.push("/admin/market/products/" + result2.data.id);
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  async mounted() {
    try {
      this.baseUrl = process.env.baseUrl;
      let result = await axios.get(process.env.baseUrl + "/productcategories");
      result = result.data;
      this.categoriesList = result;

      let result2 = await axios.get(process.env.baseUrl + "/producers");
      result2 = result2.data;
      this.producersList = result2;
      console.log(this.$route.params.id);
      let result3 = await axios.get(
        process.env.baseUrl + "/products/" + this.$route.params.id
      );
      result3 = result3.data;
      console.log(result3);
      this.newProduct = result3;
      this.newProduct.photos.reverse();
      this.newProduct.photos.push(this.newProduct.topPhoto);
      this.newProduct.photos.reverse();
      let totalStockQuantity = 0;
      this.avgPrice = 0;
      this.stockOut = 0;
      this.stockIn = 0;
      this.spent = 0;
      for (let i = 0; i < this.newProduct.stock.length; i++) {
        this.aqCalculator =
          this.aqCalculator + this.newProduct.stock[i].avalaibleQuantity;
        totalStockQuantity =
          totalStockQuantity + this.newProduct.stock[i].initialQuantity;
        this.avgPrice =
          this.avgPrice +
          this.newProduct.stock[i].initialQuantity *
            this.newProduct.stock[i].unitBuyingPrice;
        this.stockOut =
          this.stockOut +
          this.newProduct.stock[i].initialQuantity -
          this.newProduct.stock[i].avalaibleQuantity;
        this.stockIn = this.stockIn + this.newProduct.stock[i].initialQuantity;
        this.spent =
          this.spent +
          this.newProduct.stock[i].initialQuantity *
            this.newProduct.stock[i].unitBuyingPrice;
      }
      this.avgPrice = this.avgPrice / this.stockIn;
      this.newProduct.stock.reverse();
      this.newProduct.ratings.reverse();
    } catch (error) {
      console.log(error);
    }
  },
  middleware: "authentication",
};
</script>

<template>
  <div>
    <b-modal v-model="addStockModal" centered hide-footer v-if="newProduct">
      <template #modal-title> Add to Stock : {{ newProduct.name }} </template>
      <center>
        <!-- <p><b>You are deleting this blog post</b>, do you want to continue?</p> -->
      </center>
      <b-form-group class="mb-3" label="Quantity" label-for="Quantity">
        <b-form-input
          for="Quantity"
          placeholder="100..."
          v-model="QuantityAdded"
        ></b-form-input>
      </b-form-group>
      <b-form-group
        class="mb-3"
        label="Items price (TTC en DH)"
        label-for="Items price"
      >
        <b-form-input
          for="Items price "
          placeholder="15..."
          v-model="QuantityPrice"
        ></b-form-input>
      </b-form-group>
      <div class="row">
        <center v-if="QuantityAdded && QuantityPrice">
          <h6>{{ QuantityAdded }}</h6>
          x
          <h6>{{ QuantityPrice }} DH</h6>
          = {{ QuantityPrice * QuantityAdded }} DH
          <h6></h6>
        </center>
      </div>
      <center>
        <b-button
          class="m-3"
          block
          variant="outline-primary"
          @click="deleteMessage = false"
        >
          Cancel</b-button
        >
        <b-button
          class="m-3"
          block
          variant="primary"
          @click="addToStock()"
        >
          Submit</b-button
        >
        
      </center></b-modal
    >

    <PageHeader :title="title" :items="items" />
    <div class="row" v-if="newProduct">
      <div class="col-12">
        <b-alert show v-if="showCreated" variant="success" class="mb-3">
          <i class="uil uil-check"></i> <b>Product was been created</b>, you
          will be redirected to it in 5 seconds...
        </b-alert>
        <div class="row mb-3">
          <div class="col-auto">
            <b-button variant="primary" @click="goBack">
              <i class="uil uil-arrow-left mr-4"></i>
              go back
            </b-button>
            <b-button
              variant="purple"
              @click="addStockModal = true"
              class="mx-2"
            >
              <i class="uil uil-plus"></i>
              Add Stock
            </b-button>
            <b-button variant="dark" @click="goBack" class="mx-2">
              <i class="uil uil-edit"></i>
              Edit
            </b-button>
            <b-button
              variant="warning"
              @click="update('desactivate')"
              class="mx-2"
              v-if="newProduct.status"
            >
              <i class="uil uil-shield-slash"></i>
              Desactivate
            </b-button>
            <b-button
              variant="success"
              @click="update('activate')"
              class="mx-2"
              v-if="!newProduct.status"
            >
              <i class="uil uil-shield"></i>
              Activate
            </b-button>
            <b-button
              variant="danger"
              @click="update('delete')"
              class="mx-2"
              v-if="stockOut == 0"
            >
              <i class="uil uil-trash"></i>
              Delete
            </b-button>
          </div>
        </div>
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-8 pl-2">
                <!-- <h4 class="card-title mb-4">Add a new blog post</h4> -->
                <!-- Editor -->
                <b-form-group class="mb-3" label="Name" label-for="Name">
                  <b-form-input
                    for="Name"
                    placeholder="Name of the product..."
                    v-model="newProduct.name"
                    disabled
                  ></b-form-input>
                </b-form-group>

                <div class="row">
                  <div class="col-3 mr-3">
                    <b-form-group
                      class="mb-3"
                      label="Unit price (TTC in DH)"
                      label-for="Unit price (TTC in DH)"
                    >
                      <b-form-input
                        for="Unit price (TTC in DH)"
                        placeholder="99.98 ..."
                        v-model="newProduct.up"
                        disabled
                      ></b-form-input>
                    </b-form-group>
                  </div>
                  <div class="col-3 mr-3">
                    <b-form-group class="mb-3" label="Code" label-for="Code">
                      <b-form-input
                        for="Code"
                        placeholder="PROD0001..."
                        v-model="newProduct.code"
                        disabled
                      ></b-form-input>
                    </b-form-group>
                  </div>

                  <div class="col-3 mr-3">
                    <b-form-group
                      class="mb-3"
                      label="Discount ( 0 to 100 in %)"
                      label-for="Discount ( 0 to 100 in %)"
                    >
                      <b-form-input
                        for="Discount ( 0 to 100 in %)"
                        placeholder="20 ..."
                        v-model="newProduct.discount"
                        disabled
                      ></b-form-input>
                    </b-form-group>
                  </div>
                  <div class="col-3 mr-3">
                    <b-form-group
                      class="mb-3"
                      label="Publishing status"
                      label-for="title"
                    >
                      <div
                        class="
                          badge badge-pill
                          bg-soft-success
                          font-size-12
                          bg-soft-success
                        "
                        v-if="newProduct.status"
                      >
                        <span>Published</span>
                      </div>
                      <div
                        class="
                          badge badge-pill
                          bg-soft-success
                          font-size-12
                          bg-soft-danger
                        "
                        v-else
                      >
                        <span>Draft</span>
                      </div>
                    </b-form-group>
                  </div>
                </div>

                <div class="row">
                  <div class="col-8 mr-3">
                    <b-form-group
                      class="mb-3"
                      label="Description"
                      label-for="title"
                    >
                      <ckeditor
                        v-model="newProduct.description"
                        :editor="editor"
                        disabled
                      ></ckeditor>
                    </b-form-group>
                  </div>
                  <div class="col-4 mr-3">
                    <b-form-group class="mb-3" label="Unit" label-for="Unit">
                      <b-form-input
                        for="Unit"
                        placeholder="m² ..."
                        v-model="newProduct.unit"
                        disabled
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group
                      class="mb-3"
                      label="Producer"
                      label-for="Producer"
                    >
                      <b-form-input
                        for="Producer"
                        placeholder="m² ..."
                        v-model="newProduct.producer.name"
                        disabled
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group
                      class="mb-3"
                      label="Category"
                      label-for="Category"
                    >
                      <b-form-input
                        for="Category"
                        placeholder="Category..."
                        v-model="newProduct.category"
                        disabled
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group
                      class="mb-3"
                      label="Security Stock Quantity"
                      label-for="Security Stock Quantity"
                    >
                      <b-form-input
                        for="Security Stock Quantity"
                        placeholder="10 ..."
                        v-model="newProduct.securityStockQuantity"
                        disabled
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group
                      class="mb-3"
                      label="Specifications "
                      label-for="Specifications"
                    >
                      <ul>
                        <li
                          v-for="(spec, index) in newProduct.specs"
                          :key="index"
                        >
                          {{ spec.specText }}
                        </li>
                      </ul>
                    </b-form-group>
                  </div>
                  <div class="col-3"></div>
                </div>
              </div>
              <div class="col-4">
                <!-- <b-form-group
                  class="mb-3"
                  label="Publishing date"
                  label-for="title"
                  v-if="blogPost.status == false"
                >
                  <b-form-input
                    id="date-time"
                    type="datetime-local"
                    v-model="blogPost.publishTime"
                  ></b-form-input>
                </b-form-group> -->
                <!-- <b-form-group class="mb-3" label="Category" label-for="title">
                  <select class="form-select" v-model="newProduct.category.id">
                    <option
                      v-for="(category, index) in categoriesList"
                      :key="index"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </b-form-group> -->

                <!-- <b-form-group
                  class="mb-3"
                  label="Producer"
                  label-for="Producer"
                >
                  <select class="form-select" v-model="newProduct.producer.id">
                    <option
                      v-for="(producer, index) in producersList"
                      :key="index"
                    >
                      {{ producer.name }}
                    </option>
                  </select>
                </b-form-group> -->

                <b-form-group class="mb-3" label="Images" label-for="Badge">
                  <div v-if="newProduct.photos.length > 0">
                    <div class="">
                      <div class="product-detail">
                        <b-tabs pills vertical nav-wrapper-class="col-3">
                          <b-tab
                            v-for="(image, index) in newProduct.photos"
                            :key="index"
                          >
                            <template v-slot:title>
                              <img
                                :src="baseUrl + image.url"
                                alt
                                class="
                                  img-fluid
                                  mx-auto
                                  d-block
                                  tab-img
                                  rounded
                                "
                              />
                            </template>
                            <div class="product-img">
                              <img
                                :src="baseUrl + image.url"
                                alt
                                class="img-fluid mx-auto d-block"
                              />
                            </div>
                          </b-tab>
                        </b-tabs>
                      </div>
                    </div>
                  </div>
                </b-form-group>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="card">
              <div class="card-body">
                <!-- Table -->
                <div class="row">
                  <div class="col-auto">
                    <h3 class="text-black">Ratings :</h3>
                  </div>
                  <div class="col-auto">
                    <span
                      class="badge bg-success font-size-14 me-1"
                      v-if="newProduct.totalRating >= 4"
                      ><i class="mdi mdi-star"></i>
                      {{ newProduct.totalRating }}</span
                    >

                    <span
                      class="badge bg-warning font-size-14 me-1"
                      v-if="
                        newProduct.totalRating >= 2.5 &&
                        newProduct.totalRating < 4
                      "
                      ><i class="mdi mdi-star"></i>
                      {{ newProduct.totalRating }}</span
                    >

                    <span
                      class="badge bg-danger font-size-14 me-1"
                      v-if="newProduct.totalRating < 2.5"
                      ><i class="mdi mdi-star"></i>
                      {{ newProduct.totalRating }}</span
                    >
                  </div>
                  <div class="col-auto">
                    <h6 v-if="newProduct.ratings.length != 1">
                      {{ newProduct.ratings.length }} Reviews
                    </h6>
                    <h6 v-else>{{ newProduct.ratings.length }} Review</h6>
                  </div>
                </div>
                <div class="table-responsive mb-0">
                  <b-table
                    class="table table-centered table-nowrap"
                    :items="newProduct.ratings"
                    :fields="fieldsRatings"
                    responsive="sm"
                    :per-page="perPageRatings"
                    :current-page="currentPageRatings"
                 
                    :sort-desc.sync="sortDesc"

                  
                  >
                    <template v-slot:cell(added)="data">
                      <div class="">
                        <span>{{ formateDate(data.item.added) }}</span>
                      </div>
                    </template>
                    <template v-slot:cell(by)="data">
                      <div class="">
                        <NuxtLink :to="'/admin/users/user/' + data.item.by.id">
                          <span class="text-dark">
                            {{
                              data.item.by.firstName +
                              " " +
                              data.item.by.lastName
                            }}
                            <i class="uil uil-arrow-up-right"></i
                          ></span>
                        </NuxtLink>
                      </div>
                    </template>
                    <template v-slot:cell(rating)="data">
                      <span
                        class="badge bg-success font-size-14 me-1"
                        v-if="data.item.rating >= 4"
                        ><i class="mdi mdi-star"></i>
                        {{ data.item.rating }}</span
                      >

                      <span
                        class="badge bg-warning font-size-14 me-1"
                        v-if="data.item.rating >= 2.5 && data.item.rating < 4"
                        ><i class="mdi mdi-star"></i>
                        {{ data.item.rating }}</span
                      >

                      <span
                        class="badge bg-danger font-size-14 me-1"
                        v-if="data.item.rating < 2.5"
                        ><i class="mdi mdi-star"></i>
                        {{ data.item.rating }}</span
                      >
                    </template>
                  </b-table>
                </div>
                <div class="row">
                  <div class="col">
                    <div
                      class="
                        dataTables_paginate
                        paging_simple_numbers
                        float-end
                      "
                    >
                      <ul class="pagination pagination-rounded mb-0">
                        <!-- pagination -->
                        <b-pagination
                          v-model="currentPageRatings"
                          :total-rows="rowsRatings"
                          :per-page="perPageRatings"
                        ></b-pagination>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="card">
              <div class="card-body">
                <!-- Table -->
                <div class="row justify-content-stretch">
                  <div class="col-4">
                    <h3 class="text-black">
                      Stock :
                      <p
                        class="badge bg-success font-size-14 me-1"
                        v-if="
                          aqCalculator >= newProduct.securityStockQuantity * 2
                        "
                      >
                        {{ aqCalculator }} in stock
                      </p>
                      <p
                        class="badge bg-warning font-size-14 me-1"
                        v-if="
                          aqCalculator > newProduct.securityStockQuantity &&
                          aqCalculator < newProduct.securityStockQuantity * 2
                        "
                      >
                        {{ aqCalculator }} in stock
                      </p>
                      <p
                        class="badge bg-danger font-size-14 me-1"
                        v-if="aqCalculator <= newProduct.securityStockQuantity"
                      >
                        {{ aqCalculator }} in stock
                      </p>
                    </h3>
                  </div>
                </div>
                <center class="mb-3">
                  <div class="col-12">
                    <div class="mt-1">
                      <ul class="list-inline main-chart mb-0">
                        <li
                          class="
                            list-inline-item
                            chart-border-left
                            mr-0
                            border-0
                          "
                        >
                          <h3>
                            <span data-plugin="counterup">
                              <countTo
                                :startVal="1"
                                :endVal="avgPrice"
                                :duration="2000"
                              ></countTo>
                            </span>
                            DH
                            <span
                              class="
                                text-muted
                                d-inline-block
                                font-size-15
                                ml-3
                              "
                              >avg Price</span
                            >
                          </h3>
                        </li>
                        <li class="list-inline-item chart-border-left mr-0">
                          <h3>
                            <span data-plugin="counterup">
                              <countTo
                                :startVal="1"
                                :endVal="stockOut"
                                :duration="2000"
                              ></countTo>
                            </span>
                            <span
                              class="
                                text-muted
                                d-inline-block
                                font-size-15
                                ml-3
                              "
                              >stock Out</span
                            >
                          </h3>
                        </li>
                        <li class="list-inline-item chart-border-left mr-0">
                          <h3>
                            <span data-plugin="counterup"
                              ><countTo
                                :startVal="1"
                                :endVal="stockIn"
                                :duration="2000"
                              ></countTo
                            ></span>
                            <span
                              class="
                                text-muted
                                d-inline-block
                                font-size-15
                                ml-3
                              "
                              >stock In</span
                            >
                          </h3>
                        </li>
                        <li class="list-inline-item chart-border-left mr-0">
                          <h3>
                            <span data-plugin="counterup">
                              <countTo
                                :startVal="1"
                                :endVal="spent"
                                :duration="2000"
                              ></countTo>
                            </span>
                            DH
                            <span
                              class="
                                text-muted
                                d-inline-block
                                font-size-15
                                ml-3
                              "
                              >Spent</span
                            >
                          </h3>
                        </li>

                        <li class="list-inline-item chart-border-left mr-0">
                          <h3>
                            <span data-plugin="counterup">
                              <countTo
                                :startVal="0"
                                :endVal="(1 - stockOut / stockIn) * 100"
                                :duration="2000"
                              ></countTo>
                            </span>
                            %
                            <span
                              class="
                                text-muted
                                d-inline-block
                                font-size-15
                                ml-3
                              "
                              >Stock available</span
                            >
                          </h3>
                        </li>
                      </ul>
                    </div>
                  </div>
                </center>
                <div class="table-responsive mb-0">
                  <b-table
                    class="table table-centered table-nowrap"
                    :items="newProduct.stock"
                    :fields="fieldsStock"
                    responsive="sm"
                    :per-page="perPageRatings"
                    :current-page="currentPageRatings"
           
                    :sort-desc.sync="sortDesc"
              

                  >
                    <template v-slot:cell(added)="data">
                      <div class="">
                        <span>{{ formateDate(data.item.added) }}</span>
                      </div>
                    </template>
                    <template v-slot:cell(by)="data">
                      <div class="">
                        <span>{{
                          data.item.by.firstName + " " + data.item.by.lastName
                        }}</span>
                      </div>
                    </template>
                    <template v-slot:cell(rating)="data">
                      <span
                        class="badge bg-success font-size-14 me-1"
                        v-if="data.item.rating >= 4"
                        ><i class="mdi mdi-star"></i>
                        {{ data.item.rating }}</span
                      >

                      <span
                        class="badge bg-warning font-size-14 me-1"
                        v-if="data.item.rating >= 2.5 && data.item.rating < 4"
                        ><i class="mdi mdi-star"></i>
                        {{ data.item.rating }}</span
                      >

                      <span
                        class="badge bg-danger font-size-14 me-1"
                        v-if="data.item.rating < 2.5"
                        ><i class="mdi mdi-star"></i>
                        {{ data.item.rating }}</span
                      >
                    </template>
                  </b-table>
                </div>
                <div class="row">
                  <div class="col">
                    <div
                      class="
                        dataTables_paginate
                        paging_simple_numbers
                        float-end
                      "
                    >
                      <ul class="pagination pagination-rounded mb-0">
                        <!-- pagination -->
                        <b-pagination
                          v-model="currentPageStock"
                          :total-rows="rowsStock"
                          :per-page="perPageStock"
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
    </div>
  </div>
</template>
