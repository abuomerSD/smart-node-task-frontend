<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

/**
 * Starter component
 */
export default {
  components: { Layout, PageHeader },
  data() {
    return {
      categories: [],
      page:1,
      tot_pages : 0,
      limit: 5,
      searchModel: '',
      productsUrl: '/dashboard/categories/',
    };
  },
  methods: {
    getCategories(){
    this.http.get('categories').then((res)=>{
      this.categories = res.data;
      console.log('step 19 :', this.categories);
      
    })  
    },
    preAddCategory() {
            var data = {
                title: 'categories.add',
                inputs: [
                    {
                        model: 'name',
                        type: 'text',
                        label: "Name",
                        value:''
                    },
                    
                ],
                buttons: [
                    {
                        text: 'add',
                        closer: true,
                        color:'primary',
                        handler: (obj) => {
                            console.log(obj);
                            this.http.post('categories', obj).then((res) => {
                              if(res.status){
                                this.getCategories()
                              }
                              
                            })
                            
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
    preEditCategory(category) {
            var data = {
                title: 'Edit user',
                inputs: [
                    {
                        model: 'name',
                        type: 'text',
                        label: "Name",
                        value:category.name
                    },
                ],
                buttons: [
                    {
                        text: 'Edit',
                        closer: true,
                        color:'primary',
                        handler: (obj) => {
                            console.log(obj);
                            this.http.put(`categories`, `${category.id}`, obj).then((res) => {
                              if(res.status) this.paginate(this.page);
                            });
                            
                            
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
    deleteCategory(id) {
            var data = {
                title: 'delete',
                msg: 'are you sure',
                currentPage :1,
            }
            this.popup.confirm(data).then((resp) => {
                if (resp) {
                    this.http.delete(`categories`, id).then((res) => {
                        if (res.status) {
                            this.paginate(this.page);
                        }
                    })
                    
                }
                
            })
        },
      paginate(page) {
            console.log(page);
            this.http.get('categories/paginate', { page, limit: this.limit }).then((res) => {
                
                this.categories = res.data
                this.tot_pages = res.tot
            })
          
        },
        searchCategories(page) {
            if (!this.searchModel.length)        
            {
                this.page = 1
                this.paginate(this.page)
                return
            }
            
            console.log(page);
            this.http.post('categories/search', { page, limit: this.limit, search:this.searchModel }).then((res) => {
                this.categories = res.data
                this.tot_pages = res.tot
            })
            
        },
        
  },
  
  mounted() {
    this.paginate(1);
  },
  watch: {
    page: function (val) {
      if(!this.searchModel.length)    
        this.paginate(val)
      else 
        this.searchCategories(val)
    },
  }
};
</script>
<template>
  <Layout>
    <PageHeader :title="$t('categories.title')" pageTitle="Utility" />
    <div class="row">
      <div class="col-6">
        <BForm class="app-search">
                              <div class="position-relative">
                                <input @input="searchCategories(page)" type="search" v-model="searchModel" class="form-control" :placeholder="$t('navbar.search.text')" />
                                <span class="bx bx-search-alt"></span>
                              </div>
                            </BForm>

      </div>
      <div class="col-6"><a style="float: right;" href="javascript:void(0)" @click="preAddCategory()"><i class="bx bx-plus bx-md"></i></a></div>
    </div>
    <div class="table-responsive">
      <table class="table b-table align-middle table-nowrap table-hover">
      <thead class="table-light">
        <tr class="">
          <th scope="col" class="" style="width: 70px;">#</th>
          <th scope="col" class="">Name</th>
          <th scope="col" class="">Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(category,index) in categories" :key="index">
          <td>{{ limit * (page -1) +  index + 1 }}</td>
          <td>{{ category.name }}</td>
          <td>
            <div class="d-flex justify-content-center align-items-center">
              <router-link :to="{name:'products',params:{category_id:category.id} }" ><i class="bx bx-info-circle bx-sm m-3" ></i></router-link>
              <a href="javascript:void(0)" @click="preEditCategory(category)"><i class="bx bx-edit bx-sm m-3" ></i></a>
              <a href="javascript:void(0)" @click="deleteCategory(category.id)"><i class="bx bxs-trash bx-sm m-3" style="color: red"></i></a>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="mt-3">
      <BPagination v-model="page" :per-page="limit" :total-rows="tot_pages" ></BPagination>
    </div>
    </div>

  </Layout>
</template>