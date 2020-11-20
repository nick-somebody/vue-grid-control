<template>
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
      cell-tag="button"
      class="grid-control">
      <template v-slot="{value}">
        {{ value }}
      </template>
    </grid-control>
</template>

<script>
import GridControl from "./components/GridControl.vue";

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
    clickCell({ colIdx, rowIdx, value, rowData }) {
      console.log("clickCell", { colIdx, rowIdx, value, rowData })
    },
    focusCell({ colIdx, rowIdx, value, rowData }) {
      console.log("focusCell", { colIdx, rowIdx, value, rowData })
    },
    blurCell({ colIdx, rowIdx, value, rowData }) {
      console.log("blurCell", { colIdx, rowIdx, value, rowData })
    },
    blurGrid() {
      console.log("blurGrid")
    }
  }
};
</script>
