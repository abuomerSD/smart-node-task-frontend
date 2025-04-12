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
      chartOptions: {
        chart: {
          type: 'bar',
          height: 350
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 5,
            borderRadiusApplication: 'end'
          },
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          show: true,
          width: 2,
          colors: ['transparent']
        },
        xaxis: {
          categories: ['']
        },
        yaxis: {
          title: {
            text: '$ Dollars'
          }
        },
        fill: {
          opacity: 1
        },
        tooltip: {
          y: {
            formatter: function (val)
            {
              return "$ " + val + " Dollars"
            }
          }
        }
      },



    }

  },
  methods: {
    async addToChart(product)
    {
      if (!product)
      {
        this.$toast.warning("select product first");
        return;
      }
      let response = [];
      await this.http.get(`sales-order/sales-of-last-month-by-productid/${product.id}`).then(res =>
      {
        response = res.data;
      }).catch(error =>
      {
        console.error('Error fetching sales data:', error);
        this.$toast.error("Error fetching sales data");
        return;
      });

      console.log('res', response);

      // delete product from products list
      this.products = this.products.filter(item => item.id !== product.id);

      // add product to series
      this.chartOptions = {
        xaxis: {categories: response.series.map(item =>
        {
          return item.x
        })
      }}

      // this.chartOptions.xaxis.categories.push(response.series)
      this.series.push({ name: product.name, data: response.series.map(item => item.y ? item.y : 0) });
      console.log('chartOptions', this.chartOptions);
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
    <div class="compare-products">
      <div class="row">
        <div class="col-3 m-1">
          <multiselect id="single-select-search" v-model="selectedProduct" :options="products"
            :custom-label="nameWithLang" placeholder="Select one" label="name" track-by="name"
            aria-label="pick a product"></multiselect>
        </div>
        <div class="row">
          <div class="col-md-2 col-sm-12 m-1">
            <button class="btn btn-primary" @click="addToChart(selectedProduct)">Add To Chart</button>
          </div>
        </div>
      </div>
    </div>
    <hr>
    <div id="chart">
      <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
    </div>
  </div>
</template>
<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>