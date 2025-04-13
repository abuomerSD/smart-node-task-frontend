<script>
import { useAuthStore } from "@/state/pinia.js";
import Layout from "@/layouts/main";
import PageHeader from "@/components/page-header";

export default {
    components: { Layout, PageHeader },
    data()
    {
        return {
            product: {},
            productId: this.$route.params.id,
            imgUrl: '',
            weekChartOptions: {},
            weekChartSeries: [],
            monthChartOptions: {},
            monthChartSeries: [],
        }
    },
    methods: {
        async getProductData()
        {
            await this.http.get(`products/${this.productId}`).then((res) =>
            {
                this.product = res.data;
                console.log('Product Data:', this.product);
            }).catch((error) =>
            {
                console.error('Error fetching product data:', error);
            });
        },
        async setWeekSalesChartData()
        {
            const data = await this.http.get(`sales-order/sales-of-last-week-by-productid/${this.productId}`).then(response =>
            {
                return response.data.series;
            });

            this.weekChartOptions = {
                chart: {
                    id: 'week-sales-chart'
                },
                xaxis: {
                    categories: data.map(item =>
                    {
                        return item.x
                    })
                },
                title: {
                    text: 'Saled Quantities Of Last Week',
                    align: 'left'
                },
            }
            this.weekChartSeries = [{
                name: 'Sales Of Last Week',
                data: data.map(item =>
                {
                    return item.y ? parseFloat(item.y) : 0;
                })
            }]

        },
        async setMonthSalesChartData()
        {
            const data = await this.http.get(`sales-order/sales-of-last-month-by-productid/${this.productId}`).then(response =>
            {
                return response.data.series;
            });
            this.monthChartOptions = {
                chart: {
                    id: 'month-sales-chart'
                },
                xaxis: {
                    categories: data.map(item =>
                    {
                        return item.x
                    })
                },
                title: {
                    text: 'Saled Quantities Of Last Month',
                    align: 'left'
                },
            },
                this.monthChartSeries = [{
                    name: 'Sales Of Last Month',
                    data: data.map(item =>
                    {
                        return item.y ? parseFloat(item.y) : 0;
                    })
                }]
        },
    },
    async mounted()
    {
        await this.getProductData();
        this.imgUrl = useAuthStore().mediaUrl;
        await this.setMonthSalesChartData();
        await this.setWeekSalesChartData();
    }
}
</script>
<template>
    <Layout>
        <PageHeader title="Charts" pageTitle="Utility" />
        <h3>{{ product.name }} Sales Charts:</h3>
        <h5>Price: ${{ product.price }}</h5>
        <img :src="imgUrl + product.img" alt="image" class="product-image">
        <hr>
        <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-12">

            </div>
        </div>
        <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-12">
                <apexchart width="400" type="line" :options="weekChartOptions" :series="weekChartSeries"></apexchart>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12">
                <apexchart width="400" type="line" :options="monthChartOptions" :series="monthChartSeries"></apexchart>
            </div>
        </div>
    </Layout>
</template>

<style>
.product-image {
    width: 150px;
    height: 150px;
    border: 2px solid black;
    border-radius: 3px;
}
</style>