<template>
  <div>
    <h2>Model use</h2>
    <p>Model value: {{ val }}</p>
    <grid-control :rows="3" :columns="3" :records="records" v-model="val" />

    <h2>Range model use</h2>
    <p>Start value: {{ start }}; End value: {{ end }}</p>
    <grid-control :rows="3" :columns="3" :records="records" v-model:start="start" v-model:end="end" />
  </div>
</template>

<script>
import { ref } from 'vue';
import GridControl from "../src/components/GridControl.vue";
export default {
  components: { GridControl },
  setup() {
    const val = ref(null)
    const start = ref(null)
    const end = ref(null)
    const records = [
      {'column1': '1, 1', 'column2': '2, 1', 'column3': '3, 1'},
      {'column1': '1, 2', 'column2': '2, 2', 'column3': '3, 2'},
      {'column1': '1, 3', 'column2': '2, 3', 'column3': '3, 3'},
    ]
    return { val, records, start, end }
  }
}
</script>