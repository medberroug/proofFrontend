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
      sortBy: "age",
      sortDesc: false,
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
      console.log(process.env.baseUrl + "/posts");
      let result = await axios.get(process.env.baseUrl + "/posts");
      result = result.data;
      for (let i = 0; result.length; i++) {
        let images = [];
        for (let j = 0; j < result[i].images.length; j++) {
          images.push(this.baseUrl + result[i].images[j].url);
        }
        let creator = await axios.get(
          process.env.baseUrl + "/users/" + result[i].by.userId
        );
        creator = creator.data.username;
        let newPost = {
          id: result[i].id,
          profileImage: result[i].by.photo.url,
          postBy: creator,
          postWhen: result[i].created_at,
          text: result[i].text,
          images: images,
          status: result[i].status,
        };
        this.posts.push(newPost)
      }
      console.log(this.posts);
    } catch (error) {}
  },
  methods: {
    /**
     * Search the table data with search input
     */
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
    <div class="row">
      <div class="col-sm-12 col-md-3">
        <b-button variant="primary">
          <i class="uil uil-plus mr-2"></i>
          Add new
        </b-button>
      </div>
    </div>
    <div class="row mt-3">
      <div class="col-md-3">
        <b-card img-alt="Card image" img-bottom>
          <b-card-title>
            <div class="row">
              <div class="col-md-auto d-flex align-items-center">
                <img v-if="false" alt class="avatar-xs rounded-circle me-2" />
                <div v-if="true" class="avatar-xs d-inline-block me-2">
                  <div
                    class="
                      avatar-title
                      bg-soft-Primary
                      rounded-circle
                      text-Primary
                    "
                  >
                    <i class="mdi mdi-account-circle m-0"></i>
                  </div>
                </div>
              </div>
              <div class="col-md-auto d-flex align-items-center">
                <div>
                  <h5 class="card-title">Card title</h5>
                  <small class="text-muted">Last updated 3 mins ago</small>
                </div>
              </div>
              <div
                class="
                  col-md-auto
                  d-flex
                  align-items-center
                  justify-items-stretch
                "
              >
                <div>
                  <span><i class="uil uil-ellipsis-v"></i></span>
                </div>
              </div>
            </div>
          </b-card-title>
          <p></p>
          <b-card-text>
            <p>
              This is a wider card with supporting text below as a natural
              lead-in to additional content. This content is a little bit
              longer.
            </p>
          </b-card-text>
          <b-carousel
            style="text-shadow: 0px 0px 2px #000"
            controls
            indicators
            fade
          >
            <b-carousel-slide
              :img-src="require('~/assets/images/small/img-1.jpg')"
            ></b-carousel-slide>
            <b-carousel-slide
              :img-src="require('~/assets/images/small/img-2.jpg')"
            ></b-carousel-slide>
            <b-carousel-slide
              :img-src="require('~/assets/images/small/img-3.jpg')"
            ></b-carousel-slide>
          </b-carousel>
        </b-card>
      </div>
    </div>
  </div>
</template>
