<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import AutoComplete from 'primevue/autocomplete';


export default {
    components: { Layout, PageHeader, AutoComplete },
    data()
    {
        return {
            records: [{ operation: 'debit' }, { operation: 'debit' }],
            // record: { account: null, operation: null, value: null },
            totalDebit: 0,
            totalCredit: 0,
            files: [],
            documents: [{ name: "", file: { name: '' } }],
            // document: { name: null, file: null },
            filteredAccounts: [],
            accountsNames: [],
            accounts: [],
            isRemoveBtnDisabled: false,
        }
    },
    methods: {
        addRecordRow()
        {
            this.records.push({ operation: 'debit' });
        },
        addDocumentRow()
        {
            this.documents.push({})
        },
        addRecord(record)
        {
            // input checks
            if (!record.account)
            {
                this.$toast.warning('Add Account First');
                return;
            }
            if (!record.operation)
            {
                this.$toast.warning('Select Operation Type First');
                return;
            }
            if (!record.value)
            {
                this.$toast.warning('Enter Operation Value First');
                return;
            }

            // check if account already added to records
            const accountExists = this.records.some(rec => rec.account === record.account)
            if (accountExists)
            {
                this.$toast.warning('This Account Already Added, Choose another one')
                return
            }
            this.records.push(record)
            // clearing the default inputs
            this.record = { account: null, operation: null, value: null }
            // calculating totals
            this.calculateTotals();
        },
        canRemoveRecord()
        {
            // Enable only when:
            // 1- records.length > 2
            return this.records.length > 2;
        },
        removeRecord(record)
        {
            this.records = this.records.filter(r => r !== record);
            this.calculateTotals();
            console.log('records after delete one', this.records)
        },
        calculateTotals()
        {
            this.totalDebit = 0
            this.totalCredit = 0
            this.records.forEach(rec =>
            {
                if (!rec.value)
                {
                    rec.value = 0
                }
                if (rec.operation === 'debit')
                {
                    this.totalDebit += rec.value
                }
                if (rec.operation === 'credit')
                {
                    this.totalCredit += rec.value
                }
            })
        },
        addDocument(document)
        {
            document.file = this.$refs.file.files[0]
            console.log(document)
            // checks
            if (!document.name)
            {
                this.$toast.warning('Enter Document Name')
                return
            }
            if (!document.file)
            {
                this.$toast.warning('Choose File')
                return
            }

            // check if document already added
            const documentExists = this.documents.some(doc => doc.name == document.name)
            if (documentExists)
            {
                this.$toast.warning('Document Already Added')
                return
            }

            this.documents.push(document)
            this.document = { name: null, file: null }
        },
        canRemoveDocument()
        {
            return this.documents.length > 1
        },
        removeDocument(document)
        {
            console.log(document)
            this.documents = this.documents.filter(doc => doc !== document)
        },
        save() 
        {
            // check transaction records 
            if (this.records.length < 1)
            {
                this.$toast.warning('Insert Some Transcations First (Debits and Credits)')
                return
            }
        },
        searchAccounts(event) 
        {
            this.filteredAccounts = this.accountsNames.filter(acc => acc.toLowerCase().includes(event.query.toLowerCase()))
        },
        async getAllLvlThreeAccounts()
        {
            await this.http.get('transactions/get-all-level3-accounts').then(res =>
            {
                this.accounts = res.data
                console.log('accounts', this.accounts)
                this.accounts.forEach(acc => this.accountsNames.push(acc.name_en))
            })
        }
    },
    mounted()
    {
        this.getAllLvlThreeAccounts()
    }
};
</script>
<template>
    <Layout>
        <PageHeader title="Add Manual Journal" pageTitle="Utility" />
        <div class="row">
            <div class="col-lg-11"></div>
            <div class="col-lg-1"><i class="bx bx-plus-medical bx-sm text-success mt-2 cursor-pointer"
                    @click="addRecordRow()"></i></div>
        </div>
        <b-list-group>
            <b-list-group-item v-for="(r, index) in records" :key="index">
                <div class="row">
                    <div class="col-lg-4">
                        <AutoComplete v-model="r.account" :suggestions="filteredAccounts" dropdown
                            @complete="searchAccounts($event)" placeholder="Search for a Account" />
                    </div>
                    <div class="col-lg-3 mt-2"> <input :id="`debit-${index}`" type="radio" @change="calculateTotals"
                            v-model="r.operation" :name="index" value="debit" class="ml-2"> <label
                            :for="`debit-${index}`" style="margin: 5px;">Debit</label><input :id="`credit-${index}`"
                            type="radio" @change="calculateTotals" v-model="r.operation" :name="index" value="credit"
                            class="ml-2">
                        <label :for="`credit-${index}`" style="margin: 5px;">Credit</label>
                    </div>
                    <div class="col-lg-3">
                        <input type="number" class="form-control" placeholder="Value" v-model="r.value" min="1"
                            @input="calculateTotals">
                    </div>
                    <div class="col-lg-2"><a href="javascript:void(0)"
                            @click="canRemoveRecord() ? removeRecord(r) : null" class="btn-icon">
                            <i class="bx bx-trash bx-sm mt-2 mr-1" :class="{
                                'text-danger cursor-pointer': canRemoveRecord(),
                                'text-muted': !canRemoveRecord()
                            }"></i>
                        </a>
                    </div>
                    <div class="col-lg-1"></div>
                </div>
            </b-list-group-item>
        </b-list-group>
        <hr>
        <div class="row mt-2">
            <h5>Total Debit: {{ totalDebit }}</h5>
        </div>
        <div class="row">
            <h5>Total Credit: {{ totalCredit }}</h5>
        </div>
        <hr>
        <div class="row">
            <div class="col-lg-2 col-md-12 col-sm-12 mt-2"><strong>Description</strong></div>
            <div class="col-lg-5 col-md-12 col-sm-12 ml-2"><input type="text" class="form-control"
                    placeholder="Description"></div>
        </div>
        <div class="row mt-2">
            <div class="col-lg-2 col-md-12 col-sm-12 mt-2"><strong>Description in Arabic</strong></div>
            <div class="col-lg-5 col-md-12 col-sm-12 ml-2"><input type="text" class="form-control"
                    placeholder="Description in Arabic"></div>
        </div>
        <hr>
        <div class="row">
            <div class="col-lg-11">
                <strong>Add Document</strong>
            </div>
            <div class="col-lg-1"><i class="bx bx-plus-medical bx-sm text-success mt-2" @click="addDocumentRow"></i>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-8">
                <b-list-group class="mt-2">
                    <b-list-group-item v-for="(document, index) in documents" :key="index">
                        <div class="row">
                            <div class="col-lg-5">
                                <!-- <strong class="m-2">{{ document.name }}</strong> -->
                                <div class=""><input type="text" class="form-control mt-2" placeholder="Document Name"
                                        v-model="document.name">
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <!-- <strong class="m-2">{{ document.file.name }}</strong> -->
                                <div class="">
                                    <input type="file" class="form-control mt-2" placeholder="Choose a File" ref="file">
                                </div>
                            </div>
                            <div class="col-lg-1"><a href="javascript:void(0)"
                                    @click="canRemoveDocument() ? removeDocument(document) : null" class="btn-icon">
                                    <i class="bx bx-trash bx-sm text-danger mt-3" :class="{
                                        'text-danger cursor-pointer': canRemoveDocument(),
                                        'text-muted': !canRemoveDocument()
                                    }"></i></a>
                            </div>
                        </div>
                    </b-list-group-item>
                </b-list-group>
            </div>
        </div>
        <div class="row m-2">
            <div class="col-lg-2">
                <button class="btn btn-success" @click="save">Save</button>
            </div>
        </div>
    </Layout>
</template>
<style scoped>
.cursor-pointer {
    cursor: pointer;
}

.btn-icon {
    border: none;
}

.btn-icon[disabled] {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn-icon[disabled] i {
    pointer-events: none;
}
</style>