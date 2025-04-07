<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import CartComponent from "../../components/pos/CartComponent.vue";
import OrderDetailsComponent from "../../components/pos/OrderDetailsComponent.vue";


/**
 * Starter component
 */
export default {
  components: { Layout, PageHeader, OrderDetailsComponent, CartComponent },
  data() {
    return {

    }
  },
  methods: {
    refreshOrderDetails() {
        this.$refs.transactionComp.paginateOrderDetails();
    }
  }
};
</script>
<template>
    <Layout>
        <PageHeader title="POS Page" pageTitle="Utility" />
        <div>
            <b-tabs content-class="mt-3">
                <b-tab title="Cart" active>
                    <CartComponent @refreshOrderDetails="refreshOrderDetails" />
                </b-tab>
                <b-tab title="Order Details">
                    <OrderDetailsComponent ref="transactionComp" />
                </b-tab>
            </b-tabs>
        </div>
    </Layout>
</template>