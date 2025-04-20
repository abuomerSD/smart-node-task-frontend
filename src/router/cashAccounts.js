export default [
    {
        path: "/cash-accounts",
        name: "cash-accounts",
        meta: { title: "Cash Accounts", authRequired: true },
        component: () => import("../views/cash-accounts/CashAccountsPage.vue"),
      },
  ];