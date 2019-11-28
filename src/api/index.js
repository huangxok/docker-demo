import http from "@/utils/http";

const API = {
  // 前端配置
  getFrontConfig: (params = null) => http.get("/api/pub/frontconfig", params),
  // 获取用户信息
  getUserInfo: (params = null) => http.get("/api/pub/currentuser", params)
};

export default API;
