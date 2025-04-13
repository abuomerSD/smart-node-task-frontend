<script>
import { useAuthStore } from "@/state/pinia.js";

export default {
    data()
    {
        return {
            weekChartOptions: {},
            weekChartSeries: [],
            monthChartOptions: {},
            monthChartSeries: [],
            bestSellingProductOfDay: [],
            bestSellingProductOfWeek: [],
            bestSellingProductOfMonth: [],
            bestSellingProductOfYear: [],
            imgUrl: '',
        }

    },
    methods: {
        async setWeekSalesChartData()
        {
            const data = await this.http.get('sales-order/sales-of-last-week/').then(response =>
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
                    text: 'Sales Orders Of Last Week',
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
            const data = await this.http.get('sales-order/sales-of-last-year/').then(response =>
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
                    text: 'Sales Orders Of Last Month',
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
        async setBestSellingProductsOfDay()
        {
            await this.http.get('sales-order/best-sellings-day').then(response =>
            {
                this.bestSellingProductOfDay = response.data;
            }).catch(error =>
            {
                console.error('Error fetching best selling products of day:', error);
                this.$toast.error("Error fetching best selling products of day");
            });
        },
        async setBestSellingProductsOfWeek()
        {
            await this.http.get('sales-order/best-sellings-week').then(response =>
            {
                this.bestSellingProductOfWeek = response.data;
            }).catch(error =>
            {
                console.error('Error fetching best selling products of week:', error);
                this.$toast.error("Error fetching best selling products of week");
            });
        },
        async setBestSellingProductsOfMonth()
        {
            await this.http.get('sales-order/best-sellings-month').then(response =>
            {
                this.bestSellingProductOfMonth = response.data;
            }).catch(error =>
            {
                console.error('Error fetching best selling products of month:', error);
                this.$toast.error("Error fetching best selling products of month");
            });
        },
        async setBestSellingProductsOfYear()
        {
            await this.http.get('sales-order/best-sellings-year').then(response =>
            {
                this.bestSellingProductOfYear = response.data;
            }).catch(error =>
            {
                console.error('Error fetching best selling products of year:', error);
                this.$toast.error("Error fetching best selling products of year");
            });
        }
    },
    async mounted()
    {
        await this.setWeekSalesChartData();
        await this.setMonthSalesChartData();
        await this.setBestSellingProductsOfDay();
        await this.setBestSellingProductsOfWeek();
        await this.setBestSellingProductsOfMonth();
        await this.setBestSellingProductsOfYear();
        this.imgUrl = useAuthStore().mediaUrl;
        console.log(this.bestSellingProductOfYear)
    }
}   
</script>

<template>
    <div>
        <h4>Sales Charts</h4>
        <hr>
        <!-- <div class="row">
            <div class="col-1 m-2">
                <button class="btn btn-success" @click="setWeekSalesChartData">Week</button>
            </div>
            <div class="col-1 m-2">
                <button class="btn btn-success" @click="setMonthSalesChartData">Month</button>
            </div>
        </div> -->
        <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-12">
                <apexchart width="400" type="line" :options="weekChartOptions" :series="weekChartSeries"></apexchart>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12">
                <apexchart width="400" type="line" :options="monthChartOptions" :series="monthChartSeries"></apexchart>
            </div>
        </div>
        <hr>
        <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-12">
                <h5>Best Selling Products (Daily)</h5>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Product Name</th>
                                <th scope="col">Product Image</th>
                                <th scope="col">Total Sold</th>
                                <th scope="col">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(product, index) in bestSellingProductOfDay" :key="index">
                                <th scope="row">{{ index + 1 }}</th>
                                <td>{{ product.product_name }}</td>
                                <td><img :src="imgUrl + product.img" alt="image" class="product-image"></td>
                                <td>{{ product.total_sold }}</td>
                                <td><router-link :to="{name: 'product-details', params: {id: product.product_id}}"><i class="bx bx-info-circle bx-sm"></i></router-link></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12">
                <h5>Best Selling Products (Weekly)</h5>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Product Name</th>
                                <th scope="col">Product Image</th>
                                <th scope="col">Total Sold</th>
                                <th scope="col">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(product, index) in bestSellingProductOfWeek" :key="index">
                                <th scope="row">{{ index + 1 }}</th>
                                <td>{{ product.product_name }}</td>
                                <td><img :src="imgUrl + product.img" alt="image" class="product-image"></td>
                                <td>{{ product.total_sold }}</td>
                                <td><router-link :to="{name: 'product-details', params: {id: product.product_id}}"><i class="bx bx-info-circle bx-sm"></i></router-link></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-6 col-md-6 col-sm-12">
                <h5>Best Selling Products (Monthly)</h5>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Product Name</th>
                                <th scope="col">Product Image</th>
                                <th scope="col">Total Sold</th>
                                <th scope="col">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(product, index) in bestSellingProductOfMonth" :key="index">
                                <th scope="row">{{ index + 1 }}</th>
                                <td>{{ product.product_name }}</td>
                                <td><img :src="imgUrl + product.img" alt="image" class="product-image"></td>
                                <td>{{ product.total_sold }}</td>
                                <td><router-link :to="{name: 'product-details', params: {id: product.product_id}}"><i class="bx bx-info-circle bx-sm"></i></router-link></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <div class="col-lg-6 col-md-6 col-sm-12">
                <h5>Best Selling Products (Yearly)</h5>
                <div class="table-responsive">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Product Name</th>
                                <th scope="col">Product Image</th>
                                <th scope="col">Total Sold</th>
                                <th scope="col">Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(product, index) in bestSellingProductOfYear" :key="index">
                                <th scope="row">{{ index + 1 }}</th>
                                <td>{{ product.product_name }}</td>
                                <td><img :src="imgUrl + product.img" alt="image" class="product-image"></td>
                                <td>{{ product.total_sold }}</td>
                                <td><router-link :to="{name: 'product-details', params: {id: product.product_id}}"><i class="bx bx-info-circle bx-sm"></i></router-link></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<style>
.product-image {
    width: 80px;
    height: 80px;
    border: 1px solid black;
    border-radius: 3px;
}
</style>