<script>
/**
 * User list component
 */
import axios from "axios";
export default {
  head() {
    return {
      title: `${this.title} | Proof BackOffice`,
    };
  },
  data() {
    return {
      title: "Community posts",
      baseUrl: null,
      items: [
        {
          text: "Community",
        },
        {
          text: "Posts",
          active: true,
        },
      ],

      posts: [],
      totalRows: 1,
      currentPage: 1,
      perPage: 10,
      pageOptions: [10, 25, 50, 100],
      filter: null,
      filterOn: [],
      posts: [],
      sortBy: "age",
      sortDesc: false,
      deleteMessage: false,
      chosenPost: null,
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
  computed: {
    /**
     * Total no. of records
     */
    rows() {
      return this.posts.length;
    },
  },

  async mounted() {
    try {
      this.totalRows = this.items.length;
      this.baseUrl = process.env.baseUrl;
      let result = await axios.get(
        process.env.baseUrl + "/getAllPostsForAdmin"
      );
      result = result.data;
      this.posts = result;
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
    <b-modal v-model="deleteMessage" centered hide-footer v-if="posts">
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
    <div class="row">
      <div class="col-sm-12 col-md-3">
        <NuxtLink to="/admin/community/newPost">
          <b-button variant="primary">
            <i class="uil uil-plus mr-2"></i>
            Add new
          </b-button></NuxtLink
        >
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-3" v-for="(post, index) in posts" :key="index">
        <b-card img-alt="Card image" img-bottom>
          <b-card-title>
            <div class="row">
              <div class="col-md-auto d-flex align-items-center">
                <div
                  v-if="post.posterProfileImage"
                  class="avatar-xs d-inline-block me-2"
                >
                  <img
                    class="rounded-circle avatar-sm"
                    alt="50x50"
                    :src="baseUrl + post.posterProfileImage"
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
                <div class="row justify-content-end">
                  <h5 class="card-title justify-content-end">
                    {{ post.username }}
                  </h5>
                  <small class="text-muted">{{ post.created_at }}</small>
                </div>
              </div>
              <div class="col-md-auto">
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
              </div>
            </div>
          </b-card-title>
          <b-card-text class="m-3">
            <p>
              {{ post.text }}
            </p>
          </b-card-text>

          <img :src="baseUrl + post.image" alt="" width="100%" />
          <div class="row mt-3">
            <div class="col-6 d-flex justify-content-center">
              <i class="uil uil-heart-alt">{{ post.nbOfLikes }}</i>
            </div>
            <div class="col-6 d-flex justify-content-center">
              <i class="uil uil-comment-lines">{{ post.nbOfComments }}</i>
            </div>
          </div>
        </b-card>
      </div>
    </div>
  </div>
</template>
