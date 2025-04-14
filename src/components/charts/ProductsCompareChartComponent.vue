<script>
import Multiselect from 'vue-multiselect';

export default {
  components: { Multiselect },
  data()
  {
    return {
      selectedProduct: null,
      options: {
        chart: {
          id: 'vuechart-example'
        },
      },
      products: [],
      series: [{
        name: '',
        data: []
      },],
      chartOptions: {},

      productList: [],
      fromDate: null,
      toDate: null,
    }

  },
  methods: {
    async showChart()
    {
      if (!this.fromDate)
      {
        this.$toast.warning('select from date');
        return;
      }
      if (!this.toDate)
      {
        this.$toast.warning('select to date');
        return;
      }
      if (this.productList.length < 1)
      {
        this.$toast.warning('select some products');
        return;
      }

      let productIds = [];

      this.productList.forEach(p => productIds.push(p.id));

      let response = [];
      await this.http.post('sales-order/product-sales-compare/', { productIds, from: this.fromDate, to: this.toDate }).then(res =>
      {
        response = res.data;
      }).catch(error =>
      {
        console.error('Error fetching sales data:', error);
        this.$toast.error("Error fetching sales data");
        return;
      });

      response.forEach(p =>
      {
        console.log(p);
        // this.chartOptions = {
        //   xaxis: {
        //     categories: p.data.map(item =>
        //     {
        //       return item.label
        //     })
        //   }
        // }

        this.chartOptions = {
            chart: {
              height: 350,
              type: 'line',
              zoom: {
                enabled: false
              }
            },
            dataLabels: {
              enabled: false
            },
            stroke: {
              curve: 'straight'
            },
            title: {
              text: 'Product Trends by Month',
              align: 'left'
            },
            grid: {
              row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5
              },
            },
            xaxis: {
            categories: p.data.map(item =>
            {
              return item.label
            })
          }
          }
        this.series.push({ name: p.name, data: p.data.map(item => item.y ? item.y : 0) });
      console.log('chartOptions', this.chartOptions);
      this.productList = [];
      this.fromDate = '';
      this.toDate = '';

        
      });
    },

    addToProductList(selectedProduct)
    {
      if (this.series.length > 0)
      {
        // clear previous settings from chart
        this.chartOptions = {
          xaxis: {
            categories: [],
          }
        }
        this.series = [];
      }
      if (!selectedProduct)
      {
        this.$toast.warning("select product first");
        return;
      }
      const productExists = this.productList.some(item => item.id === selectedProduct.id);
      if (!productExists)
      {
        this.productList.push(selectedProduct);
        console.log(this.productList)
      }
    },
    removeProduct(product)
    {
      const newList = this.productList.filter(p => product.id !== p.id);
      this.productList = newList;
    }
  },
  async mounted()
  {
    await this.http.get('products').then(response =>
    {
      this.products = response.data;
      console.log("Products:", this.products);
    }).catch(error =>
    {
      console.error('Error fetching products:', error);
    });
  }
}
</script>

<template>
  <div>
    <h4>Sales Charts</h4>
    <hr>
    <div class="row">
      <div class="col-lg-4">
        <div class="row">
          <div class="col-lg-5 m-2">
            <p>From</p>
            <input type="date" class="form-control" v-model="fromDate">
          </div>
          <div class="col-lg-5 m-2">
            <p>To</p>
            <input type="date" class="form-control" v-model="toDate">
          </div>
        </div>
        <div class="row">
          <div class="col-lg-6 col-md-6 col-sm-4 m-2">
            <multiselect id="single-select-search" v-model="selectedProduct" :options="products"
              :custom-label="nameWithLang" placeholder="Select one" label="name" track-by="name"
              aria-label="pick a product"></multiselect>
          </div>
          <div class="col-lg-1"></div>
          <div class="col-lg-2 m-3">
            <a href="javascript:void(0)" @click="addToProductList(selectedProduct)"><i
                class='bx bx-plus-medical bx-sm'></i></a>
          </div>
        </div>
        <div class="row m-2">
          <b-list-group>
            <b-list-group-item v-for="product in productList" :key="product.id">
              <div class="row">
                <div class="col-10">{{ product.name }}</div>
                <div class="col-2"><i class='bx bx-trash bx-sm' style="color: red; cursor: pointer;"
                    @click="removeProduct(product)"></i></div>
              </div>
            </b-list-group-item>
          </b-list-group>
        </div>
        <div class="row" v-if="productList.length > 0">
          <div class="col-4"><button class="btn btn-success mb-2" @click="showChart()">Generate Chart</button></div>
        </div>
      </div>
      <div class="col-lg-8">
        <div id="chart">
          <apexchart type="line" height="350" :options="chartOptions" :series="series"></apexchart>
        </div>
      </div>
    </div>
  </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>