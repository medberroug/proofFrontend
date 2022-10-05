<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import vue2Dropzone from "vue2-dropzone";
import { eoLocale } from "date-fns/locale/eo";
import { format, parseISO } from "date-fns";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
import { getData } from "../../../../components/controllers/savingData";
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
      title: "Blog post",
      items: [
        {
          text: "Blog",
          href: "/",
        },
        {
          text: "Blog post",
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
      this.blogPost.images = null;
    },
    formateDate(date) {
      let result = format(parseISO(date), "dd/MM/yyyy hh:mm", {
        locale: eoLocale,
      });
      return result;
    },
    async submit() {
      let formData = new FormData();

      // this.fileMissing = true;

      try {
        if (this.file) {
          formData.append("files", this.file);
          let myImage = await axios
            .post(process.env.baseUrl + "/upload", formData)
            .catch((err) => {
              this.fileMissing = true;
            });
          myImage = myImage.data;
          console.log(myImage[0].id);
          this.blogPost.images = [
            {
              id: myImage[0].id,
            },
          ];
        }
        let result2 = await axios.put(
          process.env.baseUrl + "/blogPosts/" + this.$route.params.blogId,
          {
            title: this.blogPost.title,
            text: this.blogPost.text,
            status: this.blogPost.status,
            images: this.blogPost.images,
            category: this.blogPost.category,
            badge: this.blogPost.badge,
            publishTime: this.blogPost.publishTime,
          }
        );
        this.$router.push("/admin/blog");
      } catch (error) {}
    },
  },
  async mounted() {
    try {
      this.baseUrl = process.env.baseUrl;

      let result = await axios.get(process.env.baseUrl + "/categories");
      result = result.data.category;
      this.categoriesList = result;
      console.log(this.categoriesList);
      let result2 = await axios.get(
        process.env.baseUrl + "/blogposts/" + this.$route.params.blogId
      );
      result2 = result2.data;
      console.log(result2);
      this.blogPost = result2;
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
                    disabled
                  ></b-form-input>
                </b-form-group>

                <b-form-group class="mb-3" label="Content" label-for="title">
                  <div v-html="blogPost.text">{{ blogPost.text }}</div>
                </b-form-group>
              </div>
              <div class="col-4">
                <b-form-group
                  class="mb-3"
                  label="Publishing status"
                  label-for="title"
                >
                  <p class="text-success" v-if="blogPost.status">
                    <b>Published</b>
                  </p>
                  <p class="text-danger" v-else><b>Unpublished</b></p>
                </b-form-group>
                <b-form-group
                  class="mb-3"
                  label="Publishing date"
                  label-for="title"
                  v-if="blogPost.status == false"
                >
                  <p v-if="!blogPost.status & blogPost.publishTime">
                    <b>{{ formateDate(blogPost.publishTime) }} </b>
                  </p>
                </b-form-group>
                <b-form-group class="mb-3" label="Category" label-for="title">
                  <b>{{ blogPost.category }}</b>
                </b-form-group>
                <b-form-group class="mb-3" label="Badge" label-for="Badge">
                  <b>{{ blogPost.badge }}</b>
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
                
                </b-form-group>
                <center v-if="blogPost.images">
                  <img
                    v-if="blogPost.images[0]"
                    :src="baseUrl + blogPost.images[0].url"
                    width="60%"
                  />
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
