import moment from "moment";
export default {
    install(Vue) {
        Vue.config.globalProperties.moment = moment
    }
}
