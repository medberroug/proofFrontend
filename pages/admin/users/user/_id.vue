<script>
import CKEditor from "@ckeditor/ckeditor5-vue";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import axios from "axios";
import vue2Dropzone from "vue2-dropzone";
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
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
      title: `${this.title} | Proof BackOffice`,
    };
  },

  data() {
    return {
      title: "New user",
      items: [
        {
          text: "Users",
          href: "/",
        },
        {
          text: "New user",
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
      newUser:null,
      newProfile: null,
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
    async createNewUser() {
      this.loading = true;
      let formData = new FormData();
      if (this.file) {
        formData.append("files", this.file);
        let myImage = await axios
          .post(process.env.baseUrl + "/upload", formData)
          .catch((err) => {
            this.fileMissing = true;
          });
        myImage = myImage.data;
        this.newProfile.photo = {
          id: myImage[0].id,
        };
      }

      try {
        let result2 = await axios.post(
          process.env.baseUrl + "/users",
          this.newUser
        );
        console.log(result2.data);
        this.newProfile.userid = { id: result2.data.id };
        let result3 = await axios.post(
          process.env.baseUrl + "/userProfiles",
          this.newProfile
        );
        let result4 = await axios.put(
          process.env.baseUrl + "/users/" + result2.data.id,
          {
            userprofileId: result3.data.id,
          }
        );
        this.showCreated = true;
        const delay = (ms) => new Promise((res) => setTimeout(res, ms));
        await delay(5000);
        this.$router.push("/admin/users/" + result3.data.id);
      } catch (error) {
        console.log(error);
      }
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  async mounted() {
    try {
      this.baseUrl = process.env.baseUrl;
      let newProfile = await axios.get(
        process.env.baseUrl + "/userProfiles/" + this.$route.params.id
      );
      newProfile = newProfile.data;
      this.newProfile = newProfile;
      let newUser = await axios.get(
        process.env.baseUrl + "/users/" + newProfile.userid.id
      );
      newUser = newUser.data;
      this.newUser = newUser;
      console.log(this.newProfile);
           console.log(this.newUser);
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
    <div class="row mb-3">
      <div class="col-auto">
        <b-button variant="primary" @click="goBack">
          <i class="uil uil-arrow-left mr-2"></i>
          go back
        </b-button>
      </div>
    </div>
    <div class="row" v-if="newProfile && newUser">
      <div class="col-12">
        <b-alert show v-if="showCreated" variant="success" class="mb-3">
          <i class="uil uil-check"></i> <b>New user was been created</b>, you
          will be redirected to it in 5 seconds...
        </b-alert>
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-3 pl-2">
                <h5 class="m-3">User account</h5>
                <!-- Editor -->
                <b-form-group class="mb-3" label="Username" label-for="title">
                  <b-form-input
                    v-model="newUser.username"
                    type="text"
                    disabled
                  ></b-form-input>
                </b-form-group>
                <!-- <b-form-group class="mb-3" label="Password" label-for="title">
                  <b-form-input
                    v-model="newUser.password"
                    type="password"
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  class="mb-3"
                  label="Confirm Password"
                  label-for="title"
                >
                  <b-form-input
                    v-model="newUser.passwordRetype"
                    type="password"
                  ></b-form-input>
                </b-form-group> -->
                <b-form-group class="mb-3" label="Email" label-for="title">
                  <b-form-input
                    v-model="newUser.email"
                    type="text"
                    disabled
                  ></b-form-input>
                </b-form-group>
              </div>
              <div class="col-1 flex d-flex justify-content-center">
                <div class="vl"></div>
              </div>

              <div class="col-4">
                <h5 class="m-3">Profile</h5>
                <b-form-group class="mb-3" label="First name" label-for="title">
                  <b-form-input
                    v-model="newProfile.firstName"
                    type="text"
                    disabled
                  ></b-form-input>
                </b-form-group>
                <b-form-group class="mb-3" label="Last name" label-for="title">
                  <b-form-input
                    v-model="newProfile.lastName"
                    type="text"
                    disabled
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  class="mb-3"
                  label="Phone Number"
                  label-for="title"
                >
                  <b-form-input
                    v-model="newProfile.phone"
                    type="text"
                    disabled
                  ></b-form-input>
                </b-form-group>
                <b-form-group class="mb-3" label="City" label-for="title">
                  <b-form-input
                    v-model="newProfile.address.city"
                    type="text"
                    disabled
                  ></b-form-input>
                </b-form-group>

                <b-form-group
                  class="mb-3"
                  label="Account type"
                  label-for="title"
                >
                <span v-if="newProfile.badge=='verified'"  class="text-success">  <i class="uil uil-check-circle"></i> <b>Verified Account</b></span>
                <span v-else  class="text-primary">  <i class="uil uil-check-circle"></i> <b>Standard Account</b></span>
               
                </b-form-group>
                <!-- <b-form-group class="mb-3" label="Publishing date" label-for="title" v-if="post.status == false">
                  <b-form-input id="date-time" type="datetime-local" v-model="post.publishTime"></b-form-input>
                </b-form-group> -->
              </div>
              <div class="col-1 flex d-flex justify-content-center">
                <div class="vl"></div>
              </div>
              <div class="col-3">
                <!-- <b-form-group class="mb-3" label="Publishing date" label-for="title" v-if="post.status == false">
                  <b-form-input id="date-time" type="datetime-local" v-model="post.publishTime"></b-form-input>
                </b-form-group> -->
                <!-- <multiselect v-model="selectedPoster" :options="robotsList" :multiple="false"></multiselect> -->
                <b-form-group
                  class="m-3"
                  label="Profile Photo"
                  label-for="Badge"
                >
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
              
                <center v-if="newProfile.photo" >
                  <img  :src="baseUrl+newProfile.photo.url" alt="" width="80%">
                </center>
                   <center v-else >
                  <p class="greyText">This profile does not have a photo.</p>
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style>
.vl {
  border-left: 1px solid rgba(0, 0, 0, 0.24);
  height: 100%;
}
.greyText {
    color: gray;
    
}
</style>