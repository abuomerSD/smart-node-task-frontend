export default [
    {
      path: "/dashboard/pos",
      name: "PointOfSale",
      meta: { title: "PointOfSale", authRequired: true },
      component: () => import("../views/pos/PointOfSalePage.vue"),
    },
    // {
    //   path: "/dashboard/pos/cart",
    //   name: "Cart",
    //   meta: { title: "Cart", authRequired: true },
    //   component: () => import("../components/pos/CartComponent.vue"),
    // },
    // {
    //   path: "/dashboard/pos/transactions",
    //   name: "Transactions",
    //   meta: { title: "Transactions", authRequired: true },
    //   component: () => import("../components/pos/TransactionComponent.vue"),
    // },
  ];