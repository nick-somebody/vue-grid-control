<template>
  <div>
    <h2>
      Conditional Active Cells
    </h2>
    <grid-control
      @click-cell-control="clickCell"
      @focus-cell-control="focusCell"
      @blur-cell-control="blurCell"
      @blur-grid="blurGrid"
      :columns="headers.length"
      :rows="records.length"
      :records="records"
      :headers="headers"
      :disable-cell-func="(colIdx, rowIdx) => (records[rowIdx][headers[colIdx]])"
      control-tag="button"
      class="grid-control">
      <template v-slot="{value}">
        {{ value }}
      </template>
    </grid-control>
  </div>
</template>

<script>
import GridControl from "../src/components/GridControl.vue";

export default {
  name: "App",
  components: {
    GridControl
  },
  data() {
    return {
      headers: ["mon", "tue", "wed", "thu", "fri", "sat", "sun"],
      records: [
        { "mon": true, "tue": false, "wed": false, "thu": false, "fri": true, "sat": false, "sun": true, },
        { "mon": true, "tue": false, "wed": false, "thu": false, "fri": true, "sat": false, "sun": true, },
        { "mon": true, "tue": true, "wed": false, "thu": false, "fri": true, "sat": false, "sun": true, },
        { "mon": true, "tue": false, "wed": false, "thu": false, "fri": true, "sat": false, "sun": true, },
        { "mon": false, "tue": false, "wed": false, "thu": false, "fri": true, "sat": false, "sun": true, },
        { "mon": true, "tue": true, "wed": true, "thu": true, "fri": true, "sat": true, "sun": true, },
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
};
</script>
