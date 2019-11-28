import api from "@/api/index";
import * as types from "./mutation_types";

/**
 * 获取请求url配置
 * @param commit
 * @returns {Promise<void>}
 */
export const getFrontConfig = async function({ commit }) {
  const res = await api.getFrontConfig({
    type: "json"
  });
  if (res) {
    commit(types.GET_FRONT_CONFIG, res);
  }
};

/**
 * 获取用户信息
 * @param commit
 */
export const getUserInfo = async function({ commit }) {
  const res = await api.getUserInfo({
    _: Math.random()
  });
  if (res.code === "success") {
    commit(types.GET_USER_INFO, res.data);
  }
};
