
<template>
  <div class="my-5 pt-sm-5">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <div class="text-center">
            <div>
              <div class="row justify-content-center">
                <div class="col-sm-4">
                  <div class="error-img">
                    <img
                      src="~/assets/images/404-error.png"
                      alt
                      class="img-fluid mx-auto d-block"
                    />
                  </div>
                </div>
              </div>
            </div>
            <h4 class="text-uppercase mt-4">DÉSOLÉ, PAGE NON TROUVÉE</h4>
            <p class="text-muted mt-4">
              la page que vous souhaitez consulter est soit inexistante, soit en
              cours de maintenance et de développement.
            </p>
            <p class="text-muted">
              Si vous constatez une erreur ou une anomalie, veuillez contacter
              l'équipe Proof.
            </p>
            <div class="mt-5">
              <span class="btn btn-primary" @click="goBack"> Retourner</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * 404-component
 */
export default {
  layout: "auth",
  head() {
    return {
      title: `${this.title} | BinBudget, Business on budget`,
    };
  },
  data() {
    return {
      title: "Error-404",
    };
  },
  middleware: "authentication",
  methods: {
    goBack() {
      this.$router.go(-1);
    },
  },
};
</script>