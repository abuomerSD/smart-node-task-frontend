import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import VueApexCharts from "vue3-apexcharts";
import vClickOutside from "click-outside-vue3";
import { registerScrollSpy } from "vue3-scroll-spy";

import { vMaska } from "maska";
import { i18n } from "./i18n";
import { initFirebaseBackend } from "./authUtils";
import { configureFakeBackend } from "./helpers/fake-backend";

import BootstrapVueNext from "bootstrap-vue-next";

import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue-next/dist/bootstrap-vue-next.css";
import "@/assets/scss/app.scss";
import "@vueform/multiselect/themes/default.css";
import http from "@/services/http";
import popup from "@/services/popups";
// PINIA
import pinia from "@/state/pinia";
import $e from "@/services/$e";

// Toast
import ToastPlugin from 'vue-toast-notification';
import 'vue-toast-notification/dist/theme-bootstrap.css';

// PrimeVue
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';



const firebaseConfig = {
  apiKey: process.env.VUE_APP_APIKEY,
  authDomain: process.env.VUE_APP_AUTHDOMAIN,
  databaseURL: process.env.VUE_APP_VUE_APP_DATABASEURL,
  projectId: process.env.VUE_APP_PROJECTId,
  storageBucket: process.env.VUE_APP_STORAGEBUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGINGSENDERID,
  appId: process.env.VUE_APP_APPId,
  measurementId: process.env.VUE_APP_MEASUREMENTID,
};

if (process.env.VUE_APP_DEFAULT_AUTH === "firebase")
{
  initFirebaseBackend(firebaseConfig);
} else
{
  configureFakeBackend();
}

import "sweetalert2/dist/sweetalert2.min.css";

createApp(App)
  .use(pinia)
  .use(router)
  .use(require("vue-chartist"))
  .use(BootstrapVueNext)
  .use(VueApexCharts)
  .use(vClickOutside)
  .use(i18n)
  .use(registerScrollSpy)
  .directive("maska", vMaska)
  .use(popup)
  .use(http)
  .use($e)
  .use(PrimeVue, {
    theme: {
      preset: Aura
    }
  })
  .use(ToastPlugin, { position: 'top', duration: 3000 })
  .mount("#app");
