import { useAuthStore } from "../state/pinia";
import axios from "axios";
const token = "";  /* store?._modules?.root?._children?.authfack?.state?.token; */
const current_user = {}; /* store?._modules?.root?._children?.authfack?.state?.user; */
export default {
  install(Vue)
  {
    var state = useAuthStore();
    var self = Vue.config.globalProperties;
    Vue.config.globalProperties.http = {
      post(url, data, options, loading)
      {
        return new Promise((resolve) =>
        {
          if (!options) options = {};
          if (!options.headers) options.headers = {};
          if (state.token)
          {
            options.headers["x-auth"] = state.token;
            data.user_id = state.currentUser.id;
          }

          if (localStorage.currentUser)
          {
            let current_user = JSON.parse(localStorage.currentUser);
            if (!data?.user_id)
            {
              data.user_id = current_user?.id;
            }
          }

          console.log(options);
          data.lang = Vue.config.globalProperties.$i18n.locale;
          if (loading) Vue.config.globalProperties.$loading.show();

          axios.post(state.baseUrl + url, data, options).then((resp) =>
          {
            console.log(resp.headers["x-auth"]);
            if (resp.headers["x-auth"])
            {
              state.token = resp.headers["x-auth"];
              console.log(data.pass);
              resp.data.data.pass = self.$e.encrypt(data.pass);
              state.currentUser = resp.data.data;
              localStorage.currentUser = JSON.stringify(resp.data.data);
            }

            console.log({ ShityData: resp.data });
            // Vue.config.globalProperties.$loading.hide();

            if (resp.data.status)
            {
              resolve(resp.data);
            } else
            {
              Vue.config.globalProperties.popup.alert({
                title: "popups.error",
                msg: resp.data.msg,
              });
            }
          });
        });
      },
      do(url, data, options)
      {
        return new Promise((resolve) =>
        {
          if (!options) options = {};
          if (!options.headers) options.headers = {};
          if (state.token)
          {
            options.headers["x-auth"] = state.token;
            data.user_id = state.currentUser.id;
          }

          console.log("step 70 :", data);

          if (localStorage.currentUser)
          {
            let current_user = JSON.parse(localStorage.currentUser);
            if (!data?.user_id)
            {
              data.user_id = current_user?.id;
            }
          }

          console.log(options);
          data.lang = Vue.config.globalProperties.$i18n.locale;
          var formData = new FormData();
          for (var key in data)
          {
            formData.append(key, data[key]);
          }

          axios.post(state.baseUrl + url, formData, options).then((resp) =>
          {
            console.log(resp.headers["x-auth"]);
            if (resp.headers["x-auth"])
            {
              state.token = resp.headers["x-auth"];
              console.log(data.pass);
              resp.data.data.pass = self.$e.encrypt(data.pass);
              state.currentUser = resp.data.data;
              localStorage.currentUser = JSON.stringify(resp.data.data);
              console.log(state.token);
            }
            if (resp.data.status)
            {
              resolve(resp.data);
            } else
            {
              Vue.config.globalProperties.popup.alert({
                title: "popups.error",
                msg: resp.data.msg,
              });
            }
          });
        });
      },
      put(url, id, data, options, loading)
      {
        return new Promise((resolve) =>
        {
          if (!options) options = {};
          if (!options.headers) options.headers = {};
          if (state.token)
          {
            options.headers["x-auth"] = state.token;
            data.user_id = state.currentUser.id;
          }

          if (localStorage.currentUser)
          {
            let current_user = JSON.parse(localStorage.currentUser);
            if (!data.user_id)
            {
              data.user_id = current_user?.id;
            }
          }
          console.log(options);
          // data.lang = Vue.config.globalProperties.$i18n.locale
          if (loading) Vue.config.globalProperties.$loading.show();
          axios.put(state.baseUrl + url + "/" + id, data, options).then((resp) =>
          {
            // Vue.config.globalProperties.$loading.hide();

            console.log(resp.headers["x-auth"]);
            if (resp.headers["x-auth"])
            {
              state.token = resp.headers["x-auth"];
              console.log(data.pass);
              resp.data.data.pass = self.$e.encrypt(data.pass);
              state.currentUser = resp.data.data;
              localStorage.currentUser = JSON.stringify(resp.data.data);
              console.log(state.token);
            }
            if (resp.data.status)
            {
              resolve(resp.data);
            } else
            {
              Vue.config.globalProperties.popup.alert({
                title: "popups.error",
                msg: resp.data.msg,
              });
            }
          });
        });
      },
      get(url, data, options, loading)
      {
        console.log("step 10 :", state.baseUrl);

        return new Promise((resolve) =>
        {
          if (!data) data = {};
          if (!options) options = {};
          if (!options.headers) options.headers = {};
          if (state.token)
          {
            options.headers["x-auth"] = state.token;
            data.user_id = state.currentUser.id;
          }

          if (token)
          {
            options.headers["x-auth"] = token;
            data.user = current_user;
          }

          console.log({ options_GET: options });
          data.lang = Vue.config.globalProperties.$i18n.locale;
          if (loading) Vue.config.globalProperties.$loading.show();
          axios.get(state.baseUrl + url + "?" + new URLSearchParams(data).toString(), options)
            .then((resp) =>
            {
              // console.log("the status is",resp.data.status)
              console.log(resp.headers["x-auth"]);
              if (resp.headers["x-auth"])
              {
                state.token = resp.headers["x-auth"];
                console.log(data.pass);
                resp.data.data.pass = self.$e.encrypt(data.pass);
                state.currentUser = resp.data.data;
                localStorage.currentUser = JSON.stringify(resp.data.data);
                console.log(state.token);
              }
              // Vue.config.globalProperties.$loading.hide();

              if (resp.data.status)
              {
                resolve(resp.data);
              } else
              {
                Vue.config.globalProperties.popup.alert({
                  title: "popups.error",
                  msg: resp.data.msg,
                });
              }
            });
        });
      },
      delete(url, id, options)
      {
        return new Promise((resolve) =>
        {
          var data = {};
          if (!options) options = {};
          if (!options.headers) options.headers = {};
          if (state.token)
          {
            options.headers["x-auth"] = state.token;
            data.user_id = state.currentUser.id;
          }

          if (localStorage.currentUser)
          {
            let current_user = JSON.parse(localStorage.currentUser);
            if (!data.user_id)
            {
              data.user_id = current_user?.id;
            }
          }
          console.log(options);
          data.lang = Vue.config.globalProperties.$i18n.locale;
          axios.delete(state.baseUrl + url + "/" + id + "?" + new URLSearchParams(data).toString(), options).then((resp) =>
          {
            console.log(resp.headers["x-auth"]);
            if (resp.headers["x-auth"])
            {
              state.token = resp.headers["x-auth"];
              console.log(data.pass);
              resp.data.data.pass = self.$e.encrypt(data.pass);
              state.currentUser = resp.data.data;
              localStorage.currentUser = JSON.stringify(resp.data.data);
              console.log(state.token);
            }
            if (resp.data.status)
            {
              resolve(resp.data);
            } else
            {
              Vue.config.globalProperties.popup.alert({
                title: "popups.error",
                msg: resp.data.msg,
              });
            }
          });
        });
      },
      download(url, fileName, data, options)
      {
        return new Promise((resolve) =>
        {
          if (!data) data = {};
          if (!options) options = { timeout: 5 * 60 * 1000 };
          if (!options.headers) options.headers = {};
          if (state.token)
          {
            options.headers["x-auth"] = state.token;
            data.user_id = state.currentUser.id;
          }
          console.log(options);
          data.lang = Vue.config.globalProperties.$i18n.locale;

          // progress bar
          function isIE()
          {
            var myNav = navigator.userAgent.toLowerCase();
            return myNav.indexOf("msie") != -1 ? parseInt(myNav.split("msie")[1]) : false;
          }

          axios({
            method: "GET",
            url: (!options.fullUrl ? state.baseUrl : "") + url + "?" + new URLSearchParams(data).toString(),
            data,
            responseType: "arraybuffer",
          })
            .then((data) =>
            {
              var D = document;
              var ieVersion = isIE();
              if (ieVersion && ieVersion < 10)
              {
                var frame = D.createElement("iframe");
                document.body.appendChild(frame);

                frame.contentWindow.document.open("text/html", "replace");
                frame.contentWindow.document.write("sep=,\r\n" + data.data);
                frame.contentWindow.document.close();
                frame.contentWindow.focus();
                console.log("hi 1");
                if (frame.contentWindow.document.execCommand("SaveAs", true, fileName))
                {
                  console.log("Bill is saved");
                } else
                {
                  Vue.config.globalProperties.popup.alert({
                    title: "popups.error",
                    msg: data.lang == "ar" ? "حدثت مشكلة في التحميل" : "File cannot be saved",
                  });
                }

                document.body.removeChild(frame);
                return true;
              }

              var file = new Blob([data.data]);
              if (typeof window.navigator.msSaveBlob !== "undefined")
              {
                window.navigator.msSaveBlob(file, fileName);
                console.log("hi msSaveBlob");
              } else
              {
                //for chrome in IOS
                if (navigator.userAgent.match("CriOS"))
                {
                  file = new Blob([data]);
                  var fileURL = URL.createObjectURL(file);
                  window.open(fileURL);
                } else
                {
                  fileURL = URL.createObjectURL(file);
                  var a = document.createElement("a");
                  if (typeof a.download === "undefined")
                  {
                    window.location = fileURL;
                  } else
                  {
                    a.href = fileURL;
                    a.target = "_blank";
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    console.log("hi win 2");
                  }
                }
              }
              resolve(true);
            })
            .catch((e) =>
            {
              // $.LoadingOverlay("hide");
              console.log(e);
              var reader = new FileReader();
              reader.onload = function (event)
              {
                console.log(event.target.result);
                var st = JSON.parse(atob(event.target.result.substring(37)));

                Vue.config.globalProperties.popup.alert({
                  title: "popups.error",
                  msg: st.msg,
                });
                //resolve(false);
              };
              var array = new Uint8Array(e.data);
              var blob = new Blob([array]);
              reader.readAsDataURL(blob);
            });
        });
      },
    };
  },
};
