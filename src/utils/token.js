import LocalStorageSerivce from "../services/LocalStorageService";
import store from "../store";
import axios from "axios";

const localStorageService = LocalStorageSerivce.getService();

export default () => {
  setInterval(() => {
    const token = localStorageService.getAccessToken();
    if (token) {
      // We are logged in
      let arr = token.split(".");
      var base64 = arr[1].replace(/-/g, "+").replace(/_/g, "/");
      var payload = JSON.parse(
        decodeURIComponent(
          atob(base64)
            .split("")
            .map(function(c) {
              return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
            })
            .join("")
        )
      );
      if (typeof payload !== "object") {
        localStorageService.clearToken();
        store.commit("setAuth", { token: "", username: "" });
        return;
      }

      axios
        .get("/auth/refresh")
        .then((resp) => {
          if (resp.status === 200 || resp.status === 201) {
            localStorageService.setToken(resp.data.token);
            store.commit("setAuth", {
              token: resp.data.token,
              username: resp.data.username,
            });
          }
        })
        .catch(() => {
          console.dir("Failed to login");
          localStorageService.clearToken();
          store.commit("setAuth", { token: "", username: "" });
        });
    }
  }, 60 * 1000); // Once per minute
};
