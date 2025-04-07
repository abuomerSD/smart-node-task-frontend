<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import { useAuthStore } from '@/state/pinia.js';
// import categories from "../../router/categories";

/**
 * Starter component
 */
export default {
  components: { Layout, PageHeader },
  data(){
    return {
      products: [],
      page: 1,
      limit: 5,
      tot_pages: 0,
      imgUrl: '',
      searchModel: '',
    }
  },
  methods: {
    preAddProduct() {
      var data = {
                title: 'products.add',
                inputs: [
                    {
                        model: 'name',
                        type: 'text',
                        label: "products.name",
                        value:''
                    },
                    {
                      model: 'file',
                      type: 'file',
                      label: 'products.image',
                    },
                    {
                      model: 'price',
                      type: 'number',
                      label: 'products.price',
                    }
                    
                ],
                buttons: [
                    {
                        text: 'products.add',
                        closer: true,
                        color:'primary',
                        handler: (obj) => {
                          
                            console.log(obj);
                            console.log(`url : categories/${this.$route.params.id}/products`);
                            this.http.do(`products/`, {...obj, category_id: this.$route.params.category_id} ).then((res) => {
                              if(res.status){
                                this.paginate(this.page);
                              }
                              
                            })
                            
                        }
                    },
                    {
                        text: 'products.cancel',
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
    paginate(page) {
      console.log(page);
      this.http.get(`products/paginate`,{category_id: this.$route.params.category_id, page,limit: this.limit}).then((res) => {
        this.products = res.data;
        this.tot_pages = res.tot
      });
    },
    preEditProduct(product){
      var data = {
                title: 'Edit Product',
                inputs: [
                    {
                        model: 'name',
                        type: 'text',
                        label: "products.name",
                        value: product.name,
                    },
                    {
                      model: 'file',
                      type: 'file',
                      label: 'products.image',
                    },
                    {
                      model: 'price',
                      type: 'number',
                      label: 'products.price',
                      value: product.price
                    }
                  ],
                buttons: [
                    {
                        text: 'products.edit',
                        closer: true,
                        color:'primary',
                        handler: (obj) => {
                            console.log(obj);
                            this.http.do(`products/update`, {...obj,id:product.id}).then((res) => {
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
    deleteProduct(product) {
            console.log('product', product);
            var data = {
                title: 'products.delete',
                msg: 'are you sure',
                currentPage :1,
            }
            this.popup.confirm(data).then((resp) => {
                if (resp) {
                    this.http.delete(`products`, product.id).then((res) => {
                      
                        if (res.status) {
                            this.paginate(this.page);
                        }
                    })
                    
                }
                
            })
        },
      searchProducts(page) {
          if (!this.searchModel.length)        
          {
              this.page = 1
              this.paginate(this.page)
              return
          }
          
          console.log("page", page);
          this.http.post('products/search', { page, limit: this.limit, search:this.searchModel }).then((res) => {
              this.products = res.data
              this.tot_pages = res.tot
          })
          
      },
  },
  
  mounted() {
    this.paginate(this.page);
    this.imgUrl = useAuthStore().mediaUrl;
  },
  watch: {
    page: function (val) {
      if(!this.searchModel.length)    
        this.paginate(val)
      else 
        this.searchProducts(val)
    },
  }
};
</script>

<template>
  <Layout>
    <PageHeader title="Products Page" pageTitle="Utility" />
    <h1>Products Page</h1>
    <div class="row">
      <div class="col-6">
        <BForm class="app-search">
                              <div class="position-relative">
                                <input @input="searchProducts(page)" type="search" v-model="searchModel" class="form-control" :placeholder="$t('navbar.search.text')" />
                                <span class="bx bx-search-alt"></span>
                              </div>
                            </BForm>

      </div>
      <div class="col-6"><a style="float: right;" href="javascript:void(0)" @click="preAddProduct()"><i class="bx bx-plus bx-md"></i></a></div>
    </div>
    <div class="table-responsive">
      <table class="table b-table align-middle table-nowrap table-hover">
        <thead class="table-light">
          <tr class="">
          <th scope="col" class="" style="width: 70px;">#</th>
          <th scope="col" class="">Name</th>
          <th scope="col" class="">Price</th>
          <th scope="col" class="">Image</th>
          <th scope="col" class="">Action</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="product.id">
            <td>{{ index + 1 }}</td>
            <td>{{ product.name }}</td>
            <td>{{ product.price }}</td>
            <td><img :src="imgUrl + product.img" alt="product image" style="width: 150px; height: 100px;" /></td>
            <td>
              <div class="d-flex justify-content-center align-items-center">
                <router-link to="single-product" ><i class="bx bx-info-circle bx-sm m-3" ></i></router-link>
                <a href="javascript:void(0)" @click="preEditProduct(product)"><i class="bx bx-edit bx-sm m-3" ></i></a>
                <a href="javascript:void(0)" @click="deleteProduct(product)"><i class="bx bxs-trash bx-sm m-3" style="color: red"></i></a>
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