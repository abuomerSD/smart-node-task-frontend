<script>

export default {
    components: {},
    data()
    {
        return {
            account: { type: 'bank' },
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
            await this.http.post('cash-accounts', this.account).then(res =>
            {
                console.log('res', res.data)
                this.$toast.success('Account Saved Successfully')
                this.account = { type: 'bank' }
            })
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
                <tr>

                </tr>
            </tbody>
        </table>
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
                        <button type="button" class="btn btn-primary" @click="save">Save</button>
                    </div>
                </div>
            </div>
        </div>
        <!-- add account modal end -->
    </div>
</template>
