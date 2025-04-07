<script>
import { useAuthStore } from '@/state/pinia.js';

export default {
    data() {
        return {
            transactions: [],
            imgUrl: '',
            page: 1,
            limit:10,
            total_pages: 0,
        }
    },
    methods: {
        async getTransactions() {
            await this.http.get('sales-order').then((res) => {
                this.transactions = res.data;
                this.total_pages = res.tot;
            });
        }
    },
    async mounted() {
        await this.getTransactions();
        console.log('this.total_pages', this.total_pages)
        this.imgUrl = useAuthStore().mediaUrl;
    },
    
}
</script>

<template>
    <div class="div">
        <h4>Transactions</h4>
        <div class="table-responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Id</th>
                        <th scope="col">Date Created</th>
                        <th scope="col">Date Updated</th>
                        <th scope="col">Recipet Image / Number</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(transaction, index) in transactions" :key="index">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ transaction.id }}</td>
                        <td>{{ transaction.created }}</td>
                        <td>{{ transaction.updated }}</td>
                        <td v-if="transaction.recipet_img"><img :src="imgUrl +  transaction.recipet_img" alt="image" class="transaction-image"></td>
                        <td v-if="transaction.recipet_number != 'null'">{{ transaction.recipet_number }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="overflow-auto">
                <b-pagination
                v-if="total_pages > 1"
                v-model="page"
                :total-rows="total_pages"
                :per-page="limit"
                aria-controls="my-table"
                ></b-pagination>
            </div>
        </div>
        
    </div>
</template>

<style>
    .transaction-image{
        width: 150px;
        height: 100px;
    }
</style>