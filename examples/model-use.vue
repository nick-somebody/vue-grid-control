<template>
  <div>
    <h2>Model use</h2>
    <p>Model value: {{ val }}</p>
    <grid-control :rows="4" :columns="5" :records="records" v-model="val" />

    <h2>Range model use</h2>
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