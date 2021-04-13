<template>
  <div class="event-handling">
    <h2>Event handling</h2>
    <p>

    </p>
    <ul>
      <li><code>@click-cell-control</code> - When a cell is clicked</li>
      <li><code>@shift-click-cell-control</code> - When a cell is clicked with shift held</li>
      <li><code>@ctrl-click-cell-control</code> - When a cell is clicked with ctrl held</li>
      <li><code>@focus-cell-control</code> - When a cell is focused</li>
      <li><code>@blur-cell-control</code> - When a cell loses focus</li>
      <li><code>@blur-grid</code> - When the grid loses focus</li>
    </ul>
    <p>
      Each cell event will have the following payload interface
      <pre>
        <code>
{
  colIdx: number;    // column index
  rowIdx: number;    // row index
  value: any;        // the value for this cell
  rowData: any;      // the data for this row record
  disabled: boolean; // whether this cell is disabled
  key: string;       // the key to access the value from this row
}
        </code>
      </pre>
    </p>
    <grid-control
      :rows="3"
      :columns="3"
      @shift-click-cell-control="shiftClickCell"
      @ctrl-click-cell-control="ctrlClickCell"
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
    },
    shiftClickCell() {
      console.log("shiftClickCell")
    },
    ctrlClickCell() {
      console.log("ctrlClickCell")
    },
  }
}
</script>

<style>
  .event-handling table {
    border-spacing: 0;
    border-collapse: collapse;
    width: 100%;
  }
  .event-handling th,
  .event-handling td {
    border: 1px solid #333;
    padding: 0;
  }
  .event-handling .selected > * {
    background: chartreuse;
  }
  .event-handling td div:focus {
    outline: 3px solid darkblue;
    outline-offset: 2px;
  }
</style>