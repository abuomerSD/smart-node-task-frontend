<script>
import Slider from "@vueform/slider";

import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";

/**
 * Range-slider component
 */
export default {
  components: { Slider, Layout, PageHeader },
  data() {
    return {
      simpleValue: 10,
      sliderCustomzie: 300,
      sliderWithLabel: {
        value: 45,
        data: [15, 30, 45, 60, 75, 90, 120],
        range: [
          {
            label: "15 mins",
          },
          {
            label: "30 mins",
            isHide: true,
          },
          {
            label: "45 mins",
          },
          {
            label: "1 hr",
            isHide: true,
          },
          {
            label: "1 hr 15 mins",
          },
          {
            label: "1 hr 30 mins",
            isHide: true,
          },
          {
            label: "2 hrs",
          },
        ],
        rangeValue: {},
      },
      value: [20, 30, 40],
      merge: 10,
      format: {
        prefix: "$",
        decimals: 2,
      },
      loader: null,
      loadingValue: 0,
      customStyle: 50,
      stepData: 10,
      rtlvalue: 50,
      orientation: "vertical",
      direction: "rtl",
    };
  },
  methods: {
    /**
     * Range and label slider set range
     */
    callbackRange(val) {
      this.sliderWithLabel.rangeValue = val;
    },
    /**
     * Loading slider
     */
    startLoad() {
      this.loader = setInterval(() => {
        this.loadingValue++;
        if (this.loadingValue === 100) {
          clearInterval(this.loader);
        }
      }, 100);
    }
  }
};
</script>

<template>
  <Layout>
    <PageHeader title="Range Slider" pageTitle="UI Elements" />

    <BRow>
      <BCol cols="12">
        <BCard no-body>
          <BCardBody>
            <BCardTitle>Range slider</BCardTitle>
            <p class="card-title-desc">Cool, comfortable, responsive and easily customizable range slider</p>
            <BRow>
              <BCol md="6">
                <div class="p-3">
                  <h5 class="font-size-14 mb-3 mt-0">Default</h5>
                  <div class="p-3">
                    <Slider v-model="simpleValue" />
                  </div>
                </div>
              </BCol>
              <BCol md="6">
                <div class="p-3">
                  <h5 class="font-size-14 mb-3 mt-0">Min-Max</h5>
                  <div class="p-3">
                    <Slider v-model="sliderCustomzie" :min="100" :max="500" />
                  </div>
                </div>
              </BCol>
            </BRow>
            <BRow>
              <BCol md="6">
                <div class="p-3">
                  <h5 class="font-size-14 mb-3 mt-0">Range and Label</h5>
                  <div class="p-3">
                    <Slider v-model="sliderWithLabel.value" :data="sliderWithLabel.data" :range="sliderWithLabel.range" @callbackRange="callbackRange" />
                  </div>
                </div>
              </BCol>
              <BCol md="6">
                <div class="p-3">
                  <h5 class="font-size-14 mb-3 mt-0">Loading</h5>
                  <div class="p-3">
                    <Slider v-model="loadingValue" :is-disabled="true" class="slider-red" />
                    <br />
                    <BButton size="sm" variant="light" @click="startLoad">Start</BButton>
                  </div>
                </div>
              </BCol>
            </BRow>
            <BRow>
              <BCol md="6">
                <div class="p-3">
                  <h5 class="font-size-14 mb-3 mt-0">Rtl</h5>
                  <div class="p-3">
                    <Slider v-model="rtlvalue" :direction="direction" :orientation="orientation" />
                  </div>
                </div>
              </BCol>
              <BCol md="6">
                <div class="p-3">
                  <h5 class="font-size-14 mb-3 mt-0">Format</h5>
                  <div class="p-3">
                    <Slider v-model="value" :merge="merge" :format="format" />
                  </div>
                </div>
              </BCol>
            </BRow>
          </BCardBody>
        </BCard>
      </BCol>
    </BRow>
  </Layout>
</template>

<style src="@vueform/slider/themes/default.css"></style>