import store from "../state/store";
import router from "@/router";
import axios from "@/services/axios";
import socket from "@/services/socket"
export default {
  install(Vue) {
    var self = Vue.config.globalProperties;
    window.login = {
      async login(username, pass) {
     

        const res = await axios.post("users/login", { username, pass });
        if (res?.data?.status) {

          socket(res?.data?.data?.session_id, res.data?.data?.token);
          store.commit("authfack/autoLoginToggle");
          localStorage["permissions"] = JSON.stringify(
            res?.data?.data?.permissions
          );
          store.dispatch('authfack/setNotiPurchaseOrder', res.data?.data?.noti_purchase_orders)
          console.log("step 38 : " + res.data?.data?.noti_purchase_orders);
          console.log("step 39 : " + store.state.authfack.noti_purchase_orders);
          store.dispatch("authfack/setPermissionsFromLocalStorage");
          localStorage["kassala_farm_token"] = res.data?.data?.token;
          localStorage["currentUser"] = JSON.stringify({ ...res.data?.data.user, pass: self.$e.encrypt(pass) });
          store.dispatch(
            "authfack/setCurrentUser",
            res.data?.data.user
          );

          // get menus and sub
          console.log("role_id :", res.data?.data.user["role_id"]);

          self.http
            .post("users/user-permission", {
              role_id: res.data?.data.user["role_id"],
            })
            .then((resp) => {
              if (resp) {
                console.log("permission :", resp.data);
                localStorage["permission"] = JSON.stringify(resp.data);
                store.dispatch(
                  "authfack/setPermissionsFromLocalStorage"
                );
                console.log(
                  "route state:",
                  store?.state?.authfack?.permission
                );
                let selected;
                if (store?.state?.authfack?.selected_company) {
                  selected = store?.state?.authfack?.selected_company;
                } else {
                  selected = Object.keys(
                    store?.state?.authfack?.permissions
                  ).filter(
                    (o) =>
                      Object.keys(
                        store?.state?.authfack?.permissions[o]
                      ).length > 0
                  )[0];
                }
                console.log("step 84 log", selected);
                store.dispatch("authfack/setSelectedCompany", selected);
                localStorage["selected_company"] = selected;
                store.dispatch(
                  "authfack/setSelectedCompanyId",
                  store?.state?.authfack?.allCompanies?.filter(
                    (i) => i?.name == localStorage["selected_company"]
                  )?.[0]?.id
                );

                localStorage["selected_company_id"] =
                  store?.state?.authfack?.selected_company_id;
                console.log(
                  "step login ",
                  store?.state?.authfack?.selected_company_id
                );
                // socket.connect();

                // store.dispatch('authfack/setSelectedCompanyId',)
                // setTimeout(() => {
                store.dispatch("authfack/setMenusData", resp.data);
                console.log(
                  "permission :",
                  store?.state?.authfack?.permission
                );
                // router.push("/home");
                // }, 200);
                return;
              }
            });



          return res

        } else return res;
      },
      async loginMarketing(username, pass) {
     

        const res = await axios.post("users/login-marketing-team", { username, pass });
        if (res?.data?.status) {

          socket(res?.data?.data?.session_id, res.data?.data?.token);
          store.commit("authfack/autoLoginToggle");
          localStorage["permissions"] = JSON.stringify(
            res?.data?.data?.permissions
          );
          store.dispatch('authfack/setNotiPurchaseOrder', res.data?.data?.noti_purchase_orders)
          console.log("step 38 : " + res.data?.data?.noti_purchase_orders);
          console.log("step 39 : " + store.state.authfack.noti_purchase_orders);
          store.dispatch("authfack/setPermissionsFromLocalStorage");
          localStorage["kassala_farm_token"] = res.data?.data?.token;
          localStorage["currentUser"] = JSON.stringify({ ...res.data?.data.user, pass: self.$e.encrypt(pass) });
          store.dispatch(
            "authfack/setCurrentUser",
            res.data?.data.user
          );

          // get menus and sub
          console.log("role_id :", res.data?.data.user["role_id"]);

          self.http
            .post("users/user-permission", {
              role_id: res.data?.data.user["role_id"],
            })
            .then((resp) => {
              if (resp) {
                console.log("permission :", resp.data);
                localStorage["permission"] = JSON.stringify(resp.data);
                store.dispatch(
                  "authfack/setPermissionsFromLocalStorage"
                );
                console.log(
                  "route state:",
                  store?.state?.authfack?.permission
                );
                let selected;
                if (store?.state?.authfack?.selected_company) {
                  selected = store?.state?.authfack?.selected_company;
                } else {
                  selected = Object.keys(
                    store?.state?.authfack?.permissions
                  ).filter(
                    (o) =>
                      Object.keys(
                        store?.state?.authfack?.permissions[o]
                      ).length > 0
                  )[0];
                }
                console.log("step 84 log", selected);
                store.dispatch("authfack/setSelectedCompany", selected);
                localStorage["selected_company"] = selected;
                store.dispatch(
                  "authfack/setSelectedCompanyId",
                  store?.state?.authfack?.allCompanies?.filter(
                    (i) => i?.name == localStorage["selected_company"]
                  )?.[0]?.id
                );

                localStorage["selected_company_id"] =
                  store?.state?.authfack?.selected_company_id;
                console.log(
                  "step login ",
                  store?.state?.authfack?.selected_company_id
                );
                // socket.connect();

                // store.dispatch('authfack/setSelectedCompanyId',)
                // setTimeout(() => {
                store.dispatch("authfack/setMenusData", resp.data);
                console.log(
                  "permission :",
                  store?.state?.authfack?.permission
                );
                // router.push("/home");
                // }, 200);
                return;
              }
            });



          return res

        } else return res;
      },
      autoLogin(user) {
        if (!store.state.autoLogin) {
          user.pass = self.$e.decrypt(user.pass);
          self.http
            .post("users/login", { name: user.name, pass: user.pass })
            .then((res) => {
              if (!res) {
                router.push("/login");
              }
              console.log("base url :", store.state.baseUrl);
              console.log("res body :", res);
              store.commit("addUserData", res.data);

              console.log("state currentUser : --> ", store.state.currentUser);

              console.log("token :", store.state.token);

              console.log(user);
              console.log(" auto login");
            });
        } else {
          console.log("no auto login");
        }
      },
      async logout() {
        localStorage.removeItem("kassala_farm_token");
        localStorage.removeItem("permissions");
        localStorage.removeItem("permission");
        localStorage.removeItem("companies");
        localStorage.removeItem("currentUser");
        localStorage.removeItem("selected_company");
        if (window.socket && window.socket.connected) {

          window.socket.disconnect();
        }
        router.replace("/login");
      }
    };
    self.login = window.login;

  },
};
