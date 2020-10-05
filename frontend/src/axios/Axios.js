import axios from "axios";
import { store } from "../redux/Store";
import ClearStoreTempAction from "../redux/actions/ClearStoreTempAction";

const instance = axios.create({
//  baseURL: "https://mycv.atkev.site",
  baseURL: "http://localhost:9000",
//  baseURL: "https://kevinlh.herokuapp.com",
});

instance.interceptors.request.use(
  async function (config) {
    try {
      config.headers.Authorization = store.getState().token;
    } finally {
      config.headers.ContentType = "application/json";
      config.headers.AccessControlAllowOrigin = "*";
      return config;
    }
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      console.log("Error: unauthorized error, JWT token discarded");
      store.dispatch(ClearStoreTempAction());
    } else {
    }
    return Promise.reject(error);
  }
);

export default instance;
