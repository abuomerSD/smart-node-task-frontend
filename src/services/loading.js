import $ from "jquery"
var template
function makeMobileLoader() {
    var template = $(` <div style="position:fixed;width:100%;height:100%;top:0;left:0;display:flex;align-items:center;justify-content:center;z-index:999999;background:rgba(0,0,0,0.2)">
<span class="bx bx-loader-alt fa-spin fa-4x" style="color:#289091"></span>
  </div>`)
    $("body").append(template)
    return template
}
window.$loading = {
    show(obj) {
        if (!obj) obj = {}
        template = makeMobileLoader()
        if (obj.time) {
            setTimeout(template.remove, obj.time)
        }
    },
    hide() {
        if (template)
            template.remove()
    }
}
export default {
    install(Vue) {

        Vue.config.globalProperties.$loading = window.$loading
    }
}