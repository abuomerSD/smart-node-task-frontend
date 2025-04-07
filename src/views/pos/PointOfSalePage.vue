<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import CartComponent from "../../components/pos/CartComponent.vue";
import TransactionComponent from "../../components/pos/TransactionComponent.vue";


/**
 * Starter component
 */
export default {
  components: { Layout, PageHeader, TransactionComponent, CartComponent },
  data() {
    return {

    }
  },
  methods: {
    refreshTransactions() {
        this.$refs.transactionComp.getTransactions();
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
                    <CartComponent @refreshTransactions="refreshTransactions" />
                </b-tab>
                <b-tab title="Transactions">
                    <TransactionComponent ref="transactionComp" />
                </b-tab>
            </b-tabs>
        </div>
    </Layout>
</template>