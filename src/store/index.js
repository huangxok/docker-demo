/**
 * index.js 为公用状态管理器
 * 项目复杂时，多人协同开发按module开发，需创建 src/store/modules/[你的模块名]/
 */

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import * as actions from "./actions";
import * as getters from "./getters";
import states from "./states";
import mutations from "./mutations";

/**
 * 是否调试模式
 * @type {boolean}
 */
const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  state: states,
  mutations: mutations,
  actions: actions,
  getters: getters,
  strict: debug,
  modules: {}
});
