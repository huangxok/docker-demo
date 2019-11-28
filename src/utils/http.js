import axios from "axios";
import Qs from "qs";

// 设置axios默认Content-type类型
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const service = axios.create({
  timeout: 10000,
  withCredentials: true,
  headers: { "X-Requested-With": "XMLHttpRequest" }
});

service.defaults.transformRequest = [
  data => {
    if (data instanceof FormData) {
      return data;
    }
    data = Qs.stringify(data);
    return data;
  }
];
service.defaults.transformResponse = [
  data => {
    data = JSON.parse(data);
    if (data.code === "100009" || data.code === "100016") {
      window.location.href = `/login?routeurl=${
        window.location.origin
      }${encodeURIComponent(location.hash)}`;
      return;
    }
    return data;
  }
];

service.interceptors.request.use(
  config => {
    // config.headers["X-Requested-With"] = "XMLHttpRequest";
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  res => {
    return res;
  },
  error => {
    return Promise.reject(error);
  }
);

const http = (url, params = null, type = "get") => {
  return new Promise((resolve, reject) => {
    service[type](
      url,
      type === "get"
        ? {
            params: params
          }
        : params
    )
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        if (err === "Error: timeout of 5000ms exceeded") {
          console.log("服务器请求超时");
          return;
        }
        console.error(err.stack);
        reject(err);
      });
  });
};

const get = (url, params = null) => {
  return http(url, params, "get");
};

const post = (url, params = null) => {
  return http(url, params, "post");
};

export default {
  service,
  http,
  get,
  post
};
