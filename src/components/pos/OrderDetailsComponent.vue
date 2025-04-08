<script>
import { useAuthStore } from '@/state/pinia.js';

export default {
    data()
    {
        return {
            OrderDetails: [],
            imgUrl: '',
            page: 1,
            limit: 10,
            total_rows: 1,
            total_pages: 1,
            modalImage: '',
            selectedOrder: {},
            orderTotal: 0,
            partialReturnTotal: 0,
            tempQty: [0, 0, 0],
            sale_credit_notes: {
                sale_order_id: null,
                amount_returned: null,
                sale_credit_note_details: [
                    {
                        sale_credit_note_id: null,
                        sale_order_detail_id: null,
                        qty: null,
                    }
                ]
            }
        }
    },
    methods: {
        calculatePartialReturnTotal()
        {
            this.partialReturnTotal = 0;
            this.selectedOrder.sale_order_details.forEach((element) =>
            {
                if(!element.newQty) {
                    element.newQty = 0;
                }
                this.partialReturnTotal += element.price * element.newQty;
            });
        },
        async paginateOrderDetails(page)
        {
            console.log("page", page);
            await this.http.get('sales-order/paginate', { page: this.page, limit: this.limit }).then(async (res) =>
            {
                this.OrderDetails = await res.data;
                this.total_rows = res.tot;
                console.log('total pages', this.total_rows);

                // Calculate total pages
                this.total_pages = Math.ceil(this.total_rows / this.limit);
                this.total_pages = res.tot;
            });
        },
        setModalImagesSource(image)
        {
            this.modalImage = this.imgUrl + image;
            console.log('this.modalImage', this.modalImage);
        },
        calculateOrderTotal(selectedOrder)
        {
            this.orderTotal = 0;
            selectedOrder.sale_order_details.forEach((detail) =>
            {
                this.orderTotal += detail.price * detail.qty;
            });
        },
        setSelectedOrderDetails(order)
        {
            this.selectedOrder = order;
            console.log('selectedOrder', this.selectedOrder);
            this.calculateOrderTotal(this.selectedOrder);
            this.calculatePartialReturnTotal();
        },
        async showOrderDetails(id)
        {
            await this.http.get('sales-order/' + id).then((res) =>
            {
                this.selectedOrder = res.data;
                console.log('data', res.data);
                this.calculateOrderTotal(this.selectedOrder);
            });
            this.calculateOrderTotal(this.selectedOrder);
            this.calculatePartialReturnTotal();

        },
        async fullReturn(sale_credit_notes, sale_order_id)
        {
            this.sale_credit_notes.sale_order_id = sale_order_id;
            this.sale_credit_notes.amount_returned = this.orderTotal;
            this.sale_credit_notes.sale_credit_note_details = this.selectedOrder.sale_order_details;
            this.sale_credit_notes.sale_credit_note_details.forEach(element =>
            {
                element.sale_order_detail_id = element.id;
                delete element.id;
            })
            console.log('sale_credit_notes', sale_credit_notes);
            console.log('Selected Order', this.selectedOrder)
            await this.http.post('sales-credit-notes', this.sale_credit_notes).then((res) =>
            {

                if (res.status)
                {
                    this.$toast.success(`Order No #${this.selectedOrder.id} Full Returned`);
                    this.paginateOrderDetails(this.page);
                }
            }).catch((err) =>
            {
                console.log(err);
            });
        },
        async partialReturn(sale_credit_notes, sale_order_id)
        {
            this.sale_credit_notes.sale_order_id = sale_order_id;
            this.sale_credit_notes.amount_returned = this.orderTotal;
            this.sale_credit_notes.sale_credit_note_details = this.selectedOrder.sale_order_details;
            this.sale_credit_notes.sale_credit_note_details.forEach(element =>
            {
                element.sale_order_detail_id = element.id;
                delete element.id;
            });

            await this.http.post('sales-credit-notes', this.sale_credit_notes).then((res) =>
            {

                if (res.status)
                {
                    this.$toast.success(`Order No #${this.selectedOrder.id} Full Returned`);
                    this.paginateOrderDetails(this.page);
                }
            }).catch((err) =>
            {
                console.log(err);
            });
        }
    },
    async mounted()
    {
        await this.paginateOrderDetails(this.page);
        console.log('this.total_rows', this.total_rows)
        this.imgUrl = useAuthStore().mediaUrl;
    },
    watch: {
        page: function (page)
        {
            this.paginateOrderDetails(page);
        }
    },

}
</script>

