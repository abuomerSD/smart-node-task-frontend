<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

export default {
    components: { Layout, PageHeader },
    data()
    {
        return {
            customersCategories: [],
            customer: {},
            customers: [],
            total_customers: 0,
            limit: 5,
            page: 1,
        }
    },
    methods: {
        async save()
        {
            await this.http.post('customers', this.customer).then(async res =>
            {
                console.log('res data', res.data)
                this.$toast.success('customer Saved')
                this.customer = {}
                await this.paginate()
            })
        },
        async getCustomersCategories()
        {
            this.http.get('customers/categories').then(res =>
            {
                console.log('customerCategories', this.customerCategories)
                this.customerCategories = res.data;
            })
        },
        async paginate()
        {
            this.http.get('customers/paginate', { limit: this.limit, page: this.page }).then(res =>
            {
                console.log('res data', res.data)
                this.customers = res.data
                this.total_customers = res.tot
            });
        },
        select(customer)
        {
            this.customer = customer
        },
        async update()
        {
            await this.http.put('customers', this.customer.id, this.customer).then(async res =>
            {
                console.log('res', res)
                this.$toast.success('Customer Upated Successfully')
                await this.paginate()
            })
        },
        async delete()
        {
            await this.http.delete('customers', this.customer.id).then(async res =>
            {
                console.log('res', res)
                this.$toast.success('Customer Deleted Successfully')
                await this.paginate()
            })
        },
    },
    async mounted()
    {
        // await this.getCustomersCategories();
        await this.paginate();
    },
    watch: {
        page: async function ()
        {
            await this.paginate()
        }
    }
};
</script>
<template>
    <Layout>
        <PageHeader title="Customers" pageTitle="Utility" />
        <div class="row">
            <div class="col-lg-11"></div>
            <div class="col-lg-1"><a href="javascript:void(0)" data-bs-toggle="modal"
                    data-bs-target="#addCustomerModal"><i class="bx bx-plus-medical bx-sm"></i></a></div>
        </div>
        <div class="row">
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th scope="row">#</th>
                            <!-- <th scope="row">Customer Category</th> -->
                            <th scope="row">Customer Name</th>
                            <th scope="row">Customer Tel</th>
                            <th scope="row">Customer Email</th>
                            <th scope="row">Created</th>
                            <th scope="row">Updated</th>
                            <th scope="row">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(customer, index) in customers" :key="index">
                            <th scope="row">{{ index + 1 }}</th>
                            <!-- <td>{{ customer.customer_category_name }}</td> -->
                            <td>{{ customer.name }}</td>
                            <td>{{ customer.tel }}</td>
                            <td>{{ customer.email }}</td>
                            <td>{{ new Date(customer.created).toLocaleDateString() }}</td>
                            <td>{{ new Date(customer.updated).toLocaleDateString() }}</td>
                            <td><button class="btn btn-primary m-1" @click="select(customer)" data-bs-toggle="modal"
                                    data-bs-target="#updateCustomerModal">Edit</button><button
                                    class="btn btn-danger m-1" @click="select(customer)" data-bs-toggle="modal"
                                    data-bs-target="#deleteCustomerModal">Delete</button></td>
                        </tr>
                    </tbody>
                </table>
                <b-pagination v-model="page" :total-rows="total_customers" :per-page="limit"
                    aria-controls="my-table"></b-pagination>
            </div>
        </div>
        <!-- Modals start -->
        <!-- Button trigger modal -->
        <!-- Modal -->
        <div class="modal fade" id="addCustomerModal" tabindex="-1" aria-labelledby="addCustomerModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Insert Customer</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <!--  -->
                        <!-- <div class="row m-2">
                            <Select name="city.name" :options="customersCategories" optionLabel="name"
                                placeholder="Customer Category" fluid v-model="customer.customer_category_id" />
                        </div> -->
                        <div class="row m-2">
                            <input type="text" class="form-control" placeholder="Customer Name" v-model="customer.name">
                        </div>
                        <div class="row m-2">
                            <input type="text" class="form-control" placeholder="Customer Tel" v-model="customer.tel">
                        </div>
                        <div class="row m-2">
                            <input type="email" class="form-control" placeholder="Customer Email"
                                v-model="customer.email">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="save"
                            data-bs-dismiss="modal">Save</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modals end -->
        <!-- Update Cutomer Modal start -->
        <div class="modal fade" id="updateCustomerModal" tabindex="-1" aria-labelledby="addCustomerModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Update Customer</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <!--  -->
                        <!-- <div class="row m-2">
                            <Select name="city.name" :options="customersCategories" optionLabel="name"
                                placeholder="Customer Category" fluid v-model="customer.customer_category_id" />
                        </div> -->
                        <div class="row m-2">
                            <input type="text" class="form-control" placeholder="Customer Name" v-model="customer.name">
                        </div>
                        <div class="row m-2">
                            <input type="text" class="form-control" placeholder="Customer Tel" v-model="customer.tel">
                        </div>
                        <div class="row m-2">
                            <input type="email" class="form-control" placeholder="Customer Email"
                                v-model="customer.email">
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="update"
                            data-bs-dismiss="modal">Update</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Update Customer Modal end -->
        <!-- Delete Customer Confirmation Modal start -->
        <div class="modal fade" id="deleteCustomerModal" tabindex="-1" aria-labelledby="addCustomerModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Delete Customer</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Do You want to delete the Customer : <strong>{{ customer.name }}</strong>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-danger" @click="save"
                            data-bs-dismiss="modal">Delete</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Delete Customer Confirmation Modal end -->

    </Layout>
</template>