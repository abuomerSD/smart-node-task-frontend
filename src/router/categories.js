export default [
    {
      path: "/dashboard/categories",
      name: "categories",
      meta: { title: "categories", authRequired: true },
      component: () => import("../views/categories/CategoriesPage.vue"),
    },
  ];