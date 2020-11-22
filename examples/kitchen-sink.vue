<template>
  <div>
    <h2>Kitchen sink</h2>
    <grid-control
      :rows="5"
      :columns="7"
      :headers="headers"
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
      headers: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
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