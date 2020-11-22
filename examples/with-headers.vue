<template>
  <div>
    <h2>With headers</h2>
    <grid-control
      :rows="3"
      :columns="3"
      :headers="headers"
      :records="records"
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
      headers: ['Column 1', 'Column 2', 'Column 3'],
      records: [
        {'column1': 'column1, row1', 'column2': 'column2, row1', 'column3': 'column3, row1'},
        {'column1': 'column1, row2', 'column2': 'column2, row2', 'column3': 'column3, row2'},
        {'column1': 'column1, row3', 'column2': 'column2, row3', 'column3': 'column3, row3'},
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