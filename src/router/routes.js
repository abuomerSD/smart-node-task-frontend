import { useAuthStore, useAuthFakeStore } from "@/state/pinia";
import test from "./test.js";
import categories from "./categories.js";
import products from './products.js';
import pos from './pos.js';
import charts from './charts.js';
import journalEntries from "./journalEntries.js";

export default [
  {
    path: "/",
    name: "default",
    meta: { title: "Dashboard", authRequired: true },
    component: () => import("../views/dashboards/default"),
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../views/account/login"),
    meta: {
      title: "Login",
      beforeResolve(routeTo, routeFrom, next) {
        const auth = useAuthStore();
        // If the user is already logged in
        // if (store.getters["auth/loggedIn"]) {
        if (auth.loggedIn) {
          // Redirect to the home page instead
          next({ name: "default" });
        } else {
          // Continue to the login page
          next();
        }
      },
    },
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/account/register"),
    meta: {
      title: "Register",
      beforeResolve(routeTo, routeFrom, next) {
        const auth = useAuthStore();
        // If the user is already logged in
        // if (store.getters["auth/loggedIn"]) {
        if (auth.loggedIn) {
          // Redirect to the home page instead
          next({ name: "default" });
        } else {
          // Continue to the login page
          next();
        }
      },
    },
  },
  {
    path: "/forgot-password",
    name: "Forgot password",
    component: () => import("../views/account/forgot-password"),
    meta: {
      title: "Forgot password",
      beforeResolve(routeTo, routeFrom, next) {
        const auth = useAuthStore();
        // If the user is already logged in
        // if (store.getters["auth/loggedIn"]) {
        if (auth.loggedIn) {
          // Redirect to the home page instead
          next({ name: "default" });
        } else {
          // Continue to the login page
          next();
        }
      },
    },
  },
  {
    path: "/logout",
    name: "logout",
    component: () => import("../views/account/logout"),
    meta: {
      title: "Logout",
      authRequired: true,
      beforeResolve(routeTo, routeFrom, next) {
        const auth = useAuthStore();
        const authFake = useAuthFakeStore();

        if (process.env.VUE_APP_DEFAULT_AUTH === "firebase") {
          auth.logOut();
        } else {
          authFake.logout();
        }
        const authRequiredOnPreviousRoute = routeFrom.matched.some((route) => route.push("/login"));
        // Navigate back to previous page, or home as a fallback
        next(authRequiredOnPreviousRoute ? { name: "default" } : { ...routeFrom });
      },
    },
  },
  {
    path: "/404",
    name: "404",
    meta: { title: "404 Error Page" },
    component: require("../views/utility/404").default,
  },
  // Redirect any unmatched routes to the 404 page. This may
  // require some server configuration to work in production:
  // https://router.vuejs.org/en/essentials/history-mode.html#example-server-configurations
  // {
  //   path: "*",
  //   redirect: "404",
  // },
  {
    path: "/dashboard/saas",
    name: "saas-dashboard",
    meta: { title: "Saas Dashboard", authRequired: true },
    component: () => import("../views/dashboards/saas/index"),
  },

  ...test,
  ...categories,
  ...products,
  ...pos,
  ...charts,
  ...journalEntries,
  {
    path: "/dashboard/crypto",
    name: "crypto-dashboard",
    meta: { title: "Crypto Dashboard", authRequired: true },
    component: () => import("../views/dashboards/crypto/index"),
  },
  {
    path: "/dashboard/blog",
    name: "blog-dashboard",
    meta: { title: "Blog Dashboard", authRequired: true },
    component: () => import("../views/dashboards/blog/index"),
  },
  {
    path: "/dashboard/jobs",
    name: "jobs-dashboard",
    meta: { title: "Jobs Dashboard", authRequired: true },
    component: () => import("../views/dashboards/jobs/index"),
  },
  {
    path: "/calendar",
    name: "Calendar",
    meta: { title: "Calendar", authRequired: true },
    component: () => import("../views/calendar/calendar"),
  },
  {
    path: "/chat",
    name: "chat",
    meta: { title: "Chat", authRequired: true },
    component: () => import("../views/chat/index"),
  },
  {
    path: "/apps/file-manager",
    name: "file-manager",
    meta: { title: "File Manager", authRequired: true },
    component: () => import("../views/file-manager/index"),
  },
  {
    path: "/ecommerce/products",
    name: "Products",
    meta: { title: "Products", authRequired: true },
    component: () => import("../views/ecommerce/products"),
  },
  {
    path: "/ecommerce/product-detail/:id",
    name: "Product Detail",
    meta: { title: "Product Detail", authRequired: true },
    component: () => import("../views/ecommerce/product-detail"),
  },
  {
    path: "/ecommerce/orders",
    name: "Orders",
    meta: { title: "Orders", authRequired: true },
    component: () => import("../views/ecommerce/orders"),
  },
  {
    path: "/ecommerce/customers",
    name: "Customers",
    meta: { title: "Customers", authRequired: true },
    component: () => import("../views/ecommerce/customers"),
  },
  {
    path: "/ecommerce/cart",
    name: "Cart",
    meta: { title: "Cart", authRequired: true },
    component: () => import("../views/ecommerce/cart"),
  },
  {
    path: "/ecommerce/checkout",
    name: "Checkout",
    meta: { title: "Checkout", authRequired: true },
    component: () => import("../views/ecommerce/checkout"),
  },
  {
    path: "/ecommerce/shops",
    name: "Shops",
    meta: { title: "Shops", authRequired: true },
    component: () => import("../views/ecommerce/shops"),
  },
  {
    path: "/ecommerce/add-product",
    name: "Add Product",
    meta: { title: "Add Product", authRequired: true },
    component: () => import("../views/ecommerce/add-product"),
  },
  {
    path: "/blog/list",
    name: "blog-list",
    meta: { title: "Blog List", authRequired: true },
    component: () => import("../views/blog/list"),
  },
  {
    path: "/blog/grid",
    name: "blog-grid",
    meta: { title: "Blog Grid", ired: true },
    component: () => import("../views/blog/grid"),
  },
  {
    path: "/blog/detail",
    name: "blog-detail",
    meta: { title: "BLog Detail", authRequired: true },
    component: () => import("../views/blog/detail"),
  },
  {
    path: "/jobs/candidate/list",
    name: "candidate-list",
    meta: { title: "Candidate List", authRequired: true },
    component: () => import("../views/jobs/candidate/list"),
  },
  {
    path: "/jobs/candidate/overview",
    name: "candidate-overview",
    meta: { title: "Candidate Overview", authRequired: true },
    component: () => import("../views/jobs/candidate/overview"),
  },
  {
    path: "/jobs/job-categories",
    name: "job-categories",
    meta: { title: "Job Categories", authRequired: true },
    component: () => import("../views/jobs/job-categories"),
  },
  {
    path: "/jobs/job-details",
    name: "job-details",
    meta: { title: "Job Details", authRequired: true },
    component: () => import("../views/jobs/job-details"),
  },
  {
    path: "/jobs/job-apply",
    name: "job-apply",
    meta: { title: "Job Apply", authRequired: true },
    component: () => import("../views/jobs/job-apply"),
  },
  {
    path: "/jobs/job-grid",
    name: "job-grid",
    meta: { title: "Job Grid", authRequired: true },
    component: () => import("../views/jobs/job-grid"),
  },
  {
    path: "/jobs/job-list",
    name: "job-list",
    meta: { title: "Job List", authRequired: true },
    component: () => import("../views/jobs/job-list"),
  },
  {
    path: "/crypto/wallet",
    name: "Wallet",
    meta: { title: "Wallet", authRequired: true },
    component: () => import("../views/crypto/wallet/index"),
  },
  {
    path: "/crypto/buy-sell",
    name: "Buy/sell",
    meta: { title: "Buy/Sell", authRequired: true },
    component: () => import("../views/crypto/buysell/index"),
  },
  {
    path: "/crypto/exchange",
    name: "Exchange",
    meta: { title: "Exchange", authRequired: true },
    component: () => import("../views/crypto/exchange/index"),
  },
  {
    path: "/crypto/lending",
    name: "Lending",
    meta: { title: "Lending", authRequired: true },
    component: () => import("../views/crypto/lending/index"),
  },
  {
    path: "/crypto/orders",
    name: "crypto-orders",
    meta: { title: "Orders", authRequired: true },
    component: () => import("../views/crypto/orders/index"),
  },
  {
    path: "/crypto/kyc-application",
    name: "kyc-application",
    meta: { title: "KYC Application", authRequired: true },
    component: () => import("../views/crypto/kycapplication/index"),
  },
  {
    path: "/crypto/ico-landing",
    name: "Ico-landing",
    meta: { title: "ICO Landing", authRequired: true },
    component: () => import("../views/crypto/ico-landing"),
  },
  {
    path: "/invoices/detail",
    name: "Invoice Detail",
    meta: { title: "Invoice Detail", authRequired: true },
    component: () => import("../views/invoices/detail"),
  },
  {
    path: "/invoices/list",
    name: "Invoice List",
    meta: { title: "Invoice List", authRequired: true },
    component: () => import("../views/invoices/list"),
  },
  {
    path: "/ui/alerts",
    name: "Alerts",
    meta: { title: "Alerts", authRequired: true },
    component: () => import("../views/ui/alerts"),
  },
  {
    path: "/ui/buttons",
    name: "Buttons",
    meta: { title: "Buttons", authRequired: true },
    component: () => import("../views/ui/buttons"),
  },
  {
    path: "/ui/cards",
    name: "Cards",
    meta: { title: "Cards", authRequired: true },
    component: () => import("../views/ui/cards"),
  },
  {
    path: "/ui/carousel",
    name: "Carousel",
    meta: { title: "Carousel", authRequired: true },
    component: () => import("../views/ui/carousel"),
  },
  {
    path: "/ui/dropdowns",
    name: "Dropdowns",
    meta: { title: "Dropdowns", authRequired: true },
    component: () => import("../views/ui/dropdowns"),
  },
  {
    path: "/ui/grid",
    name: "Grid",
    meta: { title: "Grid", authRequired: true },
    component: () => import("../views/ui/grid"),
  },
  {
    path: "/ui/images",
    name: "Images",
    meta: { title: "Images", authRequired: true },
    component: () => import("../views/ui/images"),
  },
  {
    path: "/ui/modals",
    name: "Modals",
    meta: { title: "Modals", authRequired: true },
    component: () => import("../views/ui/modals"),
  },
  {
    path: "/ui/offcanvas",
    name: "offcanvas",
    meta: { title: "offcanvas", authRequired: true },
    component: () => import("../views/ui/offcanvas"),
  },
  {
    path: "/ui/rangeslider",
    name: "Rangeslider",
    meta: { title: "Range Slider", authRequired: true },
    component: () => import("../views/ui/rangeslider"),
  },
  {
    path: "/ui/progressbars",
    name: "Progressbars",
    meta: { title: "Progress Bars", authRequired: true },
    component: () => import("../views/ui/progressbars"),
  },
  {
    path: "/ui/placeholder",
    name: "Placeholder",
    meta: { title: "Placeholder", authRequired: true },
    component: () => import("../views/ui/placeholder"),
  },
  {
    path: "/ui/sweet-alert",
    name: "Sweet-alert",
    meta: { title: "SweetAlert 2", authRequired: true },
    component: () => import("../views/ui/sweet-alert"),
  },
  {
    path: "/ui/tabs-accordions",
    name: "Tabs-accordions",
    meta: { title: "Tabs & Accordions", authRequired: true },
    component: () => import("../views/ui/tabs-accordions"),
  },
  {
    path: "/ui/typography",
    name: "Typography",
    meta: { title: "Typography", authRequired: true },
    component: () => import("../views/ui/typography"),
  },
  {
    path: "/ui/video",
    name: "Video",
    meta: { title: "Video", authRequired: true },
    component: () => import("../views/ui/video"),
  },
  {
    path: "/ui/general",
    name: "General",
    meta: { title: "General UI", authRequired: true },
    component: () => import("../views/ui/general"),
  },
  {
    path: "/ui/colors",
    name: "Colors",
    meta: { title: "Colors", authRequired: true },
    component: () => import("../views/ui/colors"),
  },
  {
    path: "/ui/lightbox",
    name: "Lightbox",
    meta: { title: "Lightbox", authRequired: true },
    component: () => import("../views/ui/lightbox"),
  },
  {
    path: "/ui/image-cropper",
    name: "Image Cropper",
    meta: { title: "Image Cropper", authRequired: true },
    component: () => import("../views/ui/cropper"),
  },
  {
    path: "/ui/utilities",
    name: "Utilities",
    meta: { title: "Utilities", authRequired: true },
    component: () => import("../views/ui/utilities"),
  },
  {
    path: "/projects/grid",
    name: "Projects Grid",
    meta: { title: "Project Grid", authRequired: true },
    component: () => import("../views/projects/projects-grid"),
  },
  {
    path: "/projects/list",
    name: "Projects List",
    meta: { title: "Project List", authRequired: true },
    component: () => import("../views/projects/projects-list"),
  },
  {
    path: "/projects/overview",
    name: "Project Overview",
    meta: { title: "Project Overview", authRequired: true },
    component: () => import("../views/projects/overview"),
  },
  {
    path: "/projects/create",
    name: "Create New",
    meta: { title: "Create New", authRequired: true },
    component: () => import("../views/projects/create"),
  },
  {
    path: "/contacts/grid",
    name: "User Grid",
    meta: { title: "Users Grid", authRequired: true },
    component: () => import("../views/contacts/contacts-grid"),
  },
  {
    path: "/contacts/list",
    name: "User List",
    meta: { title: "Contact Users List", authRequired: true },
    component: () => import("../views/contacts/contacts-list"),
  },
  {
    path: "/contacts/profile",
    name: "Profile",
    meta: { title: "Profile", authRequired: true },
    component: () => import("../views/contacts/contacts-profile"),
  },
  {
    path: "/charts/apex",
    name: "Apex chart",
    meta: { title: "Apex Charts", authRequired: true },
    component: () => import("../views/charts/apex"),
  },
  {
    path: "/charts/chartjs",
    name: "Chartjs chart",
    meta: { title: "Chartjs Charts", authRequired: true },
    component: () => import("../views/charts/chartjs/index"),
  },
  {
    path: "/charts/chartist",
    name: "Chartist chart",
    meta: { title: "Chartist Charts", authRequired: true },
    component: () => import("../views/charts/chartist"),
  },
  {
    path: "/charts/echart",
    name: "Echart chart",
    meta: { title: "E Charts", authRequired: true },
    component: () => import("../views/charts/echart/index"),
  },
  {
    path: "/icons/boxicons",
    name: "Boxicons Icon",
    meta: { title: "Boxicons", authRequired: true },
    component: () => import("../views/icons/boxicons"),
  },
  {
    path: "/icons/materialdesign",
    name: "Materialdesign Icon",
    meta: { title: "Material Design Icons", authRequired: true },
    component: () => import("../views/icons/materialdesign"),
  },
  {
    path: "/icons/dripicons",
    name: "Dripicons Icon",
    meta: { title: "Dripicons", authRequired: true },
    component: () => import("../views/icons/dripicons"),
  },
  {
    path: "/icons/fontawesome",
    name: "Fontawesome Icon",
    meta: { title: "Font Awesome", authRequired: true },
    component: () => import("../views/icons/fontawesome"),
  },
  {
    path: "/maps/google",
    name: "Google Maps",
    meta: { title: "Google Maps", authRequired: true },
    component: () => import("../views/maps/google"),
  },
  {
    path: "/maps/amcharts",
    name: "Amcharts Maps",
    meta: { title: "Amcharts Maps", authRequired: true },
    component: () => import("../views/maps/amcharts/index"),
  },
  {
    path: "/tables/basic",
    name: "Basic Tables",
    meta: { title: "Basic Tables", authRequired: true },
    component: () => import("../views/tables/basictable"),
  },
  {
    path: "/form/advanced",
    name: "Form Advanced",
    meta: { title: "Form Advanced", authRequired: true },
    component: () => import("../views/forms/advanced"),
  },
  {
    path: "/form/elements",
    name: "Form Elements",
    meta: { title: "Form Elements", authRequired: true },
    component: () => import("../views/forms/elements"),
  },
  {
    path: "/form/layouts",
    name: "Form Layouts",
    meta: { title: "Form Layouts", authRequired: true },
    component: () => import("../views/forms/layouts"),
  },
  {
    path: "/form/editor",
    name: "Form Editors",
    meta: { title: "Form Editors", authRequired: true },
    component: () => import("../views/forms/editors"),
  },
  {
    path: "/form/uploads",
    name: "File Uploads",
    meta: { title: "Form File Uploads", authRequired: true },
    component: () => import("../views/forms/uploads"),
  },
  {
    path: "/form/validation",
    name: "Form Validation",
    meta: { title: "Form Validation", authRequired: true },
    component: () => import("../views/forms/validation"),
  },
  {
    path: "/form/wizard",
    name: "Form Wizard",
    meta: { title: "Form Wizard", authRequired: true },
    component: () => import("../views/forms/wizard"),
  },
  {
    path: "/form/repeater",
    name: "Form Repeater",
    meta: { title: "Form Repeater", authRequired: true },
    component: () => import("../views/forms/repeater"),
  },
  {
    path: "/form/mask",
    name: "Form Mask",
    meta: { title: "Form Mask", authRequired: true },
    component: () => import("../views/forms/mask"),
  },
  {
    path: "/pages/starter",
    name: "Starter",
    meta: { title: "Starter Page", authRequired: true },
    component: () => import("../views/utility/starter.vue"),
  },
  {
    path: "/pages/maintenance",
    name: "Maintenance",
    meta: { title: "Maintenance Page", authRequired: true },
    component: () => import("../views/utility/maintenance"),
  },
  {
    path: "/pages/coming-soon",
    name: "coming-soon",
    meta: { title: "Coming Soon", authRequired: true },
    component: () => import("../views/utility/coming-soon"),
  },
  {
    path: "/pages/timeline",
    name: "Timeline",
    meta: { title: "Timeline", authRequired: true },
    component: () => import("../views/utility/timeline"),
  },
  {
    path: "/pages/faqs",
    name: "FAQs",
    meta: { title: "FAQs", authRequired: true },
    component: () => import("../views/utility/faqs"),
  },
  {
    path: "/pages/pricing",
    name: "Pricing",
    meta: { title: "Pricing", authRequired: true },
    component: () => import("../views/utility/pricing"),
  },
  {
    path: "/pages/404",
    name: "Error-404",
    meta: { title: "404 Error Page", authRequired: true },
    component: () => import("../views/utility/404"),
  },
  {
    path: "/pages/500",
    name: "Error-500",
    meta: { title: "500 Error Page", authRequired: true },
    component: () => import("../views/utility/500"),
  },
  {
    path: "/email/inbox",
    name: "Inbox",
    meta: { title: "Inbox", authRequired: true },
    component: () => import("../views/email/inbox"),
  },
  {
    path: "/email/reademail/:id",
    name: "Read Email",
    meta: { title: "Read Email", authRequired: true },
    component: () => import("../views/email/reademail"),
  },
  {
    path: "/email/templates/basic",
    name: "Email template basic",
    meta: { title: "Email Action Basic", authRequired: true },
    component: () => import("../views/email/templates/basic"),
  },
  {
    path: "/email/templates/billing",
    name: "Email template billing",
    meta: { title: "Billing Email Template", authRequired: true },
    component: () => import("../views/email/templates/billing"),
  },
  {
    path: "/email/templates/alert",
    name: "Email template alert",
    meta: { title: "Alert Email Template", authRequired: true },
    component: () => import("../views/email/templates/alert"),
  },
  {
    path: "/tasks/list",
    name: "Task list",
    meta: { title: "Task list", authRequired: true },
    component: () => import("../views/tasks/task-list"),
  },
  {
    path: "/tasks/kanban",
    name: "Kanbanboard",
    meta: { title: "Kanban Board", authRequired: true },
    component: () => import("../views/tasks/kanbanboard"),
  },
  {
    path: "/tasks/create",
    name: "Create Task",
    meta: { title: "Create Task", authRequired: true },
    component: () => import("../views/tasks/task-create"),
  },
  {
    path: "/auth/login-1",
    name: "Login sample",
    meta: { title: "Login", authRequired: true },
    component: () => import("../views/sample-pages/login-sample"),
  },
  {
    path: "/auth/login-2",
    name: "Login-2-sample",
    meta: { title: "Login 2", authRequired: true },
    component: () => import("../views/sample-pages/login-2"),
  },
  {
    path: "/auth/register-1",
    name: "Register sample",
    meta: { title: "Register", authRequired: true },
    component: () => import("../views/sample-pages/register-sample"),
  },
  {
    path: "/auth/register-2",
    name: "Register-2",
    meta: { title: "Register 2", authRequired: true },
    component: () => import("../views/sample-pages/register-2"),
  },
  {
    path: "/auth/recoverpwd",
    name: "Recover pwd",
    meta: { title: "Recover Password", authRequired: true },
    component: () => import("../views/sample-pages/recoverpw-sample"),
  },
  {
    path: "/auth/recoverpwd-2",
    name: "Recover pwd-2",
    meta: { title: "Recover Password 2", authRequired: true },
    component: () => import("../views/sample-pages/recoverpwd-2"),
  },
  {
    path: "/auth/lock-screen",
    name: "Lock screen",
    meta: { title: "Lock Screen", authRequired: true },
    component: () => import("../views/sample-pages/lockscreen"),
  },
  {
    path: "/auth/lock-screen-2",
    name: "Lock screen-2",
    meta: { title: "Lock Screen 2", authRequired: true },
    component: () => import("../views/sample-pages/lockscreen-2"),
  },
  {
    path: "/auth/confirm-mail",
    name: "confirm-mail",
    meta: { title: "Confirm Email", authRequired: true },
    component: () => import("../views/sample-pages/confirm-mail"),
  },
  {
    path: "/auth/confirm-mail-2",
    name: "confirm-mail-2",
    meta: { title: "Confirm Email 2", authRequired: true },
    component: () => import("../views/sample-pages/confirm-mail-2"),
  },
  {
    path: "/auth/email-verification",
    name: "email-verification",
    meta: { title: "Email Verification", authRequired: true },
    component: () => import("../views/sample-pages/email-verification"),
  },
  {
    path: "/auth/email-verification-2",
    name: "email-verification-2",
    meta: { title: "Email Verification 2", authRequired: true },
    component: () => import("../views/sample-pages/email-verification-2"),
  },
  {
    path: "/auth/two-step-verification",
    name: "two-step-verification",
    meta: { title: "Two Step Verification", authRequired: true },
    component: () => import("../views/sample-pages/two-step-verification"),
  },
  {
    path: "/auth/two-step-verification-2",
    name: "two-step-verification-2",
    meta: { title: "Two Step Verification 2", authRequired: true },
    component: () => import("../views/sample-pages/two-step-verification-2"),
  },
];
