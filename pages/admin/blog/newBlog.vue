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
      title: "New blog post",
      items: [
        {
          text: "Blog",
          href: "/",
        },
        {
          text: "New blog post",
          active: true,
        },
      ],
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
      categoriesList: null,
      fileMissing: false,
      file: "",
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
    };
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    async submit() {
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
          console.log(myImage[0].id);
          this.blogPost.by = getData("account").id;
          this.blogPost.images = [
            {
              id: myImage[0].id,
            },
          ];
          if (this.blogPost.status) {
            this.blogPost.publishTime = new Date();
          }
          // this.$router.push("/clients/note-de-frais/" + result.data.id);
          console.log(this.blogPost);
          let result2 = await axios.post(
            process.env.baseUrl + "/blogPosts",
            this.blogPost
          );
          this.$router.push("/admin/blog");
        } catch (error) {
          console.log(error);
        }
      }
    },
  },
  async mounted() {
    try {
      this.baseUrl = process.env.baseUrl;
      let result = await axios.get(process.env.baseUrl + "/categories");
      result = result.data.category;
      this.categoriesList = result;
      console.log(this.categoriesList);
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
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-8 pl-2">
                <!-- <h4 class="card-title mb-4">Add a new blog post</h4> -->
                <!-- Editor -->
                <b-form-group class="mb-3" label="Title" label-for="title">
                  <b-form-input
                    for="title"
                    placeholder="Insert your title here..."
                    v-model="blogPost.title"
                  ></b-form-input>
                </b-form-group>

                <b-form-group class="mb-3" label="Content" label-for="title">
                  <ckeditor v-model="blogPost.text" :editor="editor"></ckeditor>
                </b-form-group>

                <center>
                  <b-button variant="primary" @click="submit">
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
                    v-model="blogPost.status"
                    class="custom-radio mb-3"
                    :value="false"
                    plain
                    >Publish later</b-form-radio
                  ><b-form-radio
                    v-model="blogPost.status"
                    class="mb-3"
                    :value="true"
                    plain
                    >Publish after submit</b-form-radio
                  >
                </b-form-group>
                <b-form-group
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
                </b-form-group>
                <b-form-group class="mb-3" label="Category" label-for="title">
                  <select class="form-select" v-model="blogPost.category">
                    <option>Select a category</option>
                    <option
                      v-for="(category, index) in categoriesList"
                      :key="index"
                    >
                      {{ category.name }}
                    </option>
                  </select>
                </b-form-group>
                <b-form-group class="mb-3" label="Badge" label-for="Badge">
                  <b-form-input
                    for="Badge"
                    placeholder="e.g Exlusive..."
                    v-model="blogPost.badge"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  class="mb-3"
                  label="Cover image"
                  label-for="Badge"
                >
                  <!-- <vue-dropzone
                    id="dropzone"
                    ref="file"
                    :use-custom-slot="true"
                    :options="dropzoneOptions"
                  >
                    <div class="dropzone-custom-content">
                      <i class="display-4 text-muted bx bxs-cloud-upload"></i>
                      <h4>Drop files here or click to upload.</h4>
                    </div>
                  </vue-dropzone> -->
                  <input
                    type="file"
                    id="file"
                    ref="file"
                    class="m-2"
                    v-on:change="handleFileUpload()"
                  />
                </b-form-group>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
