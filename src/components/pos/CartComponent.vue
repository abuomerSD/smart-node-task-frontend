<script>
import ProductListComponent from './ProductListComponent.vue';
import AutoComplete from 'primevue/autocomplete';



export default {
    components: { ProductListComponent, AutoComplete },
    data()
    {
        return {
            categories: [],
            products: [],
            cartProducts: [],
            orderDetails: [],
            productsPage: 1,
            productsLimit: 5,
            categoriesPage: 1,
            categoriesLimit: 5,
            total_categories: 0,
            total_categories_pages: 0,
            total_products: 0,
            total_products_pages: 0,
            cartTotal: 0,
            showRecipetNumberInput: false,
            showRecipetImageInput: false,
            selectedCategory: null,
            filteredCustomers: [],
            customer: { name: null, tel: null, email: null },
            selectedCustomer: null,
            paymentAmount: 0,
            isHaveCustomer: true,
        }
    },
    async mounted()
    {
        await this.categoriesPaginate(this.categoriesPage);
        console.log('this.total_categories_pages', this.total_categories_pages);
        console.log('this.total_categories', this.total_categories);
        console.log('this.categoriesLimit', this.categoriesLimit);
        this.showCategoryProducts(this.categories[0], this.productsPage);
    },
    methods: {
        refreshOrderDetails()
        {
            this.$emit('refreshOrderDetails');
        },
        toggleRecipetNumber()
        {
            this.showRecipetNumberInput = !this.showRecipetNumberInput;
            this.showRecipetImageInput = false;
        },
        toggleRecipetImage()
        {
            this.showRecipetImageInput = !this.showRecipetImageInput;
            this.showRecipetNumberInput = false;
        },
        addToCart(product)
        {
            product.qty = 1;
            console.log(product);
            console.log("price", typeof product.price);
            console.log("qty", typeof product.qty);
            product.total = Number(product.price) * Number(product.qty);
            const isAdded = this.cartProducts.some(p => p.id === product.id);
            if (!isAdded)
            {
                this.cartProducts.push(product);
            }
            this.calculateTotals();
        },
        removeFromCart(product)
        {
            this.cartProducts = this.cartProducts.filter(p => p.id !== product.id);
            this.calculateTotals();
        },
        async categoriesPaginate(page)
        {
            console.log('page', page);
            await this.http.get('categories/paginate', { page: this.categoriesPage, limit: this.categoriesLimit }).then((res) =>
            {
                this.categories = res.data
                this.total_categories = res.tot;
                this.total_categories_pages = Math.ceil(this.total_categories / this.categoriesLimit);
            });
        },
        async getCategoriesCount()
        {
            await this.http.get('categories').then((res) =>
            {
                this.total_categories = res.data.length;
            });
        },
        showCategoryProducts(category, productsPage)
        {
            this.selectedCategory = category;
            this.total_products_pages = 0;
            this.http.get(`products/paginate`, { category_id: category.id, page: productsPage, limit: this.productsLimit }).then((res) =>
            {
                this.products = res.data;
                this.total_products = res.tot;
                this.total_products_pages = Math.ceil(this.total_products / this.productsLimit);
            });
        },
        calculateTotals()
        {
            let newArray = [];
            this.cartProducts.forEach(product =>
            {
                product.total = Number(product.price) * Number(product.qty);
                newArray.push(product);
            });
            this.cartProducts = newArray;

            // cart total
            this.cartTotal = 0;
            this.cartProducts.forEach(product =>
            {
                this.cartTotal += product.total;
            });
        },
        async pay()
        {
            if (this.cartProducts.length === 0 && this.cartTotal === 0)
            {
                this.$toast.warning('No products in cart');
                return;
            }

            // customer validations
            if (this.isHaveCustomer && !this.selectedCustomer)
            {
                this.$toast.warning('Please Select Cutomer First')
                return
            }

            // Recipet Validations 

            if (!this.$refs.RecipetNumberInput.value && !this.$refs.RecipetImageInput.value)
            {
                this.$toast.warning('Please Enter Recipet Number or Image')
                return
            }

            // payment validations
            if (this.paymentAmount <= 0)
            {
                this.$toast.warning('Payment amount is required')
                return
            }
            // if (this.paymentAmount < this.cartTotal)
            // {
            //     this.$toast.warning('Payment amount is less than total amount');
            //     return;
            // }

            if (this.paymentAmount > this.cartTotal)
            {
                this.$toast.warning('Payment amount is greater than total amount');
                return;
            }

            if (this.isHaveCustomer && !this.selectedCustomer && this.this.paymentAmount < this.cartTotal)
            {
                this.$toast.warning('Only Customers can pay less than total amount');
                return;
            }

            if (!this.isHaveCustomer && !this.selectedCustomer && this.paymentAmount < this.cartTotal)
            {
                this.$toast.warning('Only Customers can pay less than total amount');
                return;
            }

            let transactionValue = this.paymentAmount
            const orderDetails = this.cartProducts.map(product => ({
                ...product,
                product_id: product.id,
                id: undefined // or simply omit it completely
            }));

            const obj = {
                recipet_number: this.showRecipetNumberInput ? this.$refs.RecipetNumberInput.value : null,
                file: this.showRecipetImageInput ? this.$refs.RecipetImageInput.files[0] : null,
                order_details: JSON.stringify(orderDetails),
            };

            let invoice_id = 0;
            if (this.showRecipetNumberInput)
            {
                if (!obj.recipet_number)
                {
                    this.$toast.warning("Recipet number is required");
                    return;
                }
                await this.http.post('sales-order', obj).then((res) =>
                {
                    if (res.status)
                    {
                        this.clearCart();
                        this.$toast.success("Payment successful");
                        console.log('res after pay', res);
                        invoice_id = res.data.id
                        this.$refs.RecipetNumberInput.value = '';
                        this.refreshOrderDetails();
                    } else
                    {
                        this.$toast.error("Payment failed");
                    }
                });
            }

            if (this.showRecipetImageInput)
            {
                if (this.$refs.RecipetImageInput.files.length === 0)
                {
                    this.$toast.warning("Recipet Image is required");
                    return;
                }
                await this.http.do('sales-order', obj).then((res) =>
                {
                    if (res.status)
                    {
                        this.clearCart();
                        this.$toast.success("Payment successful");
                        console.log('res', res);
                        invoice_id = res.data.id
                        this.$refs.RecipetImageInput.value = null;
                        this.refreshOrderDetails();
                    } else
                    {
                        this.$toast.error("Payment failed");
                    }
                });
            }

            // subledger
            let accountReceivableSubAccount = null
            let SalesRevenueSubAccount = null

            await this.http.post('subledger/searchSubAccount', { name_en: 'Accounts Receivables' }).then(res =>
            {
                console.log('res', res)
                accountReceivableSubAccount = res.data
            })
            await this.http.post('subledger/searchSubAccount', { name_en: 'Sales Revenues' }).then(res =>
            {
                console.log('res', res)
                SalesRevenueSubAccount = res.data
            })

            console.log('accountReceivableSubAccount', accountReceivableSubAccount)
            console.log('SalesRevenueSubAccount', SalesRevenueSubAccount)
            const descr = `فاتورة مبيعات رقم ${invoice_id}`
            const descr_en = `Sales invoice No ${invoice_id}`
            let transactionObj = {
                descr,
                descr_en,
                documents: JSON.stringify([]),
            }

            let records = [];

            records.push({
                account_id: accountReceivableSubAccount.level_three_chart_of_account_id, type: 'debit', value: transactionValue, descr,
                descr_en,
            })
            records.push({
                account_id: SalesRevenueSubAccount.level_three_chart_of_account_id, type: 'credit', value: transactionValue, descr,
                descr_en,
            })

            console.log(transactionObj);
            // Normal transactions
            let transaction_id = null
            await this.http.post('transactions', { ...transactionObj, records: JSON.stringify(records), payToCustomer: true }).then(async res =>
            {
                console.log('transactions res', res)
                transaction_id = res.data.id
            })

            // subledger transactions

            let account_receivable_subleger_transaction = {
                transaction_id,
                subledger_subaccounts_id: accountReceivableSubAccount.id,
                type: 'debit',
                value: transactionValue,
                descr,
                descr_en
            }
            let sales_revenue_subledger_transactions = {
                transaction_id,
                subledger_subaccounts_id: SalesRevenueSubAccount.id,
                type: 'credit',
                value: transactionValue,
                descr,
                descr_en,
            }

            if (this.isHaveCustomer)
            {

                account_receivable_subleger_transaction.record_id = this.selectedCustomer.id
                sales_revenue_subledger_transactions.record_id = this.selectedCustomer.id
            } else
            {
                account_receivable_subleger_transaction.record_id = null
                sales_revenue_subledger_transactions.record_id = null
            }

            await this.http.post('subledger/transactions', account_receivable_subleger_transaction).then(res =>
            {
                console.log('account_receivable_subleger_transaction res', res)
            })
            await this.http.post('subledger/transactions', sales_revenue_subledger_transactions).then(res =>
            {
                console.log('sales_revenue_subledger_transactions res', res)
            })


            this.selectedCustomer = null
            this.paymentAmount = 0
            this.isHaveCustomer = true

        }
        ,
        clearCart()
        {
            this.cartProducts = [];
            this.cartTotal = 0;
        },
        incrementProductQty(product)
        {
            product.qty++;
            this.calculateTotals();
        },
        decrementProductQty(product)
        {
            if (product.qty > 1)
            {
                product.qty--;
                this.calculateTotals();
            }
        },
        getCustomerLabel(customer)
        {
            if (customer.name && customer.tel && customer.email)
            {
                return `${customer.name} - ${customer.tel} - ${customer.email}`;
            }
            else
            {
                return '';
            }
        },
        async searchCustomer(event)
        {

            await this.http.post('customers/search', { search: event.query.toLowerCase() }).then(res =>
            {
                console.log('res', res)
                this.filteredCustomers = res.data
                console.log('filteredCustomers', this.filteredCustomers)
            })

        },
        async saveCustomer()
        {
            // validations
            if (!this.customer.name)
            {
                this.$toast.warning('Customer name is required');
                return;
            }
            // if (!this.customer.tel)
            // {
            //     this.$toast.warning('Customer Tel is required');
            //     return;
            // }
            // if (!this.customer.email)
            // {
            //     this.$toast.warning('Customer email is required');
            //     return;
            // }
            await this.http.post('customers', this.customer).then(res =>
            {
                this.$toast.success('Customer saved successfully')
                console.log('res', res)
                this.customer = { name: null, tel: null, email: null }
                return res.data.id
            })
        },
        skipCustomer()
        {
            this.isHaveCustomer = !this.isHaveCustomer
        },
        clearIsExistingCutomer()
        {
            this.selectedCustomer = null;
            console.log('selectedCustomer', this.selectedCustomer)
        },
        clearIsNewCutomer()
        {
            this.customer = { name: null, tel: null, email: null }
            console.log('customer', this.customer)
        },

    },
    watch: {
        categoriesPage: function (val)
        {
            this.categoriesPaginate(val);
        },
        productsPage: function (productsPage)
        {
            this.showCategoryProducts(this.selectedCategory, productsPage);
        },
    },


}
</script>

