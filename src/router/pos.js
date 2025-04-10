export default [
    {
      path: "/dashboard/pos",
      name: "point-of-sale",
      meta: { title: "Point Of Sale", authRequired: true },
      component: () => import("../views/pos/PointOfSalePage.vue"),
    },
  ];