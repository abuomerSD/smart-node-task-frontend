export default [
  {
    path: "/dashboard/test",
    name: "test",
    meta: { title: "Test", authRequired: true },
    component: () => import("../views/test/testPage.vue"),
    children: [
      {
        path: "mini-page",
        name: "miniPage",
        meta: { title: "Test", authRequired: true },
        component: () => import("../views/test/miniPage/miniPage.vue"),
      },
    ],
  },
];