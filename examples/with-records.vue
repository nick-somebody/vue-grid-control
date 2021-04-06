<template>
  <div>
    <h2>With records</h2>
    <p>
      If we pass some records the value will be the corresponding value in the record set.
      eg.
      <pre><code>{{`<grid-control
  :rows="records.length"
  :columns="3"
  :records="records"
  control-tag="button" />`}}</code></pre>
  Where the records are
  <pre><code>{{`[
  {'column1': 'row1, column1', 'column2': 'row1, column2', 'column3': 'row1, column3'},
  {'column1': 'row2, column1', 'column2': 'row2, column2', 'column3': 'row2, column3'},
  {'column1': 'row3, column1', 'column2': 'row3, column2', 'column3': 'row3, column3'},
]`}}</code></pre>
    </p>
    <grid-control
      :rows="records.length"
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
        {'column1': 'row1, column1', 'column2': 'row1, column2', 'column3': 'row1, column3'},
        {'column1': 'row2, column1', 'column2': 'row2, column2', 'column3': 'row2, column3'},
        {'column1': 'row3, column1', 'column2': 'row3, column2', 'column3': 'row3, column3'},
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