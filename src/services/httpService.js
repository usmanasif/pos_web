import axios from "axios";
import { toast } from "react-toastify";

axios.interceptors.request.use(data => {
  data.headers["access-token"] = localStorage.getItem("access-token");
  return data;
}, null);

axios.interceptors.response.use(
  data => {
    if (!data.config.url.includes("auth/")) {
      // updateLocalStorage(data.headers);
    }
    return data;
  },
  error => {
    const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;
    if (!expectedError) {
      toast.error("An unexpected error occurrred.");
    }

    return Promise.reject(error);
  }
);
// function updateLocalStorage(res) {
//   localStorage.setItem("access-token", res["access-token"]);
//   localStorage.setItem("token-type", res["token-type"]);
//   localStorage.setItem("client", res["client"]);
//   localStorage.setItem("uid", res["uid"]);
//   localStorage.setItem("expiry", res["expiry"]);
// }
export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete
};
