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
            transactionDetails: null,
        }
    },
    methods: {
        async getTransactionDetailsById()
        {
            await this.http.get(`transactions/details/${this.transaction_id}`).then(res =>
            {
                this.transactionDetails = res.data
                console.log('data', res.data)
            })
        }
    },
    mounted()
    {
        this.transaction_id = this.$route.params.id;
        this.getTransactionDetailsById();
    }
};
</script>
<template>
    <Layout>
        <PageHeader title="Joural Details" pageTitle="Utility" />
        <h5>Transaction No #{{ transaction_id }}</h5>
        <div class="row">
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Account Name</th>
                            <th scope="col">Transaction Type</th>
                            <th scope="col">Description</th>
                            <th scope="col">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(transaction, index) in transactionDetails" :key="index">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ transaction.account_name }}</td>
                            <td>{{ transaction.type }}</td>
                            <td>{{ transaction.descr }}</td>
                            <td>{{ transaction.value }}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </Layout>
</template>