<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { useAuthStore } from '@/state/pinia.js';

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
            totalDebit: 0,
            totalCredit: 0,
            documents: [],
            staticsUrl: '',
        }
    },
    methods: {
        async getTransactionDetailsById()
        {
            await this.http.get(`transactions/details/${this.transaction_id}`).then(res =>
            {
                this.transactionDetails = res.data.details
                this.documents = res.data.documents
                console.log('docs', this.documents)
                console.log('res data', res.data)
            })
        },
        calculateTotals()
        {
            this.transactionDetails.forEach(detail =>
            {
                if (detail.type === 'debit')
                {
                    this.totalDebit += Number(detail.value)
                }
                if (detail.type === 'credit')
                {
                    this.totalCredit += Number(detail.value)
                }
            })
        }
    },
    async mounted()
    {
        this.transaction_id = this.$route.params.id;
        await this.getTransactionDetailsById();
        this.calculateTotals();
        this.staticsUrl = useAuthStore().mediaUrl;
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
                            <th scope="col">Date</th>
                            <th scope="col">Account No</th>
                            <th scope="col">Account Name</th>
                            <th scope="col">Description</th>
                            <th scope="col">Debit</th>
                            <th scope="col">Credit</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(transaction, index) in transactionDetails" :key="index">
                            <th scope="row">{{ index + 1 }}</th>
                            <td>{{ new Date(transaction.created).toLocaleDateString() }}</td>
                            <td>{{ transaction.account_id }}</td>
                            <td>{{ transaction.account_name }}</td>
                            <td>{{ transaction.descr_en }}</td>
                            <td>{{ transaction.type === 'debit' ? transaction.value : 0 }}</td>
                            <td>{{ transaction.type === 'credit' ? transaction.value : 0 }}</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td><strong>{{ totalDebit }}</strong></td>
                            <td><strong>{{ totalCredit }}</strong></td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
        <div class="row">
            <strong>Documents:</strong>
        </div>
        <div class="row">
            <div class="col-lg-6">
                <div class="table-responsive">
                    <div class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <!-- <th scope="col">File</th> -->
                                <th scope="col">Download</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(document, index) in documents" :key="index">
                                <th scope="row">{{ index + 1 }}</th>
                                <td>{{ document.name }}</td>
                                <!-- <td>{{ document.file }}</td> -->
                                <td><a class="btn btn-success" :href="`${staticsUrl}${document.file}`"
                                        :download="document.file">Download</a></td>
                            </tr>
                        </tbody>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
</template>