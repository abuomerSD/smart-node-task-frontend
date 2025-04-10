<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
export default {
    components: { Layout, PageHeader },
    data()
    {
        return {
            product: {},
            product_id: this.$route.params.id,
            logs: [],
            imgUrl: '',
            page: 1,
            rows: 0,
            limit: 5,
            total_pages: 0,
        }
    },
    methods: {
        async PaginateProductLogs()
        {
            await this.http.get(`product-logs/${this.product_id} `, { limit: this.limit, page: this.page }).then((res) =>
            {
                this.logs = res.data;
                this.rows = res.tot;
                this.total_pages = Math.ceil(this.rows / this.limit);
            });
        },
        async getProduct() {
            await this.http.get(`products/${this.product_id}`).then((res) =>
            {
                this.product = res.data
            });
        }
    },
    async mounted()
    {
        await this.getProduct();
        await this.PaginateProductLogs();
    },
    watch: {
        page: function () {
            this.PaginateProductLogs();
        },
    }
}
</script>

<template>
    <Layout>
        <PageHeader title="Product logs" pageTitle="Utility" />
        <h2>{{ product.name }} Logs</h2>
        <div class="table_responsive">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">Id</th>
                        <th scope="col">Column Updated</th>
                        <th scope="col">Old Value</th>
                        <th scope="col">New Value</th>
                        <th scope="col">Created</th>
                        <th scope="col">Updated</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(log, index) in logs" :key="index">
                        <th scope="row">{{ log.id }}</th>
                        <td>{{ log.col }}</td>
                        <td>{{ log.old_val }}</td>
                        <td>{{ log.new_val }}</td>
                        <td>{{ new Date(log.created).toLocaleDateString() }}</td>
                        <td>{{ new Date(log.updated).toLocaleDateString() }}</td>
                    </tr>
                </tbody>
            </table>
            <div class="pagination" v-if="total_pages > 1">
                <b-pagination v-model="page" :total-rows="rows" :per-page="limit"
                    aria-controls="my-table"></b-pagination>
            </div>
        </div>
    </Layout>
</template>
