<script>
import axios from "axios";
/**
 * Dashboard component
 */

export default {
  head() {
    return {
      title: `${this.title} | Proof, A community for a healthy family.`,
    };
  },
  data() {
    return {
      title: "Dashboard",
      items: [
        {
          text: "Proof",
        },
        {
          text: "Dashboard",
          active: true,
        },
      ],
    };
  },
  methods: {
    async auth() {
      try {
        console.log("SS");
        let result = await axios.post("http://localhost:1337/auth/local", {
          identifier: "medberroug",
          password: "password",
        });
        console.log(result);
        console.log(result.status);
      } catch (error) {}
    },
  },
  middleware: "authentication",
};
</script>

<template>
  <div>
    <PageHeader :title="title" :items="items" />
    
  </div>
</template>

<style></style>
