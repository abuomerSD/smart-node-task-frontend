<script>
import { useAuthStore } from "@/state/pinia.js";
export default {
    props: ['products', 'category'],
    data() {
        return {
            imgUrl: '',
        }
    },
    methods: {
        addToCart(product) {
            this.$emit('add-to-cart', product);
        },
    },
    mounted() {
        this.imgUrl = useAuthStore().mediaUrl;
    }

}
</script>

<template>
    <div class="row">
        <!-- <h5>{{ category.name }} Products</h5> -->
        <span v-for="product in products" :key="product.id" class="col-lg-3 col-md-2 col-sm-6 m-2">
            <b-card
                :title="product.name"
                :img-src="imgUrl + product.img"
                img-alt="Image"
                img-top
                tag="article"
                style="max-width: 20rem;"
                class="product-card"
                @click="addToCart(product)"
            >
                <b-card-text>
                {{ product.price }}$
                </b-card-text>
            </b-card>
        </span>
    </div>
    
</template>

<style>
    .product-card {
        cursor: pointer;
        margin-bottom: 20px;
        border: 1px solid #ccc;
        width: 150px;
        height: 200px;
        display: inline-block;
        margin: 10px;
    }
    
    .product-card img {
        max-width: 150px;
        max-height: 100px;
    }
</style>