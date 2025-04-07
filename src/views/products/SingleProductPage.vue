<script>
export default {
    data(){
        return {
            product: {},
            imgUrl: '',
        }
    }
}
</script>

<template>
    <Layout>
        <PageHeader title="Single Product Page" pageTitle="Utility" />
        <div class="row">
            <div class="col-12">
                <h1>Single Product Page</h1>
                <p>Product ID: {{ this.$route.params.id }}</p>
                <p>Product Name: {{ product.name }}</p>
                <p>Product Price: {{ product.price }}</p>            
            </div>
        </div>
    </Layout>
</template>
