export default [
    {
      path: "/dashboard/categories/:category_id/products",
      name: "products",
      meta: { title: "products", authRequired: true },
      component: () => import("../views/products/ProductsPage.vue"),
    },
    {
      path: "/dashboard/products/:id/product-logs",
      name: "product-logs",
      meta: { title: "Product Logs", authRequired: true },
      component: () => import("../views/products/ProductLogsPage.vue"),
    },
    {
      path: "/dashboard/charts/products/product-details/:id",
      name: "product-details",
      meta: { title: "Product Details", authRequired: true },
      component: () => import("../views/products/ProductDetailsPage.vue"),
    },
  ];