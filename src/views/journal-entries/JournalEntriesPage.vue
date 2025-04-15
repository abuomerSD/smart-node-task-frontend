<script>
import Layout from "@/layouts/main";
import PageHeader from "@/components/page-header";

export default {
    components: { Layout, PageHeader }
}
</script>
<template>
    <Layout>
        <PageHeader title="Journal Entries" pageTitle="Utility" />
        <div class="row m-2">
            <div class="col-lg-2"><input type="text" class="form-control" placeholder="Search By Id"></div>
            <div class="col-lg-9"></div>
            <div class="col-lg-1"><router-link :to="{name: 'add-manual-journal'}"><i class="bx bx-plus-medical bx-sm"></i></router-link></div>
        </div>
        <div class="row m-2">
            <table class="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Date</th>
                        <th scope="col">Transaction ID</th>
                        <th scope="col">Description</th>
                        <th scope="col">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <th scope="row">1</th>
                        <td>15-04-2025</td>
                        <td>103</td>
                        <td>دفع مديونية شركة الاسعد</td>
                        <td>10,000</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </Layout>
</template>