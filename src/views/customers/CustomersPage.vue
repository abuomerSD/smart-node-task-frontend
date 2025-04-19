<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import Select from 'primevue/select';

export default {
    components: { Layout, PageHeader, Select },
    data()
    {
        return {
            customersCategories: [],
            customer: {},
            customers: [],
            limit: 10,
            page: 1,
        }
    },
    methods: {
        async save()
        {
            await this.http.post('customers', this.customer).then(res =>
            {
                console.log('res data', res.data)
                this.$toast.success('customer Saved')
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
            });
        }
    },
    async mounted()
    {
        await this.getCustomersCategories();
        await this.paginate();
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
                            <th scope="row">Customer Category</th>
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
                            <td>{{ customer.customer_category_name }}</td>
                            <td>{{ customer.name }}</td>
                            <td>{{ customer.tel }}</td>
                            <td>{{ customer.email }}</td>
                            <td>{{ customer.created }}</td>
                            <td>{{ customer.updated }}</td>
                        </tr>
                    </tbody>
                </table>
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
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <!--  -->
                        <div class="row m-2">
                            <Select name="city.name" :options="customersCategories" optionLabel="name"
                                placeholder="Customer Category" fluid v-model="customer.customer_category_id" />
                        </div>
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
                        <button type="button" class="btn btn-primary" @click="save">Save</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Modals end -->

    </Layout>
</template>