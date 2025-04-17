<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

/**
 * Starter component
 */
export default {
    components: { Layout, PageHeader },
    data()
    {
        return {
            transaction_id: 0,
        }
    },
    methods: {
        async getTransactionById()
        {

        }
    },
    mounted()
    {
        this.transaction_id = this.$route.params.id;
    }
};
</script>
<template>
    <Layout>
        <PageHeader title="Joural Details" pageTitle="Utility" />
        <h5>Transaction No #{{ transaction_id }}</h5>
    </Layout>
</template>