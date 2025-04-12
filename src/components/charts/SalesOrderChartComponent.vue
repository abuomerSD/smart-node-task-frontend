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
        async setChartPeriodAsWeek()
        {
            this.selected = 'A';
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
            this.selected = 'B';

            const data = await this.http.get('sales-order/sales-of-last-month').then(response => {
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
        <b-form-group label="Type of Chart Period" v-slot="{ ariaDescribedby }">
            <b-form-radio v-model="selected" @click="setChartPeriodAsWeek" :aria-describedby="ariaDescribedby"
                name="some-radios" value="A" ref="radio_year">Week</b-form-radio>
            <b-form-radio v-model="selected" @click="setChartPeriodAsMonth" :aria-describedby="ariaDescribedby"
                name="some-radios" value="B" ref="radio_month">Month</b-form-radio>
        </b-form-group>
        <apexchart width="500" type="line" :options="options" :series="series"></apexchart>
    </div>
</template>
