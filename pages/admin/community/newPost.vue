<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import vue2Dropzone from "vue2-dropzone";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
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
      title: "New community post",
      items: [
        {
          text: "Community",
          href: "/",
        },
        {
          text: "New community post",
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
      selectedPoster: null,
      baseUrl: null,
      robotsList: [],
      robots: [],
      showCreated: false,
      categoriesList: null,
      fileMissing: false,
      file: "",
      post: {
        text: null,
        status: false,
        images: null,
        by: null,
        publishTime: null,
      },
    };
  },
  components: {
    Multiselect,
  },
  methods: {
    handleFileUpload() {
      this.file = this.$refs.file.files[0];
    },
    async submit() {
      this.loading = true;
      let formData = new FormData();

      // this.fileMissing = true;
      if (this.file &&  this.selectedPoster) {
        formData.append("files", this.file);
        try {
          let myImage = await axios
            .post(process.env.baseUrl + "/upload", formData)
            .catch((err) => {
              this.fileMissing = true;
            });
          myImage = myImage.data;
          console.log(myImage[0].id);
          for (let k = 0; k < this.robots.length; k++) {
            if (
              this.selectedPoster == this.robots[k].userid.username &&
              this.selectedPoster != null
            ) {
               this.post.by= this.robots[k].id
            }
          }
          this.post.images = {
            id: myImage[0].id,
          };

          if (this.post.status) {
            this.post.publishTime = new Date();
          }
          // this.$router.push("/clients/note-de-frais/" + result.data.id);
          console.log(this.post);
          let result2 = await axios.post(
            process.env.baseUrl + "/posts",
            this.post
          );
          console.log(result2.data);
          this.showCreated = true;
          const delay = (ms) => new Promise((res) => setTimeout(res, ms));
          await delay(5000);
          this.$router.push("/admin/community/" + result2.data.id);
        } catch (error) {
          console.log(error);
        }
      } else if(this.selectedPoster) {
 try {
         


          for (let k = 0; k < this.robots.length; k++) {
            if (
              this.selectedPoster == this.robots[k].userid.username &&
              this.selectedPoster != null
            ) {
               this.post.by= this.robots[k].id
            }
          }


          if (this.post.status) {
            this.post.publishTime = new Date();
          }
          // this.$router.push("/clients/note-de-frais/" + result.data.id);
          console.log(this.post);
          let result2 = await axios.post(
            process.env.baseUrl + "/posts",
            this.post
          );
          console.log(result2.data);
          this.showCreated = true;
          const delay = (ms) => new Promise((res) => setTimeout(res, ms));
          await delay(5000);
          this.$router.push("/admin/community/" + result2.data.id);
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
      let allRobotUsers = await axios.get(
        process.env.baseUrl + "/userProfiles?robot=true"
      );
      allRobotUsers = allRobotUsers.data;

      for (let j = 0; j < allRobotUsers.length; j++) {
        this.robotsList.push(allRobotUsers[j].userid.username);
      }
      console.log(this.robotsList);
      this.robots = allRobotUsers;
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
          <i class="uil uil-check"></i> <b>Community post was been created</b>, you
          will be redirected to it in 5 seconds...
        </b-alert>
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-8 pl-2">
                <!-- <h4 class="card-title mb-4">Add a new blog post</h4> -->
                <!-- Editor -->

                <b-form-group class="mb-3" label="Content" label-for="title">
                  <textarea
                    class="form-control"
                    id="productdesc"
                    rows="2"
                    v-model="post.text"
                  ></textarea>
                </b-form-group>

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
                    v-model="post.status"
                    class="custom-radio mb-3"
                    :value="false"
                    plain
                    >Publish later</b-form-radio
                  ><b-form-radio
                    v-model="post.status"
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
                  v-if="post.status == false"
                >
                  <b-form-input
                    id="date-time"
                    type="datetime-local"
                    v-model="post.publishTime"
                  ></b-form-input>
                </b-form-group>
                <b-form-group
                  class="mb-3"
                  label="User (Robots only)"
                  label-for="User (Robots only)"
                >
                  <multiselect
                    v-model="selectedPoster"
                    :options="robotsList"
                    :multiple="false"
                  ></multiselect>
                  <b-form-group class="m-3" label="Image" label-for="Badge">
                  </b-form-group>

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
