<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Cash from "../../components/cash-accounts/CashComponent.vue";
import Bank from "../../components/cash-accounts/BankComponent.vue"

export default {
    components: { Layout, PageHeader, Cash, Bank },
};
</script>
<template>
    <Layout>
        <PageHeader title="Cash Accounts" pageTitle="Utility" />
        <div>
            <b-tabs content-class="mt-3">
                <b-tab title="Cash" active>
                    <Cash />
                </b-tab>
                <b-tab title="Bank">
                    <Bank />
                </b-tab>
            </b-tabs>
        </div>
    </Layout>
</template>