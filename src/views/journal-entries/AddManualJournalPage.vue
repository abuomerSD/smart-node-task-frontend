<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import AutoComplete from 'primevue/autocomplete';



export default {
    components: { Layout, PageHeader, AutoComplete },
    data()
    {
        return {
            records: [{ type: 'debit' }, { type: 'debit' }],
            totalDebit: 0,
            totalCredit: 0,
            files: [],
            documents: [{ name: "", file: { name: '' } }],
            filteredAccounts: [],
            accountsNames: [],
            description_en: '',
            description_ar: '',
        }
    },
    methods: {
        addRecordRow()
        {
            this.records.push({ type: 'debit' });
        },
        addDocumentRow()
        {
            this.documents.push({})
        },
        canRemoveRecord()
        {
            return this.records.length > 2;
        },
        removeRecord(record)
        {
            this.records = this.records.filter(r => r !== record);
            this.calculateTotals();
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
                if (rec.type === 'debit')
                {
                    this.totalDebit += rec.value
                }
                if (rec.type === 'credit')
                {
                    this.totalCredit += rec.value
                }
            })
        },
        canRemoveDocument()
        {
            return this.documents.length > 1
        },
        removeDocument(document)
        {
            this.documents = this.documents.filter(doc => doc !== document)
        },
        async save() 
        {
            // validations
            // check transaction records 
            if (this.records.length < 1)
            {
                this.$toast.warning('Insert Some Transcations First (Debits and Credits)')
                return
            }

            // check for nullable records
            this.records.forEach(rec =>
            {
                if (!rec.value || rec.value === 0)
                {
                    this.$toast.warning('fill all records values')
                    return
                }
                if (!rec.account)
                {
                    this.$toast.warning('fill all records accounts')
                    return
                }
            })

            // check if debits != credits 
            if (this.totalDebit !== this.totalCredit)
            {
                this.$toast.warning('Total Debit Not Equal to Total Credit')
                return
            }

            // check if debits or credits == 0
            if (this.totalDebit === 0 || this.totalCredit === 0)
            {
                this.$toast.warning('Total Debit or Total Credit connot be zero')
                return
            }

            // adding id's to accounts

            this.records.forEach(rec =>
            {

                rec.account_id = rec.account.id;

                // also adding descriptions
                rec.descr = this.description_ar
                rec.descr_en = this.description_en
            })

            this.documents.forEach(doc =>
            {
                // add file to files array
                this.files.push(doc.file)

                // remove file from documents array
                delete doc.file;
            })

            let data = {
                records: JSON.stringify(this.records),
                documents: JSON.stringify(this.documents),
                descr_en: this.description_en,
                descr: this.description_ar,
            }


            for (let i = 0; i < this.files.length; i++)
            {
                data[`file${i}`] = this.files[i]
            }
            console.log('data', data)

            await this.http.do('transactions', data).then(res =>
            {
                console.log('response ', res.data)
                this.$toast.success(`Transaction No #${res.data.id} Saved Successfully`)
                // clear old data
                this.records = [{ type: 'debit' }, { type: 'debit' }]
                this.documents = [{ name: "", file: { name: '' } }]
                this.files = []
                this.description_en = ''
                this.description_ar = ''
                this.totalDebit = 0
                this.totalCredit = 0
            })
        },
        async searchAccounts(event) 
        {
            // this.filteredAccounts = this.accountsNames.filter(acc => acc.toLowerCase().includes(event.query.toLowerCase()))
            await this.http.get('transactions/get-level3-account/', { search: event.query.toLowerCase() }).then(res =>
            {
                this.filteredAccounts = res.data
                console.log('search', event.query.toLowerCase())

                // this.accounts.forEach(acc => this.accountsNames.push(acc.name_en))
            })
        },
        handleFileChange(index)
        {
            // You can add file validation here if needed
            console.log('File selected:', this.documents[index].file);
        },
        accountName(one)
        {
            return one.name_en + ' - ' + one.code
        }
    },
    mounted()
    {

    },
    computed: {
        canUpload()
        {
            return this.documents.every(doc => doc.name && doc.file);
        }
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
                            @complete="searchAccounts($event)" placeholder="Search for a Account"
                            :optionLabel="accountName" />
                    </div>
                    <div class="col-lg-3 mt-2"> <input :id="`debit-${index}`" type="radio" @change="calculateTotals"
                            v-model="r.type" :name="index" value="debit" class="ml-2"> <label :for="`debit-${index}`"
                            style="margin: 5px;">Debit</label><input :id="`credit-${index}`" type="radio"
                            @change="calculateTotals" v-model="r.type" :name="index" value="credit" class="ml-2">
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
            <div class="col-lg-5 col-md-12 col-sm-12 ml-2"><input v-model="description_en" type="text"
                    class="form-control" placeholder="Description"></div>
        </div>
        <div class="row mt-2">
            <div class="col-lg-2 col-md-12 col-sm-12 mt-2"><strong>Description in Arabic</strong></div>
            <div class="col-lg-5 col-md-12 col-sm-12 ml-2"><input v-model="description_ar" type="text"
                    class="form-control" placeholder="Description in Arabic"></div>
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
                                <div class=""><input type="text" class="form-control mt-2" placeholder="Document Name"
                                        v-model="document.name">
                                </div>
                            </div>
                            <div class="col-lg-6">
                                <div class="">
                                    <b-form-file v-model="document.file" :state="Boolean(document.file)"
                                        placeholder="Choose a file..." drop-placeholder="Drop file here..."
                                        @change="handleFileChange(index)" class="mt-2"></b-form-file>
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