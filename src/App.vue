<template>
  <div id="app">
    <!-- <plat-nav></plat-nav> -->
    <main>
      <router-view />
    </main>
    <!-- <footer-box></footer-box> -->
  </div>
</template>

<script>
// import PlatNav from "@/components/PlatNav/index.vue";
// import FooterBox from "@/components/Footer/index.vue";

export default {
  components: {
    // PlatNav,
    // FooterBox
  },
  data() {
    return {};
  },
  async created() {
    // 获取用户信息
    // await this.$store.dispatch("getUserInfo").catch(err => console.error(err)); // 用户信息
  },
  async mounted() {}
};
</script>

<style lang="scss">
@import "~@/assets/sass/app.scss";

// css sticky footer布局
#app {
  display: flex;
  flex-flow: column;
  min-height: 100vh;
  min-width: 1200px;
  main {
    flex: 1;
  }
}
</style>
