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
            transactions: [],
            balance: 0,
            id: this.$route.params.id,
            customer: { name: null },
        }
    },
    methods: {
        async getTransactions()
        {
            await this.http.get(`customers/statement/${this.id}/`).then(res =>
            {
                this.transactions = res.data
                this.balance = res.balance
            })
        },
        async getCutomer()
        {
            await this.http.get(`customers/${this.id}/`).then(res =>
            {
                this.customer = res.data
            })
        }
    },
    async mounted()
    {
        await this.getTransactions()
        await this.getCutomer()
    }
};
</script>
<template>
    <Layout>
        <PageHeader title="Customer Statement" pageTitle="Utility" />
        <h5>Cutomer Name: {{ customer.name }}</h5>
        <hr />
        <table class="table">
            <thead>
                <tr>
                    <th scope="row">#</th>
                    <!-- <th scope="row">Customer Category</th> -->
                    <th scope="row">Transaction Date</th>
                    <th scope="row">Transaction id</th>
                    <th scope="row">Debit</th>
                    <th scope="row">Credit</th>
                    <th scope="row">Account Name</th>
                    <th scope="row">Description</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(transaction, index) in transactions" :key="index">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ new Date(transaction.created).toLocaleDateString() }}</td>
                    <td>{{ transaction.id }}</td>
                    <td>{{ transaction.type === 'debit' ? transaction.value : 0 }}</td>
                    <td>{{ transaction.type === 'credit' ? transaction.value : 0 }}</td>
                    <td>{{ transaction.subledger_subaccount.name_en }}</td>
                    <td>{{ transaction.descr_en }}</td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td></td>
                    <td><strong>Balance</strong></td>
                    <td><strong>{{ balance }}</strong></td>
                </tr>
            </tfoot>
        </table>
    </Layout>
</template>