import Vue from "vue";
import store from "./store";
import App from "./App.vue";
import axios from "axios";
import router from "./router";
import ElementUI from "element-ui";
Vue.use(ElementUI);

Vue.config.productionTip = false;

import * as filters from "./utils/filters";
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

const Init = async parms => {
  // await store.dispatch("getFrontConfig"); //获取配置
  // axios.defaults.baseURL =
  //   process.env.NODE_ENV === "production"
  //     ? store.state.frontConfig.portalHost || ""
  //     : "";
  return new Vue(parms).$mount("#app");
};
Init({
  router,
  store,
  render: h => h(App)
});
