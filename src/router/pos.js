export default [
    {
      path: "/dashboard/pos",
      name: "Point Of Sale",
      meta: { title: "PointOfSale", authRequired: true },
      component: () => import("../views/pos/PointOfSalePage.vue"),
    },
  ];