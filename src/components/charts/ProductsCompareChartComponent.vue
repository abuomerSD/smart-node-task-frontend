<script>
export default {
  data()
  {
    return {
      selected: null,
      options: {},
      series: [],
    }

  },
  methods: {
    // To do
  },
  mounted()
  {
    this.options = {
      chart: {
        id: 'vuechart-example'
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
      }
    },
      this.series = [{
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }]
  }
}
</script>

<template>
  <div>
    <h4>Sales Charts</h4>
    <hr>
    <div class="compare-products">
      <div class="row">
        <div class="col-md-3 col-sm-12 m-1">
          <input type="text" placeholder="product 1" class="form-control">
        </div>
        <div class="col-md-3 col-sm-12 m-1">
          <input type="text" placeholder="product 2" class="form-control">
        </div>
        <div class="col-md-2 col-sm-12 m-1">
          <button class="btn btn-primary">Compare</button>
        </div>
      </div>
    </div>
    <hr>
    <apexchart width="500" type="line" :options="options" :series="series"></apexchart>
  </div>
</template>
