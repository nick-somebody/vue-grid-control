<template>
  <div>
    <h2>With records</h2>
    <grid-control
      :rows="3"
      :columns="3"
      :records="records"

      control-tag="button"
      @click-cell-control="clickCell"
      @focus-cell-control="focusCell"
      @blur-cell-control="blurCell"
      @blur-grid="blurGrid" />
  </div>
</template>

<script>
import GridControl from "../src/components/GridControl.vue";
export default {
  components: { GridControl },
  setup() {
    return {
      records: [
        {'column1': '1, 1', 'column2': '2, 1', 'column3': '3, 1'},
        {'column1': '1, 2', 'column2': '2, 2', 'column3': '3, 2'},
        {'column1': '1, 3', 'column2': '2, 3', 'column3': '3, 3'},
      ]
    }
  },
  methods: {
    clickCell({ colIdx, rowIdx, key, value, rowData }) {
      console.log("clickCell", { colIdx, rowIdx, key, value, rowData })
    },
    focusCell({ colIdx, rowIdx, key, value, rowData }) {
      console.log("focusCell", { colIdx, rowIdx, key, value, rowData })
    },
    blurCell({ colIdx, rowIdx, key, value, rowData }) {
      console.log("blurCell", { colIdx, rowIdx, key, value, rowData })
    },
    blurGrid() {
      console.log("blurGrid")
    }
  }
}
</script>