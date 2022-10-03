<script>
/**
 * Login-1 component
 */
import axios from "axios";
import { getdata, persistData } from "../components/controllers/savingData";
export default {
  layout: "auth",
  head() {
    return {
      title: `${this.title} | Proof, A community for a healthy family.`,
    };
  },
  data() {
    return {
      title: "Sign in",
      baseUrl: null,
      userData: {
        username: null,
        password: null,
      },
      errorMessage: null,
    };
  },
  async mounted() {
    this.baseUrl = process.env.baseUrl;
    // let result = await getdata("account");
    // if (result) {
    //   console.log("");
    // }
  },
  methods: {
    async singin() {
      try {
        console.log("SS");
        let result = await axios.post(process.env.baseUrl + "/auth/local", {
          identifier: this.userData.username,
          password: this.userData.password,
        });
        console.log(result);
        this.errorMessage = null;
        if (result.data) {
          result = result.data;
          let signedUser = {
            username: result.user.username,
            confirmed: result.user.confirmed,
            id: result.user.id,
            role: result.user.role.name,
            jwt: result.jwt,
          };
          if (!signedUser.confirmed) {
            persistData("account", signedUser);
            this.$router.push("/admin");
          }
        }
      } catch (error) {
        this.errorMessage = error.response.data.message[0].messages[0].message;
        console.log(this.errorMessage);
      }
    },
  },
};
</script>

<template>
  <div>
    <div class="home-btn d-none d-sm-block">
      <nuxt-link to="/" class="text-dark"
        ><i class="mdi mdi-home-variant h2"></i
      ></nuxt-link>
    </div>
    <div class="account-pages my-5 pt-sm-5">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="text-center justify-content-center">
              <nuxt-link to="/" class="mb-5 d-block auth-logo">
                <center>
                  <img
                    src="~/assets/images/logoProofColors.png"
                    alt=""
                    height="100"
                    class="logo logo-dark"
                  />
                  <img
                    src="~/assets/images/logoProofColors.png"
                    alt=""
                    height="100"
                    class="logo logo-light"
                  />
                </center>
              </nuxt-link>
            </div>
          </div>
        </div>
        <div class="row align-items-center justify-content-center">
          <div class="col-md-8 col-lg-6 col-xl-5">
            <b-alert show v-if="errorMessage" dismissible variant="danger">{{
              errorMessage
            }}</b-alert>
            <div class="card">
              <div class="card-body p-4">
                <div class="text-center mt-2">
                  <h5 class="text-primary">Sing in !</h5>
                  <p class="text-muted">Sign in to continue to Proof.</p>
                </div>
                <div class="p-2 mt-4">
                  <div class="mb-3">
                    <label for="username">Username</label>
                    <input
                      type="text"
                      class="form-control"
                      id="username"
                      placeholder="Enter username"
                      v-model="userData.username"
                    />
                  </div>

                  <div class="mb-3">
                    <div class="float-end">
                      <nuxt-link to="/signin" class="text-muted">
                        Forgot password?</nuxt-link
                      >
                    </div>
                    <label for="userpassword">Password</label>
                    <input
                      type="password"
                      class="form-control"
                      id="userpassword"
                      placeholder="Enter password"
                      v-model="userData.password"
                    />
                  </div>

                  <div class="form-check">
                    <input
                      type="checkbox"
                      class="form-check-input"
                      id="auth-remember-check"
                    />
                    <label class="form-check-label" for="auth-remember-check"
                      >Remember me</label
                    >
                  </div>

                  <div class="mt-3 text-end">
                    <button
                      class="btn btn-primary w-sm waves-effect waves-light"
                      @click="singin"
                    >
                      Log In
                    </button>
                  </div>

                  <!-- <div class="mt-4 text-center">
                      <p class="mb-0">
                        Don't have an account ?
                        <nuxt-link
                          to="/auth/register-1"
                          class="fw-medium text-primary"
                        >
                          Signup now</nuxt-link
                        >
                      </p>
                    </div> -->
                </div>
              </div>
            </div>

            <div class="mt-5 text-center">
              <p>© {{ new Date().getFullYear() }} Proof.</p>
            </div>
          </div>
        </div>
        <!-- end row -->
      </div>
      <!-- end container -->
    </div>
  </div>
</template>
