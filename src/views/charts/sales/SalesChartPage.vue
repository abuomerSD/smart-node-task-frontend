<script>
import Layout from "@/layouts/main";
import PageHeader from "@/components/page-header";
import SalesOrderChartComponent from "../../../components/charts/SalesOrderChartComponent.vue";
import ProductsCompareChartComponent from "../../../components/charts/ProductsCompareChartComponent.vue";


export default {
    components: { Layout, PageHeader, SalesOrderChartComponent, ProductsCompareChartComponent },

    // mounted: {

    // }
}
</script>
<template>
    <Layout>
        <PageHeader title="Charts" pageTitle="Utility" />
        <b-tabs content-class="mt-3">
            <b-tab title="Sales Orders Chart" active>
                <SalesOrderChartComponent />
            </b-tab>
            <b-tab title="Products Compare Chart">
                <ProductsCompareChartComponent />
            </b-tab>
        </b-tabs>
    </Layout>

</template>
