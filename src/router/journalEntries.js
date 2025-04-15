export default [
    {
      path: "/dashboard/journal-entries",
      name: "journal-entries",
      meta: { title: "Journal Entries", authRequired: true },
      component: () => import("../views/journal-entries/JournalEntriesPage.vue"),
    },
    {
      path: "/dashboard/journal-entries/add-manual-journal",
      name: "add-manual-journal",
      meta: { title: "Add Manual Journal", authRequired: true },
      component: () => import("../views/journal-entries/AddManualJournalPage.vue"),
    },
  ];