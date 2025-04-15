<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

export default {
    components: { Layout, PageHeader },
    data()
    {
        return {
            records: [],
            record: { account: null, operation: null, value: null },
            totalDebit: 0,
            totalCredit: 0,
            files: [],
            documents: [],
            document: { name: null, file: null },
        }
    },
    methods: {
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
        removeRecod(record)
        {
            console.log('remove record', record)
            const filteredArray = this.records.filter(rec => rec.account !== record.account)
            this.records = filteredArray
            // calculating totals
            this.calculateTotals();
        },
        calculateTotals()
        {
            this.totalDebit = 0
            this.totalCredit = 0
            this.records.forEach(rec =>
            {
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
        removeDocument(document)
        {
            console.log(document)
            const filteredArray = this.documents.filter(doc => doc.name !== document.name)
            this.documents = filteredArray
        },
        save() 
        {
            // check transaction records 
            if(this.records.length < 1) {
                this.$toast.warning('Insert Some Transcations First (Debit or Credit)')
                return
            }
            
        }
    }
};
</script>
<template>
    <Layout>
        <PageHeader title="Add Manual Journal" pageTitle="Utility" />
        <b-list-group>
            <b-list-group-item>
                <div class="row">
                    <div class="col-lg-4">
                        <input type="text" class="form-control" placeholder="Account" v-model="record.account">
                    </div>
                    <div class="col-lg-3 mt-2"> <input type="radio" :name="record.account" v-model="record.operation"
                            value="debit" class="ml-2"> <strong>Debit</strong> <input type="radio" name="operation"
                            value="credit" class="ml-2" v-model="record.operation"> <strong>Credit</strong></div>
                    <div class="col-lg-3">
                        <input type="number" class="form-control" placeholder="Value" v-model="record.value" min="1">
                    </div>
                    <div class="col-lg-2"><i class="bx bx-plus-medical bx-sm text-success mt-2 cursor-pointer"
                            @click="addRecord(record)"></i></div>
                    <div class="col-lg-1"></div>
                </div>
            </b-list-group-item>
            <b-list-group-item v-for="(r, index) in records" :key="index">
                <div class="row">
                    <div class="col-lg-4">
                        <input type="text" class="form-control" placeholder="Account" v-model="r.account">
                    </div>
                    <div class="col-lg-3 mt-2"> <input type="radio" @change="calculateTotals" v-model="r.operation"
                            :name="r.account" value="debit" class="ml-2"> <strong>Debit</strong> <input type="radio"
                            @change="calculateTotals" v-model="r.operation" :name="r.account" value="credit"
                            class="ml-2">
                        <strong>Credit</strong>
                    </div>
                    <div class="col-lg-3">
                        <input type="number" class="form-control" placeholder="Value" v-model="r.value" min="1">
                    </div>
                    <div class="col-lg-2"><i class="bx bx-trash bx-sm mt-2 mr-1 text-danger cursor-pointer"
                            @click="removeRecod(r)"></i></div>
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
        <div class="row mt-2">
            <div class="col-lg-2 col-md-12 col-sm-12 mt-2"><strong>Document Name</strong></div>
            <div class="col-lg-5 col-md-12 col-sm-12 ml-2"><input type="text" class="form-control mt-2"
                    placeholder="Document Name" v-model="document.name"></div>
            <div class="col-lg-3">
                <input type="file" class="form-control mt-2" placeholder="Choose a File" ref="file">
            </div>
            <div class="col-lg-1"><i class="bx bx-plus-medical bx-sm text-success mt-2"
                    @click="addDocument(document)"></i></div>
        </div>
        <div class="row">
            <div class="col-lg-6">
                <b-list-group class="m-2">
                    <b-list-group-item v-for="(document, index) in documents" :key="index">
                        <div class="row">
                            <div class="col-lg-5">
                                <strong class="m-2">{{ document.name }}</strong>
                            </div>
                            <div class="col-lg-5">
                                <strong class="m-2">{{ document.file.name }}</strong>
                            </div>
                            <div class="col-lg-2">
                                <i class="bx bx-trash bx-sm text-danger mt-2" @click="removeDocument(document)"></i>
                            </div>
                        </div>
                    </b-list-group-item>
                </b-list-group>
            </div>
        </div>
        <div class="row">
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
</style>