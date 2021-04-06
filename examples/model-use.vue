<template>
  <div class="model-use">
    <h2>Model use</h2>
    <p>Using the GridControl component with v-model</p>
    <p><code>{{`<grid-control :rows="4" :columns="5" :records="records" v-model="val" />`}}</code></p>
    <p>You get the <code>.selected</code> class applied to the v-model value cell.</p>
    <p>Model value: {{ val }}</p>
    <grid-control :rows="4" :columns="5" :records="records" v-model="val" />

    <h2>Range model use</h2>
    <p>Using the GridRangeControl component with v-model:start and v-model:end</p>
    <p><code>{{ `<grid-range-control :rows="4" :columns="5" :records="records" v-model:start="start" v-model:end="end" />` }}</code></p>
    <p>When using the GridRangeControl, as well as the <code>.selected</code> class, you get the <code>.in-range</code> class.</p>
    <p>Start value: {{ start }}; End value: {{ end }}</p>
    <grid-range-control :rows="4" :columns="5" :records="records" v-model:start="start" v-model:end="end" />
  </div>
</template>

<script>
import { ref } from 'vue';
import GridControl from "../src/components/GridControl.vue";
import GridRangeControl from "../src/components/GridRangeControl.vue";

export default {
  components: { GridControl, GridRangeControl },
  setup() {
    const val = ref(null)
    const start = ref(null)
    const end = ref(null)
    const records = [
      {'column1': '1, 1', 'column2': '2, 1', 'column3': '3, 1', 'column4': '4, 1', 'column5': '5, 1'},
      {'column1': '1, 2', 'column2': '2, 2', 'column3': '3, 2', 'column4': '4, 2', 'column5': '5, 2'},
      {'column1': '1, 3', 'column2': '2, 3', 'column3': '3, 3', 'column4': '4, 3', 'column5': '5, 3'},
      {'column1': '1, 4', 'column2': '2, 4', 'column3': '3, 4', 'column4': '4, 4', 'column5': '5, 4'},
    ]
    return { val, records, start, end }
  }
}
</script>

<style>
  .model-use table {
    border-spacing: 0;
    border-collapse: collapse;
    width: 100%;
  }
  .model-use th,
  .model-use td {
    border: 1px solid #333;
    padding: 0;
  }
  .model-use td div:focus {
    outline: 3px solid darkblue;
    outline-offset: 2px;
  }
  .model-use .in-range,
  .model-use .in-range > *{
    background: rgb(200, 255, 200);
  }
  .model-use .selected > * {
    background: chartreuse;
  }
</style>