<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import vue2Dropzone from "vue2-dropzone";

import "vue2-dropzone/dist/vue2Dropzone.min.css";
import { getData } from "../../../components/controllers/savingData";
/**
 * Editor component
 */
export default {
  components: {
    ckeditor: CKEditor.component,
    vueDropzone: vue2Dropzone,
  },
  head() {
    return {
      title: `${this.title} | Proof BackOffice`,
    };
  },

  data() {
    return {
      title: "New product",
      items: [
        {
          text: "Products",
          href: "/madmin/market/products",
        },
        {
          text: "New product",
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
      newProduct: {
        name: null,
        up: null,
        description: null,
        status: false,
        code: null,
        totalRating: 5,
        category: null,
        securityStockQuantity: null,
        producer: { id: null },
        discount: null,
        specs: [],
        specsInit: null,
        initialQuantity: null,
        unitBuyingPrice: null,
        unit: null,
        topPhoto: null,
        photos: [],
      },
    };
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
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
          for(let m=0;m<this.uploadedImages.length;m++){
            this.newProduct.photos.push({
                id: this.uploadedImages[m].id
            })
          }
          // this.$router.push("/clients/note-de-frais/" + result.data.id);
          let mySpecLines = this.newProduct.specsInit.split("\n");
          for (let i = 0; i < mySpecLines.length; i++) {
            this.newProduct.specs.push({
              specText: mySpecLines[i],
            });
          }

          // for (let j = 0; j < this.categoriesList.length; j++) {
          //   if (this.newProduct.category.id == this.categoriesList[j].name) {
          //     this.newProduct.category = this.categoriesList[j].name;
          //   }
          // }

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
      result = result.data.category;
      this.categoriesList = result;

      let result2 = await axios.get(process.env.baseUrl + "/producers");
      result2 = result2.data;
      this.producersList = result2;
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
    <div class="row">
      <div class="col-12">
        <b-alert show v-if="showCreated" variant="success" class="mb-3">
          <i class="uil uil-check"></i> <b>Product was been created</b>, you
          will be redirected to it in 5 seconds...
        </b-alert>
        <div class="row mb-3">
          <div class="col-auto">
            <b-button variant="primary" @click="goBack">
              <i class="uil uil-arrow-left mr-2"></i>
              go back
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
                  ></b-form-input>
                </b-form-group>

                <div class="row">
                  <div class="col-6 mr-3">
                    <b-form-group
                      class="mb-3"
                      label="Unit price (TTC in DH)"
                      label-for="Unit price (TTC in DH)"
                    >
                      <b-form-input
                        for="Unit price (TTC in DH)"
                        placeholder="99.98 ..."
                        v-model="newProduct.up"
                      ></b-form-input>
                    </b-form-group>
                  </div>
                  <div class="col-6 mr-3">
                    <b-form-group class="mb-3" label="Code" label-for="Code">
                      <b-form-input
                        for="Code"
                        placeholder="PROD0001..."
                        v-model="newProduct.code"
                      ></b-form-input>
                    </b-form-group>
                  </div>
                </div>

                <b-form-group
                  class="mb-3"
                  label="Description"
                  label-for="title"
                >
                  <ckeditor
                    v-model="newProduct.description"
                    :editor="editor"
                  ></ckeditor>
                </b-form-group>

                <div class="row">
                  <div class="col-6 mr-3">
                    <b-form-group
                      class="mb-3"
                      label="Specifications (Each in a new line)"
                      label-for="Specifications"
                    >
                      <textarea
                        class="form-control"
                        id="productdesc"
                        rows="6"
                        v-model="newProduct.specsInit"
                      ></textarea>
                    </b-form-group>
                  </div>
                  <div class="col-6">
                    <b-form-group
                      class="mb-3"
                      label="Initial Quantity"
                      label-for="Initial Quantity"
                    >
                      <b-form-input
                        for="Initial Quantity"
                        placeholder="100 ..."
                        v-model="newProduct.initialQuantity"
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group
                      class="mb-3"
                      label="Unit Buying Price  (TTC en DH)"
                      label-for="Unit Buying Price (TTC en DH)"
                    >
                      <b-form-input
                        for="Unit Buying Price (TTC en DH)"
                        placeholder="99.98 ..."
                        v-model="newProduct.unitBuyingPrice"
                      ></b-form-input>
                    </b-form-group>
                    <b-form-group class="mb-3" label="Unit" label-for="Unit">
                      <b-form-input
                        for="Unit"
                        placeholder="m² ..."
                        v-model="newProduct.unit"
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
                      ></b-form-input>
                    </b-form-group>
                  </div>
                </div>

                <center>
                  <b-button variant="primary" @click="submit">
                    <span
                      v-if="loading"
                      class="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Submit
                    <!-- <i class="uil uil-plus mr-2"></i> -->
                  </b-button>
                </center>
              </div>
              <div class="col-4">
                <b-form-group
                  class="mb-3"
                  label="Publishing status"
                  label-for="title"
                >
                  <b-form-radio
                    v-model="newProduct.status"
                    class="custom-radio mb-3"
                    :value="false"
                    plain
                    >Draft</b-form-radio
                  ><b-form-radio
                    v-model="newProduct.status"
                    class="mb-3"
                    :value="true"
                    plain
                    >Publish after submit</b-form-radio
                  >
                </b-form-group>
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
                <b-form-group class="mb-3" label="Category" label-for="title">
                  <select class="form-select" v-model="newProduct.category">
                    <option
                      v-for="(category, index) in categoriesList"
                      :key="index"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </b-form-group>

                <b-form-group
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
                </b-form-group>
                <b-form-group
                  class="mb-3"
                  label="Discount ( 0 to 100 in %)"
                  label-for="Discount ( 0 to 100 in %)"
                >
                  <b-form-input
                    for="Discount ( 0 to 100 in %)"
                    placeholder="20 ..."
                    v-model="newProduct.discount"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  class="mb-3"
                  label="Cover image"
                  label-for="Badge"
                >
                  <input
                    type="file"
                    id="file"
                    ref="file"
                    class="m-2"
                    v-on:change="handleFileUpload()"
                  />
                </b-form-group>
                <b-form-group class="mb-3" label="Photos" label-for="Badge">
                  <input
                    type="file"
                    id="file"
                    ref="file2"
                    class="m-2"
                    v-on:change="uploadImages()"
                  />
                </b-form-group>
                <div v-if="uploadedImages.length > 0">
                  <div v-for="(image, index) in uploadedImages" :key="index">
                   <ul><li> <img :src="baseUrl + image.url" alt="" width="50%" /></li></ul>
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
