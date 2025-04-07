export default [
    {
      path: "/dashboard/categories/:category_id/products",
      name: "products",
      meta: { title: "products", authRequired: true },
      component: () => import("../views/products/ProductsPage.vue"),
    },
    {
      path: "/dashboard/categories/:category_id/products/:product_id",
      name: "single-product",
      meta: { title: "single-product", authRequired: true },
      component: () => import("../views/products/SingleProductPage.vue"),
    },
  ];