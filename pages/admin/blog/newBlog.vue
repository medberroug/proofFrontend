<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import vue2Dropzone from "vue2-dropzone";

import "vue2-dropzone/dist/vue2Dropzone.min.css";
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
      title: `${this.title} | Nuxtjs Responsive Bootstrap 5 Admin Dashboard`,
    };
  },

  data() {
    return {
      title: "New blog post",
      items: [
        {
          text: "Forms",
          href: "/",
        },
        {
          text: "Form editor",
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
    };
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
                  ></b-form-input>
                </b-form-group>

                <b-form-group class="mb-3" label="Content" label-for="title">
                  <ckeditor v-model="editorData" :editor="editor"></ckeditor>
                </b-form-group>
              </div>
              <div class="col-4">
                <b-form-group
                  class="mb-3"
                  label="Publishing date"
                  label-for="title"
                >
                  <b-form-input
                    id="date-time"
                    type="datetime-local"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  class="mb-3"
                  label="Publishing status"
                  label-for="title"
                >
                  <b-form-radio
                    v-model="status"
                    class="custom-radio mb-3"
                    value="false"
                    plain
                    >Publish later</b-form-radio
                  ><b-form-radio
                    v-model="status"
                    class="mb-3"
                    value="true"
                    plain
                    >Publish after submit</b-form-radio
                  >
                </b-form-group>
                <b-form-group class="mb-3" label="Category" label-for="title">
                  <select class="form-select">
                    <option></option>
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
                    placeholder="Exlusive..."
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  class="mb-3"
                  label="Cover image"
                  label-for="Badge"
                >
                  <vue-dropzone
                    id="dropzone"
                    ref="myVueDropzone"
                    :use-custom-slot="true"
                    :options="dropzoneOptions"
                  >
                    <div class="dropzone-custom-content">
                      <i class="display-4 text-muted bx bxs-cloud-upload"></i>
                      <h4>Drop files here or click to upload.</h4>
                    </div>
                  </vue-dropzone>
                </b-form-group>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
