export default [
    {
        path: "/customers",
        name: "customers",
        meta: { title: "Customers", authRequired: true },
        component: () => import("../views/customers/CustomersPage.vue"),
      },
    {
      path: "/cutomers/categories",
      name: "customers-categories",
      meta: { title: "Customers Categories", authRequired: true },
      component: () => import("../views/customers/CustomerCategoriesPage.vue"),
    },
  ];