<template>

    <div class="row">
        <!-- Categories Start -->
        <div class="col-lg-7 col-md-12">
            <h4>Categories</h4>

            <button v-for="category in categories" :key="category.id" :ref="btn_category_ + category.id"
                class="btn-category" @click="showCategoryProducts(category, productsPage)">{{ category.name }}</button>
            <b-pagination v-if="total_categories_pages > 1" v-model="categoriesPage" :total-rows="total_categories"
                :per-page="categoriesLimit" aria-controls="my-table"></b-pagination>
            <ProductListComponent @add-to-cart="addToCart" :products="products" :category="selectedCategory" />

            <div class="row">
                <div class="col">
                </div>
            </div>
            <b-pagination v-if="total_products_pages > 1" v-model="productsPage" :total-rows="total_products"
                :per-page="productsLimit" aria-controls="my-table"></b-pagination>
        </div>
        <!-- Categories End -->
        <!-- Invoice Start -->
        <div class="col-lg-5 col-md-12">
            <h4>Invoice</h4>
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Product</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Price</th>
                        <th scope="col">Total</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(product, index) in cartProducts" :key="product.id">
                        <th scope="row">{{ index + 1 }}</th>
                        <td>{{ product.name }}</td>
                        <td>
                            <a href="javascript:void(0)" @click="incrementProductQty(product)"><i
                                    class="bx bxs-plus-circle bx-sm"></i></a>
                            <input type="number" class="qty-input" @input="calculateTotals" v-model="product.qty"
                                min="1">
                            <a href="javascript:void(0)" @click="decrementProductQty(product)"><i
                                    class="bx bxs-minus-circle bx-sm" style="color: red"></i></a>
                        </td>
                        <td>{{ product.price }}</td>
                        <td>{{ product.total }}</td>
                        <td><a href="javascript:void(0)" @click="removeFromCart(product)"><i class='bx bxs-trash bx-sm'
                                    style="color: red;"></i></a></td>
                    </tr>
                </tbody>
            </table>
            <div class="totals">
                <h5>Total: {{ cartTotal }}$</h5>
                <button class="btn btn-danger" @click="clearCart">Clear Cart</button>
                <!-- <button class="btn btn-primary m-3" @click="pay">Pay</button> -->


                <!-- Pay Modal start -->
                <b-button v-b-modal.Pay-Modal class="btn btn-primary m-3"
                    style="background-color: #02520a; color: white">Pay</b-button>

                <b-modal id="Pay-Modal" title="Confirm Payment" ok-title="Pay" cancel-title="Cancel" @ok="pay">
                    <div>
                        <div>
                            <b-tabs content-class="mt-3">
                                <b-tab title="Existing Customer" active @click="clearIsNewCutomer">
                                    <div class="row m-2">
                                        <div class="col-lg-12">
                                            <AutoComplete v-model="selectedCustomer" :optionLabel="getCustomerLabel"
                                                :suggestions="filteredCustomers" @complete="searchCustomer($event)"
                                                class="w-100" placeholder="Search Customer" inputClass="form-control"
                                                appendTo="self" :disabled="!isHaveCustomer" />
                                        </div>
                                    </div>
                                    <div class="row m-2">
                                        <div class="col-lg-12">
                                            <button class="btn btn-secondary" @click="skipCustomer"
                                                :class="isHaveCustomer ? 'btn btn-danger' : 'btn btn-success'">{{
                                                    isHaveCustomer ?
                                                        'Skip Customer' : 'Select Customer' }}</button>
                                        </div>
                                    </div>
                                </b-tab>
                                <b-tab title="New Customer" @click="clearIsExistingCutomer">
                                    <div class="row m-2">
                                        <div class="col-lg-12">
                                            <input type="text" class="form-control" placeholder="Customer Name"
                                                v-model="customer.name">
                                        </div>
                                    </div>
                                    <div class="row m-2">
                                        <div class="col-lg-12">
                                            <input type="text" class="form-control" placeholder="Customer Tel"
                                                v-model="customer.tel">
                                        </div>
                                    </div>
                                    <div class="row m-2">
                                        <div class="col-lg-12">
                                            <input type="text" class="form-control" placeholder="Customer Email"
                                                v-model="customer.email">
                                        </div>
                                    </div>
                                    <div class="row m-2">
                                        <div class="col-lg-12">
                                            <button class="btn btn-success" @click="saveCustomer">Save</button>
                                        </div>
                                    </div>
                                </b-tab>
                            </b-tabs>
                        </div>
                        <hr>
                        <b-form-group label="Individual radios" v-slot="{ ariaDescribedby }" class="m-2">
                            <b-form-radio @click="toggleRecipetNumber" :aria-describedby="ariaDescribedby"
                                name="some-radios" value="A">Pay Using Recipet Number</b-form-radio>
                            <b-form-radio @click="toggleRecipetImage" :aria-describedby="ariaDescribedby"
                                name="some-radios" value="B">Pay Using Recipet Image</b-form-radio>
                        </b-form-group>
                    </div>
                    <div class="row">
                        <div v-show="showRecipetNumberInput" class="m-2 col-lg-12">
                            <input type="text" placeholder="Recipet Number" class="form-control"
                                ref="RecipetNumberInput">
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div v-show="showRecipetImageInput" class="m-2">
                                <input type="File" plceholder="Recipet Image" class="form-control"
                                    ref="RecipetImageInput">
                            </div>
                        </div>
                    </div>
                    <hr>
                    <div class="row m-2">
                        <strong>Invoice Total: ${{ cartTotal }}</strong>
                    </div>
                    <hr>
                    <div class="row m-2">Payment Amount</div>
                    <div class="row m-2">
                        <div class="col-lg-6">
                            <input type="number" class="form-control" placeholder="Amount" v-model="paymentAmount"
                                min="1">
                        </div>
                        <div class="col-lg-6"></div>
                    </div>
                </b-modal>
                <!-- Pay Modal end -->
            </div>
        </div>
        <!-- Invoice End -->
    </div>

</template>

<style>
.qty-input {
    max-width: 70px;
}

.btn-category {
    margin: 3px;
    background-color: #035e4c;
    border: 1px solid black;
    border-radius: 5px;
    color: white;
}
</style>