<script>
import simplebar from "simplebar-vue";
import {i18n} from "../i18n";

/**
 * Horizontal-topbar component
 */
export default {
  props: {
    type: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      required: true,
    },
    mode: {
      type: String,
      required: true
    }
  },
  components: {
    simplebar,
  },
  data() {
    return {
      languages: [
        {
          flag: require("@/assets/images/flags/us.jpg"),
          language: "en",
          title: "English",
        },
        {
          flag: require("@/assets/images/flags/french.jpg"),
          language: "fr",
          title: "French",
        },
        {
          flag: require("@/assets/images/flags/spain.jpg"),
          language: "es",
          title: "spanish",
        },
        {
          flag: require("@/assets/images/flags/chaina.png"),
          language: "zh",
          title: "Chinese",
        },
        {
          flag: require("@/assets/images/flags/arabic.png"),
          language: "ar",
          title: "Arabic",
        },
      ],
      lang: "en",
      lan: i18n.locale,
      text: null,
      flag: null,
      value: null,
    };
  },
  mounted() {
    if (process.env.VUE_APP_I18N_LOCALE) {
      this.flag = this.$i18n.locale || process.env.VUE_APP_I18N_LOCALE;
      this.languages.forEach((item) => {
        if (item.language == this.flag) {
          document.getElementById("header-lang-img").setAttribute("src", item.flag);
        }
      });
    }
  },
  methods: {
    toggleRightSidebar() {
      this.$parent.toggleRightSidebar();
    },
    toggleMenu() {
      let element = document.getElementById("topnav-menu-content");
      element.classList.toggle("show");
    },
    initFullScreen() {
      document.body.classList.toggle("fullscreen-enable");
      if (
        !document.fullscreenElement &&
        /* alternative standard method */ !document.mozFullScreenElement &&
        !document.webkitFullscreenElement
      ) {
        // current working methods
        if (document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen();
        } else if (document.documentElement.mozRequestFullScreen) {
          document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
          document.documentElement.webkitRequestFullscreen(
            Element.ALLOW_KEYBOARD_INPUT
          );
        }
      } else {
        if (document.cancelFullScreen) {
          document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
          document.webkitCancelFullScreen();
        }
      }
    },
    setLanguage(locale, country, flag) {
      this.lan = locale;
      this.text = country;
      this.flag = flag;
      document.getElementById("header-lang-img").setAttribute("src", flag);
      this.$i18n.locale = locale;
    },
  },
  watch: {
    type: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "dark":
              document.body.setAttribute("data-topbar", "dark");
              document.body.removeAttribute("data-layout-scrollable");
              break;
            case "light":
              document.body.setAttribute("data-topbar", "light");
              document.body.removeAttribute("data-layout-size", "boxed");
              document.body.removeAttribute("data-layout-scrollable");
              break;
            case "colored":
              document.body.setAttribute("data-topbar", "colored");
              document.body.removeAttribute("data-layout-size", "boxed");
              break;
            default:
              document.body.setAttribute("data-topbar", "dark");
              break;
          }
        }
      },
    },
    width: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "boxed":
              document.body.setAttribute("data-layout-size", "boxed");
              document.body.removeAttribute("data-layout-scrollable");
              break;
            case "fluid":
              document.body.setAttribute("data-layout-mode", "fluid");
              document.body.removeAttribute("data-layout-scrollable");
              document.body.removeAttribute("data-layout-size");
              break;
            case "scrollable":
              document.body.setAttribute("data-layout-scrollable", "true");
              document.body.removeAttribute("data-layout-mode");
              document.body.removeAttribute("data-layout-size");
              break;
            default:
              document.body.setAttribute("data-layout-mode", "fluid");
              break;
          }
        }
      },
    },
    mode: {
      immediate: true,
      handler(newVal, oldVal) {
        if (newVal !== oldVal) {
          switch (newVal) {
            case "light":
              document.body.setAttribute("data-bs-theme", "light");
              break;
            case "dark":
              document.body.setAttribute("data-bs-theme", "dark");
              break;
            default:
              document.body.setAttribute("data-bs-theme", "light");
              break;
          }
        }
      }
    }
  },
};
</script>

