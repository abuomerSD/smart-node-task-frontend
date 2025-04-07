export default {
  install(Vue) {
    var self = Vue.config.globalProperties;
    Vue.config.globalProperties.responseAlert = {
      fire(text, title, icon) {
        self.$swal.fire({
          title: `${title}`,
          text: ` ${text} `,
          icon: `${icon}`,
          toast: true,
          position: "top-start",
          showConfirmButton: false,
          timer: 2000,
        });
      },
    };
  },
};
