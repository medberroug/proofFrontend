<script>
import Multiselect from "vue-multiselect";
import "vue-multiselect/dist/vue-multiselect.min.css";
/**
 * User list component
 */
import { eoLocale } from "date-fns/locale/eo";
import { format, parseISO } from "date-fns";
import axios from "axios";
export default {
  head() {
    return {
      title: `${this.title} | Proof BackOffice`,
    };
  },
  data() {
    return {
      title: "Community Post",
      baseUrl: null,
      items: [
        {
          text: "Community",
        },
        {
          text: "Post",
          active: true,
        },
      ],

      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      robots: [],
      robotsList: [],
      post: null,
      sortBy: "age",
      sortDesc: false,
      newCommentText: null,
      deleteMessage: false,
      chosenPost: null,
      user: null,
      selectedCommenter: null,
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
  components: {
    Multiselect,
  },
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.post.length;
    },
  },

  async mounted() {
    try {
      this.totalRows = this.items.length;
      this.baseUrl = process.env.baseUrl;
      let result = await axios.get(
        process.env.baseUrl + "/posts/" + this.$route.params.id
      );
      result = result.data;
      let result2 = await axios.get(
        process.env.baseUrl + "/users/" + result.by.userid
      );
      this.user = result2.data;
      for (let i = 0; i < result.postComments.length; i++) {
        let username = await axios.get(
          process.env.baseUrl + "/users/" + result.postComments[i].by.userid
        );
        result.postComments[i].by.username = username.data.username;
      }
      let allRobotUsers = await axios.get(
        process.env.baseUrl + "/userProfiles?robot=true"
      );
      allRobotUsers = allRobotUsers.data;

      for (let j = 0; j < allRobotUsers.length; j++) {
        this.robotsList.push(allRobotUsers[j].userid.username);
      }
      console.log(this.robotsList);
      this.robots = allRobotUsers;
      this.post = result;
    } catch (error) {}
  },
  methods: {
    /**
     * Search the table data with search input
     */
    async deletePost(id) {
      let result = await axios.delete(process.env.baseUrl + "/posts/" + id);
      this.$router.go();
    },
    formateDate(date) {
      let result = format(parseISO(date), "dd/MM/yyyy hh:mm", {
        locale: eoLocale,
      });
      return result;
    },
    async getUsername(id) {
      let result = await axios
        .get(process.env.baseUrl + "/users/" + id)
        .then((result) => {
          return result.data.username;
        });
    },
    goBack() {
      this.$router.go(-1);
    },
    async addRobotComment() {
      let myPostComments = [... this.post.postComments];
      for (let k = 0; k < this.robots.length; k++) {
        if (
          this.selectedCommenter == this.robots[k].userid.username &&
          this.selectedCommenter != null
        ) {
          myPostComments.push({
            by: this.robots[k].id,
            text: this.newCommentText,
            when: new Date(),
          });
          let result = await axios.put(
            process.env.baseUrl + "/posts/" + this.post.id,
            {
              postComments: myPostComments,
            }
          );
          this.$router.go();
        }
      }
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
    <div v-if="post">
      <PageHeader :title="title + ' #' + post.id" :items="items" />
      <b-modal v-model="deleteMessage" centered hide-footer v-if="post">
        <template #modal-title> Deleting a community post </template>
        <center>
          <p><b>You are deleting this post</b>, do you want to continue?</p>
        </center>
        <center>
          <b-button
            class="m-3"
            block
            variant="outline-danger"
            @click="deletePost(chosenPost)"
          >
            Delete</b-button
          >
          <b-button
            class="m-3"
            block
            variant="primary"
            @click="deleteMessage = false"
          >
            Cancel</b-button
          >
        </center></b-modal
      >
      
      <div class="row d-flex justify-content-between">
        <div class="col-auto">
          <b-button variant="primary" @click="goBack">
            <i class="uil uil-arrow-left mr-2"></i>
            go back
          </b-button>
        </div>

        <div class="col-auto">
          <b-button
            variant="outline-danger"
            @click="
              deleteMessage = true;
              chosenPost = post.id;
            "
          >
            <i class="uil uil-trash-alt"></i> Delete
          </b-button>
        </div>
      </div>
      <div class="row">
        <div class="card mt-3 col-4">
          <div class="card-body">
            <div class="row">
              <div class="col-12 pl-2">
                <div class="row">
                  <div class="col-md-auto d-flex align-items-center">
                    <div
                      v-if="post.by.photo"
                      class="avatar-xs d-inline-block me-2"
                    >
                      <img
                        class="rounded-circle avatar-sm"
                        alt="50x50"
                        :src="baseUrl + post.by.photo.url"
                        data-holder-rendered="true"
                      />
                    </div>
                    <div v-else class="avatar-xs d-inline-block me-2">
                      <img
                        class="rounded-circle avatar-sm"
                        alt="50x50"
                        src="../../../assets/images/user.png"
                        data-holder-rendered="true"
                      />
                    </div>
                  </div>
                  <div
                    class="
                      col-md-auto
                      d-flex
                      align-items-center
                      justify-content-center
                    "
                  >
                    <div class="row justify-content-end" v-if="user">
                      <h5 class="card-title justify-content-end">
                        {{ user.username }}
                      </h5>
                      <small class="text-muted" v-if="post.created_at">{{
                        formateDate(post.created_at)
                      }}</small>
                    </div>
                  </div>
                  <div class="col-md-auto">
                    <div></div>
                  </div>
                </div>
                <!-- <h4 class="card-title mb-4">Add a new blog post</h4> -->
                <!-- Editor -->
                <div class="mt-4">{{ post.text }}</div>
                <center v-if="post.images">
                  <img
                    :src="baseUrl + post.images.url"
                    alt=""
                    width="50%"
                    class="mt-3"
                  />
                </center>
                <div class="row mt-3">
                  <div class="col-6 d-flex justify-content-center">
                    <i class="uil uil-heart-alt">{{ post.postLikes.length }}</i>
                  </div>
                  <div class="col-6 d-flex justify-content-center">
                    <i class="uil uil-comment-lines">{{
                      post.postComments.length
                    }}</i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="card p-3 m-3 col-7">
          <div v-if="post.postComments.length > 0">
            <div class="card-body m-3">
              <div class="row">
                <div
                  class="col-12 pl-2"
                  v-for="(postComment, index) in post.postComments"
                  :key="index"
                >
                  <div class="row">
                    <div class="col-md-auto d-flex align-items-center">
                      <div
                        v-if="postComment.by.photo"
                        class="avatar-xs d-inline-block me-2"
                      >
                        <img
                          class="rounded-circle avatar-sm"
                          alt="50x50"
                          :src="baseUrl + postComment.by.photo.url"
                          data-holder-rendered="true"
                        />
                      </div>
                      <div v-else class="avatar-xs d-inline-block me-2">
                        <img
                          class="rounded-circle avatar-sm"
                          alt="50x50"
                          src="../../../assets/images/user.png"
                          data-holder-rendered="true"
                        />
                      </div>
                    </div>
                    <div
                      class="
                        col-md-auto
                        d-flex
                        align-items-center
                        justify-content-center
                      "
                    >
                      <div class="row justify-content-end" v-if="user">
                        <h5 class="card-title justify-content-end">
                          {{ postComment.by.username }}
                        </h5>
                        <small class="text-muted" v-if="postComment.when">{{
                          formateDate(postComment.when)
                        }}</small>
                      </div>
                    </div>
                    <!-- <div class="col-md-auto">
                    <div>
                      <b-button-group>
                        <NuxtLink :to="'/admin/community/' + post.id">
                          <b-button variant="outline-primary"
                            ><i class="uil uil-eye"></i></b-button
                        ></NuxtLink>

                        <b-button
                          variant="outline-danger"
                          @click="
                            deleteMessage = true;
                            chosenPost = post.id;
                          "
                          ><i class="uil uil-trash-alt"></i
                        ></b-button>
                      </b-button-group>
                    </div>
                  </div> -->
                  </div>
                  <!-- <h4 class="card-title mb-4">Add a new blog post</h4> -->
                  <!-- Editor -->
                  <div class="mt-4">{{ postComment.text }}</div>

                  <hr class="myHR" />
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <center>
              <p class="text-black-300">There's no comment for this post</p>
            </center>
          </div>

          <div class="row">
            <div class="col-7">
              <h6>Add a new comment</h6>
              <textarea
                class="form-control"
                id="productdesc"
                rows="2"
                v-model="newCommentText"
              ></textarea>
            </div>
            <div class="col-5">
              <label class="control-label">User (Robots only)</label>
              <multiselect
                v-model="selectedCommenter"
                :options="robotsList"
                :multiple="false"
              ></multiselect>
              <div>
                <center>
                  <b-button
                    class="m-3"
                    block
                    variant="outline-primary"
                    @click="addRobotComment()"
                  >
                    Add comment</b-button
                  >
                </center>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.myHR {
  background-color: rgba(58, 58, 58, 0.507);
  height: 1px;
  border: 0;
}
</style>