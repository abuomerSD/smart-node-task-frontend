<script>

export default {
    components: {},
    data()
    {
        return {
            account: { type: 'bank' },
            bankLimit: 5,
            bankPage: 1,
            accounts: [],
            total_bank_accounts: 0,
        }
    },
    methods: {
        async save()
        {
            // validations
            if (!this.account.name || !this.account.name_en)
            {
                this.$toast.warning('Please Enter Account Name in Arabic and English')
                return
            }

            if (!this.account.account_number)
            {
                this.$toast.warning('Please Enter Bank Account Number')
                return
            }
            await this.http.post('cash-accounts', this.account).then(async res =>
            {
                console.log('res', res.data)
                this.$toast.success('Account Saved Successfully')
                this.account = { type: 'bank' }
                await this.paginate()
            })
        }, async update()
        {
            await this.http.put(`cash-accounts`, this.account.level_three_chart_of_account_id, this.account).then(async res =>
            {
                console.log('res', res.data)
                await this.paginate()
                this.$toast.success('Account Updated Successfully')
                this.account = { type: 'bank' }
            })
        },
        async deleteAccount()
        {
            await this.http.delete('cash-accounts', this.account.level_three_chart_of_account_id).then(async res =>
            {
                console.log('res', res.data)
                await this.paginate()
                this.$toast.success('Account Deleted Successfully')
                this.account = { type: 'bank' }
            })
        },
        select(account)
        {
            this.account = account
        },
        async paginate()
        {
            await this.http.get('cash-accounts/bank/paginate/', { page: this.bankPage, limit: this.bankLimit }).then(res =>
            {
                console.log('res', res)
                this.accounts = res.data
                this.total_bank_accounts = res.tot
            })
        }
    },
    mounted()
    {
        this.paginate();
    },
    watch: {
        bankPage: async function () 
        {
            await this.paginate()
        }
    }
}
</script>
<template>
    <div class="row">
        <div class="col-lg-11"></div>
        <div class="col-lg-1"><a href="javascript:void(0)"><i class="bx bx-plus-medical bx-sm" data-bs-toggle="modal"
                    data-bs-target="#add-bank-account-modal"></i></a></div>
    </div>
    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th scope="row">#</th>
                    <td>Account No</td>
                    <td>Name</td>
                    <td>Bank Account Number</td>
                    <td>Balance</td>
                    <td>Operations</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(account, index) in accounts" :key="index">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ account.level_three_chart_of_account_id }}</td>
                    <td>{{ account.name_en }}</td>
                    <td>{{ account.account_number }}</td>
                    <td>{{ account.balance }}</td>
                    <td><button class="btn btn-success m-1">Transfer</button><button class="btn btn-primary m-1"
                            data-bs-toggle="modal" data-bs-target="#edit-bank-account-modal"
                            @click="select(account)">Edit</button><button class="btn btn-danger m-1"
                            data-bs-toggle="modal" data-bs-target="#delete-bank-account-confirmation-modal"
                            @click="select(account)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <b-pagination v-model="bankPage" :total-rows="total_bank_accounts" :per-page="bankLimit"
            aria-controls="my-table"></b-pagination>
    </div>
    <!-- Modals -->
    <div class="modals">
        <!-- add account modal start -->
        <div class="modal fade" id="add-bank-account-modal" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Add Cash Account</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row m-2">
                            <input type="text" class="form-control" placeholder="type" disabled value="cash"
                                v-model="account.type">
                        </div>
                        <div class="row m-2">
                            <input type="text" class="form-control" placeholder="Account Name in Arabic"
                                v-model="account.name">
                        </div>
                        <div class="row m-2">
                            <input type="text" class="form-control" placeholder="Account Name in English"
                                v-model="account.name_en">
                        </div>
                        <div class="row m-2">
                            <input type="text" class="form-control" placeholder="Bank Account Number"
                                v-model="account.account_number">
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
        <!-- add account modal end -->
        <!-- edit bank account modal start -->
        <div class="modal fade" id="edit-bank-account-modal" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Bank Account</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row m-2">
                            <input type="text" class="form-control" placeholder="type" disabled value="cash"
                                v-model="account.type">
                        </div>
                        <div class="row m-2">
                            <input type="text" class="form-control" placeholder="Account Name in Arabic"
                                v-model="account.name">
                        </div>
                        <div class="row m-2">
                            <input type="text" class="form-control" placeholder="Account Name in English"
                                v-model="account.name_en">
                        </div>
                        <div class="row m-2">
                            <input type="text" class="form-control" placeholder="Bank Account Number"
                                v-model="account.account_number">
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
        <!-- edit bank account modal end -->
        <!-- delete cash account confirmation modal start -->
        <!-- Modal -->
        <div class="modal fade" id="delete-bank-account-confirmation-modal" tabindex="-1"
            aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Confirmation</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>Do You want to delete this account: <strong>{{ account.name_en }}</strong> ?</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-danger" @click="deleteAccount"
                            data-bs-dismiss="modal">Delete</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- delete cash account confirmation modal end -->
    </div>
</template>