<template>

    <div class="row">
        <div class="col-11">
            <h4>Order Details</h4>
        </div>
        <div class="col-1">
            <a href="javascript:void(0)" @click="paginateOrderDetails(page)"><i class='bx bx-redo bx-md'
                    style="color: green"></i></a>
        </div>
    </div>
    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">Id</th>
                    <th scope="col">Date Created</th>
                    <th scope="col">Date Updated</th>
                    <th scope="col">Recipet Image / Number</th>
                    <th scope="col">Show Details</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(order, index) in OrderDetails" :key="index">
                    <td>{{ order.id }}</td>
                    <td>{{ order.created }}</td>
                    <td>{{ order.updated }}</td>
                    <td v-if="order.recipet_img"><img :src="imgUrl + order.recipet_img" alt="image" class="order-image"
                            data-bs-toggle="modal" data-bs-target="#image-modal"
                            @click="setModalImagesSource(order.recipet_img)"></td>
                    <td v-if="order.recipet_number != 'null'">{{ order.recipet_number }}</td>
                    <td><a href="javascript:void(0)"><i class="bx bx-info-circle bx-sm" data-bs-toggle="modal"
                                data-bs-target="#order-details-modal" @click="setSelectedOrderDetails(order)"></i></a>
                    </td>
                    <td><button class="btn btn-danger m-1" @click="setSelectedOrderDetails(order)"
                            data-bs-toggle="modal" data-bs-target="#full-return-modal">Full Return</button><button
                            class="btn btn-danger" @click="setSelectedOrderDetails(order)" data-bs-toggle="modal"
                            data-bs-target="#partial-return-modal">Partial Return</button></td>
                </tr>
            </tbody>
        </table>
        <div class="overflow-auto">
            <b-pagination v-if="total_pages > 1" v-model="page" :total-rows="total_rows" :per-page="limit"
                aria-controls="my-table"></b-pagination>
        </div>
    </div>
    <!-- Image Modal Start -->
    <div class="modal" tabindex="-1" id="image-modal">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Recipet Image</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <img class="recipet-image" :src="modalImage" alt="Image">
                </div>
            </div>
        </div>
    </div>
    <!-- Image Modal End -->

    <!-- Order Details Modal Start -->
    <div class="modal fade" tabindex="-1" id="order-details-modal">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Order No #{{ selectedOrder.id }}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <table class="table">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Product Name</th>
                                <th scope="col">Poduct Image</th>
                                <th scope="col">Product Quantity</th>
                                <th scope="col">Product Price</th>
                                <th scope="col">Product Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(detail, index) in selectedOrder.sale_order_details" :key="index">
                                <th scope="row">{{ index + 1 }}</th>
                                <td>{{ detail.product.name }}</td>
                                <td><img :src="imgUrl + detail.product.img" alt="image" class="order-details-image">
                                </td>
                                <td>{{ detail.qty }}</td>
                                <td>{{ detail.price }}</td>
                                <td>{{ detail.price * detail.qty }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="totals">
                        <hr>
                        <h5>Total: {{ this.orderTotal }}$</h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Order Details Modal End -->

    <!-- Full Return Modal Start -->
    <div class="modal fade" id="full-return-modal" tabindex="-1" aria-labelledby="full-return-modal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="full-return-modal-label">Full Return Order #{{ selectedOrder.id }}
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <h4>Total: {{ orderTotal }}$</h4>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-danger"
                        @click="fullReturn(this.sale_credit_notes, selectedOrder.id)" data-bs-dismiss="modal">Return
                        Order</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Full Return Modal End -->

    <!-- Partial Return Modal Start -->
    <div class="modal fade" id="partial-return-modal" tabindex="-1" aria-labelledby="partial-return-modal"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h1 class="modal-title fs-5" id="partial-return-modal-label">Partial Return Order #{{
                        selectedOrder.id }}
                    </h1>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="table-responive">
                        <table class="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Product Name</th>
                                    <th scope="col">Poduct Image</th>
                                    <th scope="col">Product Quantity</th>
                                    <th scope="col">Return Quantity</th>
                                    <th scope="col">Product Price</th>
                                    <th scope="col">Product Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(detail, index) in selectedOrder.sale_order_details" :key="index">
                                    <th scope="row">{{ index + 1 }}</th>
                                    <td>{{ detail.product.name }}</td>
                                    <td><img :src="imgUrl + detail.product.img" alt="image" class="order-details-image">
                                    </td>
                                    <td>{{ detail.qty }}</td>
                                    <td><input type="number" class="form-control" min="0" :max="detail.qty" @change="calculatePartialReturnTotal(detail)" v-model.number="selectedOrder.sale_order_details[index].newQty"></td>
                                    <td>{{ detail.price }}</td>
                                    <td>{{ detail.price * detail.newQty }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <h4>Total: {{ partialReturnTotal }}$</h4>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-danger" @click="partialReturn(this.sale_credit_notes, selectedOrder.id)"
                        data-bs-dismiss="modal">Return Order</button>
                </div>
            </div>
        </div>
    </div>
    <!-- Partial Return Modal End -->

</template>

<style>
.order-image {
    width: 150px;
    height: 100px;
    cursor: pointer;
}

.recipet-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.order-details-image {
    width: 100px;
    height: 100px;
}
</style>