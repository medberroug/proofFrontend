<script>
import axios from "axios";
/**
 * Dashboard component
 */

export default {
  layout: "auth",
  head() {
    return {
      title: `${this.title} | Proof, A community for a healthy family.`,
    };
  },
  data() {
    return {
      title: "Proof",
      items: [
        {
          text: "Minible",
        },
        {
          text: "Dashboard",
          active: true,
        },
      ],
    };
  },
  methods: {},
  // middleware: "authentication",
};
</script>

<template>
  <div>
    <center class="myLogo">
      <img

      width="150"
        src="~/assets/images/logoProofColors.png"
        alt
        class="img-fluid mx-auto d-block "
      />
      <h3 class="p-3 text-black">Soon...</h3>
    </center>
  </div>
</template>

<style>
.myLogo{
  padding-top: 40vh;
}
</style>
