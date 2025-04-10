export default [
    {
      path: "/dashboard/charts",
      name: "charts",
      meta: { title: "charts", authRequired: true },
      component: () => import("../views/charts/sales/SalesChartPage.vue"),
    },
  ];