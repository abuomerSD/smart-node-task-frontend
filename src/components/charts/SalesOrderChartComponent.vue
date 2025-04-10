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
        setChartPeridAsYear()
        {
            this.selected = 'A';
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
        },
        setChartPeriodAsMonth()
        {
            this.selected = 'B';
            this.options = {
                chart: {
                    id: 'vuechart-example'
                },
                xaxis: {
                    categories: ['Jan', 'Feb', "Mar", "Apr", "May", "June", "July", "Aug"]
                }
            },
            this.series = [{
                name: 'series-1',
                data: [40, 60, 50, 30, 40, 50, 80, 90]
            }]
        },
    },
    mounted()
    {
        this.setChartPeridAsYear();
    }
}
</script>

<template>
    <div>
        <h4>Sales Charts</h4>
        <hr>
        <b-form-group label="Type of Chart Period" v-slot="{ ariaDescribedby }">
            <b-form-radio v-model="selected" @click="setChartPeridAsYear" :aria-describedby="ariaDescribedby"
                name="some-radios" value="A" ref="radio_year">Year</b-form-radio>
            <b-form-radio v-model="selected" @click="setChartPeriodAsMonth" :aria-describedby="ariaDescribedby"
                name="some-radios" value="B" ref="radio_month">Month</b-form-radio>
        </b-form-group>
        <apexchart width="500" type="line" :options="options" :series="series"></apexchart>
    </div>
</template>
