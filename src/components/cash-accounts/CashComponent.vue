<script>
import AutoComplete from 'primevue/autocomplete';


export default {
    components: { AutoComplete },
    data()
    {
        return {
            account: { type: 'cash' },
            cashLimit: 5,
            cashPage: 1,
            accounts: [],
            total_cash_accounts: 0,
            filteredAccounts: [],
            receiverAccount: { name_en: '', },
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
            await this.http.post('cash-accounts', this.account).then(async res =>
            {
                console.log('res', res.data)
                this.$toast.success('Account Saved Successfully')
                this.account = { type: 'cash' }
                await this.paginate()
            })
        },
        async update()
        {
            await this.http.put(`cash-accounts`, this.account.level_three_chart_of_account_id, this.account).then(async res =>
            {
                console.log('res', res.data)
                await this.paginate()
                this.$toast.success('Account Updated Successfully')
                this.account = { type: 'cash' }
            })
        },
        async deleteAccount()
        {
            await this.http.delete('cash-accounts', this.account.level_three_chart_of_account_id).then(async res =>
            {
                console.log('res', res.data)
                await this.paginate()
                this.$toast.success('Account Deleted Successfully')
                this.account = { type: 'cash' }
            })
        },
        select(account)
        {
            this.account = account
        },
        async searchAccount(event) 
        {
            console.log('event', event)
            await this.http.post('cash-accounts/search', { search: event.query.toLowerCase() }).then(res =>
            {
                console.log('res', res)
                this.filteredAccounts = res.data
                console.log('filteredAccounts', this.filteredAccounts)
            })
        },
        setReceiverAccount()
        {
            console.log('receiverAccount', this.receiverAccount)
        },
        getAccountObjects(value)
        {
            if (value.name)
            {
                return `${value.name_en} -  ${value.name}`
            } else
            {
                return ''
            }
        },
        async transfer()
        {
            console.log('account', this.account)
            console.log('receiver account', this.receiverAccount)
            if (!this.receiverAccount.id)
            {
                this.$toast.warning(`Please select an Account First`)
                return
            }
            if (this.receiverAccount.id === this.account.id)
            {
                this.$toast.warning(`You can't Transfer Funds From Account To the same Account`)
                return
            }
            if (!this.receiverAccount.descr && !this.receiverAccount.descr_en)
            {
                this.$toast.warning('Please Enter Trasnfer Description')
                return
            }
            if (!this.receiverAccount.value)
            {
                this.$toast.warning('Please Enter The Transfer Value')
                return
            }
            if (this.receiverAccount.value > this.account.balance)
            {
                this.$toast.warning('Transfer Value is more than this account balance')
                return
            }

            let obj = {
                descr: this.receiverAccount.descr,
                descr_en: this.receiverAccount.descr_en,
                documents: JSON.stringify([]),
            }

            let records = [];
            records.push({
                account_id: this.account.level_three_chart_of_account_id, type: 'credit', value: this.receiverAccount.value, descr: this.receiverAccount.descr,
                descr_en: this.receiverAccount.descr_en,
            })

            records.push({
                account_id: this.receiverAccount.level_three_chart_of_account_id, type: 'debit', value: this.receiverAccount.value, descr: this.receiverAccount.descr,
                descr_en: this.receiverAccount.descr_en,
            })

            await this.http.post('transactions', { ...obj, records: JSON.stringify(records) }).then(async res =>
            {
                console.log('res', res)
                this.$toast.success('Transfer Done Successfully')
                await this.paginate()
                this.receiverAccount = { name_en: '', }
            })
        },
        async paginate()
        {
            await this.http.get('cash-accounts/cash/paginate/', { page: this.cashPage, limit: this.cashLimit }).then(res =>
            {
                console.log('res', res)
                this.accounts = res.data
                this.total_cash_accounts = res.tot
            })
        }
    },
    async mounted()
    {
        await this.paginate();
    },
    watch: {
        cashPage: async function ()
        {
            await this.paginate();
        }
    }
}
</script>
<template>
    <div class="row">
        <div class="col-lg-11"></div>
        <div class="col-lg-1"><a href="javascript:void(0)"><i class="bx bx-plus-medical bx-sm" data-bs-toggle="modal"
                    data-bs-target="#add-cash-account-modal"></i></a></div>
    </div>
    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th scope="row">#</th>
                    <td>Account No</td>
                    <td>Name</td>
                    <td>Balance</td>
                    <td>Operations</td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(account, index) in accounts" :key="index">
                    <th scope="row">{{ index + 1 }}</th>
                    <td>{{ account.level_three_chart_of_account_id }}</td>
                    <td>{{ account.name_en }}</td>
                    <td>{{ account.balance }}</td>
                    <td><button class="btn btn-success m-1" data-bs-toggle="modal"
                            data-bs-target="#transfer-cash-funds-model"
                            @click="select(account)">Transfer</button><button class="btn btn-primary m-1"
                            data-bs-toggle="modal" data-bs-target="#edit-cash-account-modal"
                            @click="select(account)">Edit</button><button class="btn btn-danger m-1"
                            data-bs-toggle="modal" data-bs-target="#delete-cash-account-confirmation-modal"
                            @click="select(account)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <b-pagination v-model="cashPage" :total-rows="total_cash_accounts" :per-page="cashLimit"
            aria-controls="my-table"></b-pagination>
    </div>
    <!-- Modals -->
    <div class="modals">
        <!-- add account modal start -->
        <div class="modal fade" id="add-cash-account-modal" tabindex="-1" aria-labelledby="exampleModalLabel"
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
        <!-- edit cash account modal start -->
        <div class="modal fade" id="edit-cash-account-modal" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Cash Account</h1>
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
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" @click="update"
                            data-bs-dismiss="modal">Update</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- edit cash account modal end -->
        <!-- delete cash account confirmation modal start -->
        <!-- Modal -->
        <div class="modal fade" id="delete-cash-account-confirmation-modal" tabindex="-1"
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
        <!-- Transfer transfer funds between accounts modal start -->
        <!-- Modal -->
        <div class="modal fade" id="transfer-cash-funds-model" tabindex="-1" aria-labelledby="exampleModalLabel"
            aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Trasnfer Funds</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row m-2">
                            Tansfer To :
                        </div>
                        <div class="row m-2">
                            <div class="col-md-12">
                                <AutoComplete v-model="receiverAccount" :suggestions="filteredAccounts"
                                    @complete="searchAccount($event)" :optionLabel="getAccountObjects"
                                    inputClass="form-control" class="w-100" appendTo="self" placeholder="Choose Account"
                                    @change="setReceiverAccount" />
                            </div>
                        </div>
                        <div class="row m-2">
                            <div class="col-md-12">
                                <input type="text" class="form-control" placeholder="Tasnfer Desciption in English"
                                    v-model="receiverAccount.descr_en">
                            </div>
                        </div>
                        <div class="row m-2">
                            <div class="col-md-12">
                                <input type="text" class="form-control" placeholder="Tasnfer Desciption in Arabic"
                                    v-model="receiverAccount.descr">
                            </div>
                        </div>
                        <div class="row m-2">
                            <div class="col-md-12">
                                <input type="number" class="form-control" placeholder="Tasnfer Value"
                                    v-model="receiverAccount.value" :max="account.balance" min="1">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal"
                            @click="transfer">Transfer</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- Transfer transfer funds between accounts modal end -->
    </div>
</template>
