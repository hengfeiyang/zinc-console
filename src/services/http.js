import store from "../store";
import router from "../router";
import axios from "axios";

var http = () => {
  var instance = axios.create({
    // timeout: 10000,
    baseURL: store.state.API_ENDPOINT,
    headers: {
      Authorization: "Basic " + store.state.user.base64encoded,
    },
  });

  instance.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      if (error.response.status === 401) {
        store.dispatch("logout");
        localStorage.setItem("creds", "");
        router.replace({ name: "login" });
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default http;
