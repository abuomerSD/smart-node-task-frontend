<template>
  <layout>
    <PageHeader title="test" pageTitle="Tasks" />


    <BRow>

      <BCol xl="6">
        <BCard no-body>
          <BCardBody class="pb-0">
            <BCardTitle>Basic example</BCardTitle>

            <div class="row">
                <div class="col-6">
                    <BForm class="app-search d-none d-lg-block">
                              <div class="position-relative">
                                <input @input="searchUser(currentPage)" type="search" v-model="searchModel" class="form-control" :placeholder="$t('navbar.search.text')" />
                                <span class="bx bx-search-alt"></span>
                              </div>
                            </BForm>
                </div>
                <div class="col-6">
                        <button
                        style="float:right"
                            type="button"
                            @click="preAddUser()"
                            class="btn btn-primary float-right"
                        >
                            <i class="bx bx-plus"></i>
                        </button>
                    
                    
                </div>
            </div>
 
            <div class="table-responsive">
              <BTableSimple class="mb-0">
                <BThead>
                  <BTr>
                    <BTh>#</BTh>
                    <BTh>Name</BTh>
                    <BTh>Address</BTh>
                    <BTh>Birthdate</BTh>
                    <BTh>Actions</BTh>
                  </BTr>
                </BThead>
                <BTbody>
                  <BTr v-for="(user, i) in users" :key="user.id">
                    <BTh scope="row">{{ perPage * (currentPage -1) +  i + 1 }}</BTh>
                    <BTd>{{user.name}}</BTd>
                    <BTd>{{ user.address }}</BTd>
                    <BTd>{{ user.birthdate }}</BTd>
                    <BTd>
                        <button
                    type="button"
                    class="btn btn-warning"
                    @click="preEditUser(user)"
                >
                    Edit
                </button>
                    </BTd>
                    <BTd>
                        <button
                    type="button"
                    class="btn btn-danger"
                    @click="deleteUsers(user.id)"
                >
                    Delete
                </button>
                    </BTd>
                    <!-- <BTd>@mdo</BTd> -->
                  </BTr>
                </BTbody>
              </BTableSimple>
            </div>
          </BCardBody>
          <BCardFooter>
            <BPagination v-model="currentPage" :per-page="perPage" :total-rows="totalRows" ></BPagination>
          </BCardFooter>
        </BCard>
      </BCol>

      <p>press this  <router-link :to="{name:'miniPage'} "> link</router-link> to view this page </p>
      
      <div class="container-fuild">
          <router-view ></router-view>

      </div>
</BRow>

<!-- Modal Body -->
<!-- if you want to close by clicking outside the modal, delete the last endpoint:data-bs-backdrop and data-bs-keyboard -->
<div
    class="modal fade"
    id="TestModel"
    tabindex="-1"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
    
    role="dialog"
    aria-labelledby="modalTitleId"
    aria-hidden="true"
>
    <div
        class="modal-dialog modal-dialog-scrollable modal-dialog-centered modal-sm"
        role="document"
    >
        <form @submit.prevent="">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="modalTitleId">
                    Modal title
                </h5>
                <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                ></button>
            </div>
            <div class="modal-body">Body</div>
            <div class="modal-footer">
                <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                >
                    Close
                </button>
                <button type="button" class="btn btn-primary">Save</button>
            </div>
        </div>
    </form>
    </div>
</div>


  </layout>
</template>
<script>
import {Modal} from 'bootstrap'
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";


export default {
      components: { Layout, PageHeader },
    data() {
        return {
            users: [],
            userModal: {},
            perPage: 3,
            currentPage: 1,
            totalRows: 0,
            searchModel:""
        }
          
    },
    // computed: {
    //         filteredUsers(){
    //              return this.users.slice(
    //   (this.currentPage - 1) * this.perPage,
    //   this.currentPage * this.perPage,
    // );
    //         }
    // },
    watch: {
        currentPage: function (newVal) {
        if(!this.searchModel.length)    
                this.paginate(newVal)
            else 
            this.searchUser(newVal)
        }
     }  , 
    methods: {
        deleteUsers(id) {
            var data = {
                title: 'delete',
                msg: 'are you sure',
                currentPage :1,
            }
            this.popup.confirm(data).then((resp) => {
                if (resp) {
                    this.http.delete(`users`, id).then((res) => {
                        if (res.status) {
                            this.getUsers();
                        }
                    })
                    
                }
                
            })
        },
        
        getUsers() {
            this.http.get('users').then((res) => {
                if (res.status) {
                    this.users = res.data;
                    this.totalRows = 50;
                }
            })
        },
        paginate(page) {
            console.log(page);
            this.http.get('users/paginate', { page, limit: this.perPage }).then((res) => {
                
                this.users = res.data
                this.totalRows = res.tot
            })
            
        },
        searchUser(page) {
            if (!this.searchModel.length)        
            {
                this.currentPage = 1
                this.paginate(this.currentPage)
    return
            }
            
            console.log(page);
            this.http.post('users/search', { page, limit: this.perPage,search:this.searchModel }).then((res) => {
                this.users = res.data
                this.totalRows = res.tot
            })
            
        },
        editUser(user, newData) {
            this.http.put('users',user.id, newData).then((res) => {
                if (res.status) {
                this.getUsers()
            }
            })
    },
        insertUser(user) {
            this.http.post('users', user).then((res) => {
                if (res.status) {
                this.getUsers()
            }
            })
    },
    log(event) {
      console.log(event)
        },
        preAddUser() {
            var data = {
                title: 'add user',
                inputs: [
                    {
                        model: 'name',
                        type: 'text',
                        label: "Name",
                        value:''
                    },
                    {
                        model: 'address',
                        type: 'text',
                        label:"Address"
                    },
                    {
                    model: 'birthdate',
                        type: 'date',
                        label: "birthdate",
                        
                    }
                ],
                buttons: [
                    {
                        text: 'add',
                        closer: true,
                        color:'primary',
                        handler: (obj) => {
                            console.log(obj);
                            this.insertUser(obj);
                            
                        }
                    },
                    {
                        text: 'cancel',
                        closer: true,
                        color: 'danger',
                        handler: () => {
                            console.log("clicked cancel");
                            
                        }
                    }
                ]
            }
            this.popup.modal(data)
    },
        preEditUser(user) {
            var data = {
                title: 'Edit user',
                inputs: [
                    {
                        model: 'name',
                        type: 'text',
                        label: "Name",
                        value:user.name
                    },
                    {
                        model: 'address',
                        type: 'text',
                        label:"Address",
                        value:user.address
                    },
                    {
                    model: 'birthdate',
                        type: 'date',
                        label: "birthdate",
                        value:user.birthdate
                        
                    }
                ],
                buttons: [
                    {
                        text: 'Edit',
                        closer: true,
                        color:'primary',
                        handler: (obj) => {
                            console.log(obj);
                            this.editUser(user,obj);
                            
                        }
                    },
                    {
                        text: 'cancel',
                        closer: true,
                        color: 'danger',
                        handler: () => {
                            console.log("clicked cancel");
                            
                        }
                    }
                ]
            }
            this.popup.modal(data)
    }
    },
    mounted() {
        this.userModal = new Modal('#TestModel')
    this.paginate(1)    
    },
    
}
    

</script>
<style>
</style>