import * as types from "./mutation_types";

export default {
  [types.GET_FRONT_CONFIG](state, payload) {
    state.frontConfig = payload;
  },
  [types.GET_USER_INFO](state, payload) {
    state.userInfo = payload;
  }
};
