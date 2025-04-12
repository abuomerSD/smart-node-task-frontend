<script>
export default {
    data()
    {
        return {
            options: {},
            series: [],
        }

    },
    methods: {
        async setChartPeriodAsWeek()
        {
            const data = await this.http.get('sales-order/sales-of-last-week').then(response => {
                return response.data.series;
            });

            this.options = {
                chart: {
                    id: 'week-sales-chart'
                },
                xaxis: {
                    categories: data.map(item => {
                        return item.x
                    })
                }
            },
            this.series = [{
                name: 'Sales Of Last Week',
                data: data.map(item => {    
                    return item.y ? parseFloat(item.y) : 0;
                })
            }]
            
        },
        async setChartPeriodAsMonth()
        {
            const data = await this.http.get('sales-order/sales-of-last-year').then(response => {
                return response.data.series;
            });
            this.options = {
                chart: {
                    id: 'month-sales-chart'
                },
                xaxis: {
                    categories: data.map(item => {
                        return item.x
                    })
                }
            },
            this.series = [{
                name: 'Sales Of Last Month',
                data: data.map(item => {    
                    return item.y ? parseFloat(item.y) : 0;
                })
            }]
        },
    },
    async mounted()
    {
        await this.setChartPeriodAsWeek();
    }
}   
</script>

<template>
    <div>
        <h4>Sales Charts</h4>
        <hr>
        <div class="row">
            <div class="col-1 m-2">
                <button class="btn btn-success" @click="setChartPeriodAsWeek">Week</button>
            </div>
            <div class="col-1 m-2">
                <button class="btn btn-success" @click="setChartPeriodAsMonth">Month</button>
            </div>
        </div>
        <apexchart width="500" type="line" :options="options" :series="series"></apexchart>
    </div>
</template>