<template>
  <header id="page-topbar">
    <div class="navbar-header">
      <div class="d-flex">
        <!-- LOGO -->
        <div class="navbar-brand-box">
          <router-link to="/" class="logo logo-dark">
            <span class="logo-sm">
              <img src="@/assets/images/logo.svg" alt height="22" />
            </span>
            <span class="logo-lg">
              <img src="@/assets/images/logo-dark.png" alt height="17" />
            </span>
          </router-link>

          <router-link to="/" class="logo logo-light">
            <span class="logo-sm">
              <img src="@/assets/images/logo-light.svg" alt height="22" />
            </span>
            <span class="logo-lg">
              <img src="@/assets/images/logo-light.png" alt height="19" />
            </span>
          </router-link>
        </div>

        <BButton variant="white" id="toggle" type="button" class="btn btn-sm me-2 font-size-16 d-lg-none header-item" @click="toggleMenu">
          <i class="fa fa-fw fa-bars"></i>
        </BButton>

        <!-- App Search-->
        <BForm class="app-search d-none d-lg-block">
          <div class="position-relative">
            <input type="text" class="form-control" placeholder="Search..." />
            <span class="bx bx-search-alt"></span>
          </div>
        </BForm>

        <BDropdown variant="black" class="dropdown-mega d-none d-lg-block ms-2" toggle-class="header-item" menu-class="dropdown-megamenu">
          <template v-slot:button-content>
            {{ $t("navbar.dropdown.megamenu.text") }}
            <i class="mdi mdi-chevron-down"></i>
          </template>

          <BRow>
            <BCol sm="8">
              <BRow>
                <BCol md="4">
                  <h5 class="font-size-14 mt-0">
                    {{ $t("navbar.dropdown.megamenu.uicontent.title") }}
                  </h5>
                  <ul class="list-unstyled megamenu-list">
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t("navbar.dropdown.megamenu.uicontent.list.lightbox")
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t(
                          "navbar.dropdown.megamenu.uicontent.list.rangeslider"
                        )
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t("navbar.dropdown.megamenu.uicontent.list.sweetalert")
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t("navbar.dropdown.megamenu.uicontent.list.rating")
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t("navbar.dropdown.megamenu.uicontent.list.forms")
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t("navbar.dropdown.megamenu.uicontent.list.tables")
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t("navbar.dropdown.megamenu.uicontent.list.charts")
                      }}</BLink>
                    </li>
                  </ul>
                </BCol>

                <BCol md="4">
                  <h5 class="font-size-14 mt-0">
                    {{ $t("navbar.dropdown.megamenu.application.title") }}
                  </h5>
                  <ul class="list-unstyled megamenu-list">
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t(
                          "navbar.dropdown.megamenu.application.list.ecommerce"
                        )
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t("navbar.dropdown.megamenu.application.list.calendar")
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t("navbar.dropdown.megamenu.application.list.email")
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t("navbar.dropdown.megamenu.application.list.projects")
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t("navbar.dropdown.megamenu.application.list.tasks")
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t("navbar.dropdown.megamenu.application.list.contacts")
                      }}</BLink>
                    </li>
                  </ul>
                </BCol>

                <BCol md="4">
                  <h5 class="font-size-14 mt-0">
                    {{ $t("navbar.dropdown.megamenu.extrapages.title") }}
                  </h5>
                  <ul class="list-unstyled megamenu-list">
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t(
                          "navbar.dropdown.megamenu.extrapages.list.lightsidebar"
                        )
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t(
                          "navbar.dropdown.megamenu.extrapages.list.compactsidebar"
                        )
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t(
                          "navbar.dropdown.megamenu.extrapages.list.horizontallayout"
                        )
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t(
                          "navbar.dropdown.megamenu.extrapages.list.maintenance"
                        )
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t(
                          "navbar.dropdown.megamenu.extrapages.list.comingsoon"
                        )
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t("navbar.dropdown.megamenu.extrapages.list.timeline")
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t("navbar.dropdown.megamenu.extrapages.list.faqs")
                      }}</BLink>
                    </li>
                  </ul>
                </BCol>
              </BRow>
            </BCol>
            <BCol sm="4">
              <BRow>
                <BCol sm="6">
                  <h5 class="font-size-14 mt-0">
                    {{ $t("navbar.dropdown.megamenu.uicontent.title") }}
                  </h5>
                  <ul class="list-unstyled megamenu-list">
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t("navbar.dropdown.megamenu.uicontent.list.lightbox")
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t(
                          "navbar.dropdown.megamenu.uicontent.list.rangeslider"
                        )
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t("navbar.dropdown.megamenu.uicontent.list.sweetalert")
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t("navbar.dropdown.megamenu.uicontent.list.rating")
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t("navbar.dropdown.megamenu.uicontent.list.forms")
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t("navbar.dropdown.megamenu.uicontent.list.tables")
                      }}</BLink>
                    </li>
                    <li>
                      <BLink href="javascript:void(0);">{{
                        $t("navbar.dropdown.megamenu.uicontent.list.charts")
                      }}</BLink>
                    </li>
                  </ul>
                </BCol>

                <BCol sm="5">
                  <div>
                    <img src="@/assets/images/megamenu-img.png" alt class="img-fluid mx-auto d-block" />
                  </div>
                </BCol>
              </BRow>
            </BCol>
          </BRow>
        </BDropdown>
      </div>

      <div class="d-flex">
        <BDropdown class="d-inline-block d-lg-none ms-2" variant="black" menu-class="dropdown-menu-lg p-0 dropdown-menu-end" toggle-class="header-item noti-icon" right>
          <template v-slot:button-content>
            <i class="mdi mdi-magnify"></i>
          </template>

          <BForm class="p-3">
            <div class="form-group m-0">
              <div class="input-group">
                <input type="text" class="form-control" placeholder="Search ..." aria-label="Recipient's username" />
                <div class="input-group-append">
                  <BButton class="btn btn-primary" type="submit">
                    <i class="mdi mdi-magnify"></i>
                  </BButton>
                </div>
              </div>
            </div>
          </BForm>
        </BDropdown>
        <BDropdown variant="white" class="d-flex d-inline-block align-center" menu-class="dropdown-menu-end" toggle-class="header-item">
          <template v-slot:button-content>
            <img id="header-lang-img" src="@/assets/images/flags/us.jpg" alt="Header Language" height="16" />
          </template>
          <BLink href="#" v-for="(entry, i) in languages" :key="`Lang${i}`" :value="entry" @click="setLanguage(entry.language, entry.title, entry.flag)" :class="{ active: lan === entry.language }" class="dropdown-item notify-item language">
            <img :src="entry.flag" alt="user-image" class="me-1" height="12" />
            <span class="align-middle">{{ entry.title }}</span>
          </BLink>
        </BDropdown>

        <BDropdown class="d-none d-lg-inline-block noti-icon" menu-class="dropdown-menu-lg dropdown-menu-end" right toggle-class="header-item" variant="black">
          <template v-slot:button-content>
            <i class="bx bx-customize"></i>
          </template>

          <div class="px-lg-2">
            <BRow class="no-gutters">
              <BCol>
                <BLink class="dropdown-icon-item" href="javascript: void(0);">
                  <img src="@/assets/images/brands/github.png" alt="Github" />
                  <span>{{ $t("navbar.dropdown.site.list.github") }}</span>
                </BLink>
              </BCol>
              <BCol>
                <BLink class="dropdown-icon-item" href="javascript: void(0);">
                  <img src="@/assets/images/brands/bitbucket.png" alt="bitbucket" />
                  <span>{{ $t("navbar.dropdown.site.list.github") }}</span>
                </BLink>
              </BCol>
              <BCol>
                <BLink class="dropdown-icon-item" href="javascript: void(0);">
                  <img src="@/assets/images/brands/dribbble.png" alt="dribbble" />
                  <span>{{ $t("navbar.dropdown.site.list.dribbble") }}</span>
                </BLink>
              </BCol>
            </BRow>

            <BRow class="no-gutters">
              <BCol>
                <BLink class="dropdown-icon-item" href="javascript: void(0);">
                  <img src="@/assets/images/brands/dropbox.png" alt="dropbox" />
                  <span>{{ $t("navbar.dropdown.site.list.dropbox") }}</span>
                </BLink>
              </BCol>
              <BCol>
                <BLink class="dropdown-icon-item" href="javascript: void(0);">
                  <img src="@/assets/images/brands/mail_chimp.png" alt="mail_chimp" />
                  <span>{{ $t("navbar.dropdown.site.list.mailchimp") }}</span>
                </BLink>
              </BCol>
              <BCol>
                <BLink class="dropdown-icon-item" href="javascript: void(0);">
                  <img src="@/assets/images/brands/slack.png" alt="slack" />
                  <span>{{ $t("navbar.dropdown.site.list.slack") }}</span>
                </BLink>
              </BCol>
            </BRow>
          </div>
        </BDropdown>

        <div class="dropdown d-none d-lg-inline-block ms-1">
          <BButton variant="white" type="button" class="btn header-item noti-icon" @click="initFullScreen">
            <i class="bx bx-fullscreen"></i>
          </BButton>
        </div>

        <BDropdown menu-class="dropdown-menu-lg p-0 dropdown-menu-end" toggle-class="header-item noti-icon" variant="black">
          <template v-slot:button-content>
            <i class="bx bx-bell bx-tada"></i>
            <span class="badge bg-danger rounded-pill">{{
              $t("navbar.dropdown.notification.badge")
            }}</span>
          </template>

          <div class="p-3">
            <BRow class="align-items-center">
              <BCol>
                <h6 class="m-0">
                  {{ $t("navbar.dropdown.notification.text") }}
                </h6>
              </BCol>
              <div class="col-auto">
                <BLink href="#" class="small">{{
                  $t("navbar.dropdown.notification.subtext")
                }}</BLink>
              </div>
            </BRow>
          </div>
          <simplebar style="max-height: 230px">
            <BLink href="javascript: void(0);" class="text-reset notification-item">
              <div class="d-flex">
                <div class="avatar-xs me-3">
                  <span class="avatar-title bg-primary rounded-circle font-size-16">
                    <i class="bx bx-cart"></i>
                  </span>
                </div>
                <div class="flex-grow-1">
                  <h6 class="mt-0 mb-1">
                    {{ $t("navbar.dropdown.notification.order.title") }}
                  </h6>
                  <div class="font-size-12 text-muted">
                    <p class="mb-1">
                      {{ $t("navbar.dropdown.notification.order.text") }}
                    </p>
                    <p class="mb-0">
                      <i class="mdi mdi-clock-outline"></i>
                      {{ $t("navbar.dropdown.notification.order.time") }}
                    </p>
                  </div>
                </div>
              </div>
            </BLink>
            <BLink href="javascript: void(0);" class="text-reset notification-item">
              <div class="d-flex">
                <img src="@/assets/images/users/avatar-3.jpg" class="me-3 rounded-circle avatar-xs" alt="user-pic" />
                <div class="flex-grow-1">
                  <h6 class="mt-0 mb-1">
                    {{ $t("navbar.dropdown.notification.james.title") }}
                  </h6>
                  <div class="font-size-12 text-muted">
                    <p class="mb-1">
                      {{ $t("navbar.dropdown.notification.james.text") }}
                    </p>
                    <p class="mb-0">
                      <i class="mdi mdi-clock-outline"></i>
                      {{ $t("navbar.dropdown.notification.james.time") }}
                    </p>
                  </div>
                </div>
              </div>
            </BLink>
            <BLink href="javascript: void(0);" class="text-reset notification-item">
              <div class="d-flex">
                <div class="avatar-xs me-3">
                  <span class="avatar-title bg-success rounded-circle font-size-16">
                    <i class="bx bx-badge-check"></i>
                  </span>
                </div>
                <div class="flex-grow-1">
                  <h6 class="mt-0 mb-1">
                    {{ $t("navbar.dropdown.notification.item.title") }}
                  </h6>
                  <div class="font-size-12 text-muted">
                    <p class="mb-1">
                      {{ $t("navbar.dropdown.notification.item.text") }}
                    </p>
                    <p class="mb-0">
                      <i class="mdi mdi-clock-outline"></i>
                      {{ $t("navbar.dropdown.notification.item.time") }}
                    </p>
                  </div>
                </div>
              </div>
            </BLink>
            <BLink href="javascript: void(0);" class="text-reset notification-item">
              <div class="d-flex">
                <img src="@/assets/images/users/avatar-4.jpg" class="me-3 rounded-circle avatar-xs" alt="user-pic" />
                <div class="flex-grow-1">
                  <h6 class="mt-0 mb-1">
                    {{ $t("navbar.dropdown.notification.salena.title") }}
                  </h6>
                  <div class="font-size-12 text-muted">
                    <p class="mb-1">
                      {{ $t("navbar.dropdown.notification.salena.text") }}
                    </p>
                    <p class="mb-0">
                      <i class="mdi mdi-clock-outline"></i>
                      {{ $t("navbar.dropdown.notification.salena.time") }}
                    </p>
                  </div>
                </div>
              </div>
            </BLink>
          </simplebar>
          <div class="p-2 border-top d-grid">
            <BLink class="btn btn-sm btn-link font-size-14 text-center" href="javascript:void(0)">
              <i class="mdi mdi-arrow-right-circle me-1"></i>
              <span key="t-view-more">
                {{ $t("navbar.dropdown.notification.button") }}</span>
            </BLink>
          </div>
        </BDropdown>

        <BDropdown right variant="black" toggle-class="header-item">
          <template v-slot:button-content>
            <img class="rounded-circle header-profile-user" src="@/assets/images/users/avatar-1.jpg" alt="Header Avatar" />
            <span class="d-none d-xl-inline-block ms-1">{{
              $t("navbar.dropdown.henry.text")
            }}</span>
            <i class="mdi mdi-chevron-down d-none d-xl-inline-block"></i>
          </template>
          <BDropdownItem>
            <router-link to="/contacts/profile" v-slot="{ navigate }" custom>
              <span @click="navigate" @keypress.enter="navigate">
                <i class="bx bx-user font-size-16 align-middle me-1"></i>
                {{ $t("navbar.dropdown.henry.list.profile") }}
              </span>
            </router-link>
          </BDropdownItem>
          <BDropdownItem href="javascript: void(0);">
            <i class="bx bx-wallet font-size-16 align-middle me-1"></i>
            {{ $t("navbar.dropdown.henry.list.mywallet") }}
          </BDropdownItem>
          <BDropdownItem class="d-block" href="javascript: void(0);">
            <span class="badge bg-success float-end">11</span>
            <i class="bx bx-wrench font-size-16 align-middle me-1"></i>
            {{ $t("navbar.dropdown.henry.list.settings") }}
          </BDropdownItem>
          <BDropdownItem href="javascript: void(0);">
            <i class="bx bx-lock-open font-size-16 align-middle me-1"></i>
            {{ $t("navbar.dropdown.henry.list.lockscreen") }}
          </BDropdownItem>
          <BDropdownDivider></BDropdownDivider>
          <router-link to="/logout" class="dropdown-item text-danger">
            <i class="bx bx-power-off font-size-16 align-middle me-1 text-danger"></i>
            {{ $t("navbar.dropdown.henry.list.logout") }}
          </router-link>
        </BDropdown>

        <div class="dropdown d-inline-block">
          <BButton variant="white" type="button" class="btn header-item noti-icon right-bar-toggle toggle-right" @click="toggleRightSidebar">
            <i class="bx bx-cog bx-spin toggle-right"></i>
          </BButton>
        </div>
      </div>
    </div>
  </header>
</template>
