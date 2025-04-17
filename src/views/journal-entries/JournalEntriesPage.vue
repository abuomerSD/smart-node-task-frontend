<script>
import Layout from "@/layouts/main";
import PageHeader from "@/components/page-header";

export default {
    components: { Layout, PageHeader },
    data()
    {
        return {
            transactions: [],
            page: 1,
            limit: 10,
            total_pages: 0,
            searchModel: '',
        }
    },
    methods: {
        async paginate()
        {
            await this.http.get('transactions/paginate', { limit: this.limit, page: this.page }).then(res =>
            {
                console.log('res', res.data)
                // this.total_pages = Math.ceil(res.tot / this.limit)
                this.total_pages = res.tot
                console.log('total pages', this.total_pages)
                this.transactions = res.data
            })
        },
        async search()
        {

            if (!this.searchModel.length)        
            {
                this.page = 1
                this.paginate(this.page)
                return
            }

            await this.http.post('transactions/search/', { search: this.searchModel, limit: this.limit, page: this.page }).then(res =>
            {
                console.log('res data', res.data)
                this.total_pages = res.tot
                console.log('total pages', this.total_pages)
                this.transactions = res.data
            })
        }
    },
    mounted()
    {
        this.paginate();
    },
    watch: {
        page: function ()
        {
            if (this.searchModel.length === 0)
            {
                this.paginate()
            } else
            {
                this.search()
            }
        }
    }
}
</script>
<template>
    <Layout>
        <PageHeader title="Journal Entries" pageTitle="Utility" />
        <div class="row m-2">
            <div class="col-lg-2"><input type="text" class="form-control" placeholder="Search By Id"
                    v-model="searchModel" @input="search"></div>
            <div class="col-lg-9"></div>
            <div class="col-lg-1"><router-link :to="{ name: 'add-manual-journal' }"><i
                        class="bx bx-plus-medical bx-sm"></i></router-link></div>
        </div>
        <div class="row m-2">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Date</th>
                        <th scope="col">Transaction ID</th>
                        <th scope="col">Description</th>
                        <th scope="col">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(transaction, index) in transactions" :key="index">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ new Date(transaction.created).toLocaleDateString() }}</td>
                        <td>{{ transaction.id }}</td>
                        <td>{{ transaction.descr_en }}</td>
                        <td>{{ transaction.amount }}</td>
                    </tr>
                </tbody>
            </table>
            <BPagination v-model="page" :per-page="limit" :total-rows="total_pages"></BPagination>
        </div>
    </Layout>
</template>