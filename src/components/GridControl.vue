<template>
  <table role="grid" :aria-colcount="columns" @blur="blurGrid">
    <thead v-if="headers">
      <tr>
        <th v-for="(header, idx) in headers" :key="idx">
          {{header}}
        </th>
      </tr>
    </thead>
    <tbody ref="gridBody">
      <tr
        v-for="(gridRow, rowKey, rowIdx) in gridMap.map"
        :key="rowIdx"
        :aria-rowindex="rowIdx"
      >
        <td
          v-for="(cell, colKey, colIdx) in gridRow"
          :key="`${rowIdx}-${colIdx}`"
          role="gridcell"
        >
          <component
            :is="cellTag"
            :tabindex="cell.disabled ? -1 : 0"
            :disabled="cell.disabled"
            :aria-colindex="colIdx"
            @keydown.up.prevent="moveUp"
            @keydown.down.prevent="moveDown"
            @keydown.left.prevent="moveLeft"
            @keydown.right.prevent="moveRight"
            @keydown.exact.home.prevent="moveRowStart"
            @keydown.exact.end.prevent="moveRowEnd"
            @keydown.exact.ctrl.home.prevent="moveGridStart"
            @keydown.exact.ctrl.end.prevent="moveGridEnd"
            @keydown.exact.page-up.prevent="moveColStart"
            @keydown.exact.page-down.prevent="moveColEnd"
            @focus.stop="focusCellControl(cell)"
            @blur.stop="blurCellControl(cell)"
            @click="clickCellControl(cell)"
            class="cell-control"
            :class="{
              'focused-col': focusedCol === colIdx,
              'focused-row': focusedRow === rowIdx,
            }"
            >
            
            <slot v-bind="cell">
              {{ cell.value }}
            </slot>
          </component>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { onMounted, ref, computed, reactive, watchEffect } from "vue";

const setFirstCol = (grid, colIdx) => {
  if (grid.firstPosition[0] < 0) {
    grid.firstPosition[0] = colIdx
  }
}
const setFirstRow = (grid, rowIdx) => {
  if (grid.firstPosition[1] < 0) {
    grid.firstPosition[1] = rowIdx
  }
}

const makeGridMap = (rows, columns, records, headers, disableCellFunc) => {
  const hasRecords = !!records
  const hasColumns = !!headers

  return computed(() => {
    const grid = {
      map: {},
      rows: {},
      cols: {},
      lastPosition: [-1, -1],
      firstPosition: [-1, -1],
    }
    for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
      const record = hasRecords ? records[rowIdx] : {};
      grid.map[rowIdx] = {}
      grid.rows[rowIdx] = []
      let colEntries = {}
      for (let colIdx = 0; colIdx < columns; colIdx++) {
        const value = hasRecords && hasColumns ? record[headers[colIdx]] : colIdx;
        const disabled = disableCellFunc(colIdx, rowIdx, value, record)
        grid.map[rowIdx][colIdx] = {
          value,
          disabled,
          colIdx,
          rowIdx,
          rowData: record,
        }
        if (!grid.cols[colIdx]) { grid.cols[colIdx] = [] }
        if (!disabled) {
          // console.log("enabled")
          grid.rows[rowIdx].push(colIdx)
          colEntries[colIdx] = rowIdx
          grid.cols[colIdx].push(rowIdx)
          
          setFirstCol(grid, colIdx)
          setFirstRow(grid, rowIdx)
          grid.lastPosition[0] = colIdx
          grid.lastPosition[1] = rowIdx
        }
      }
    }
    return grid
  })
}

// next thing to do is to make the collision detection better
// make a computed array of valid fields
export default {
  props: {
    columns: {
      required: true,
    },
    rows: {
      required: true,
    },
    cellTag: {
      default: 'div'
    },
    records: { default: null},
    headers: {},
    // pass a function that will be given the following arguments
    // colIdx, rowIdx, value, rowData
    // a return value of true will disable this cell
    disableCellFunc: {
      default: () => (() => false)
    }
  },
  setup(props) {
    const gridBody = ref(null)

    const gridMap = makeGridMap(
      props.rows,
      props.columns,
      props.records,
      props.headers,
      props.disableCellFunc
    )

    const data = reactive({
      focusedRow: -1,
      focusedCol: -1,
      gridBody,
      gridMap
    })

    onMounted(() => {
      watchEffect(() => {
        if (data.focusedRow >= 0 && data.focusedCol >= 0) {
          gridBody.value.children[data.focusedRow].children[data.focusedCol].firstChild.focus()
        }
      })
    })

    return data
  },
  methods: {
    clickCellControl({ colIdx, rowIdx, value, rowData }) {
      this.$emit("click-cell-control", { colIdx, rowIdx, value, rowData })
    },
    focusCellControl({ colIdx, rowIdx, value, rowData }) {
      this.focusedRow = rowIdx
      this.focusedCol = colIdx
      this.$emit("focus-cell-control", { colIdx, rowIdx, value, rowData })
    },
    blurCellControl({ colIdx, rowIdx, value, rowData }) {
      // if we do not get a changed index, focus has left the grid
      this.$emit("blur-cell-control", { colIdx, rowIdx, value, rowData })
      setTimeout(() => {
        if (this.focusedRow === rowIdx && this.focusedCol === colIdx) {
          this.blurGrid()
        }
      }, 0)
    },
    clearFocus() {
      this.focusedRow = -1
      this.focusedCol = -1
    },
    blurGrid() {
      this.clearFocus()
      this.$emit("blur-grid")
    },
    moveUp() {
      const col = this.gridMap.cols[this.focusedCol]
      const enabledCellIdx = col.indexOf(this.focusedRow)
      if (enabledCellIdx > 0) {
        this.focusedRow = col[enabledCellIdx - 1]
      }
    },
    moveDown() {
      const col = this.gridMap.cols[this.focusedCol]
      const enabledCellIdx = col.indexOf(this.focusedRow)
      if (enabledCellIdx + 1 < col.length) {
        this.focusedRow = col[enabledCellIdx + 1]
      }
    },
    moveLeft() {
      let row = this.gridMap.rows[this.focusedRow]
      const enabledCellIdx = row.indexOf(this.focusedCol)
      // console.log(row, enabledCellIdx)

      if (enabledCellIdx > 0) {
        this.focusedCol = row[enabledCellIdx - 1]
      } else {
        let targetRow = this.focusedRow - 1
        while (this.gridMap.rows[targetRow]) {
          row = this.gridMap.rows[targetRow]
          if (row.length) {
            this.focusedRow = targetRow
            this.focusedCol = row[row.length - 1]
            break
          }
          targetRow -= 1
        }
      }
    },
    moveRight() {
      let row = this.gridMap.rows[this.focusedRow]
      const enabledCellIdx = row.indexOf(this.focusedCol)
      if (enabledCellIdx + 1 < row.length) {
        this.focusedCol = row[enabledCellIdx + 1]
      } else {
        let targetRow = this.focusedRow + 1
        while (this.gridMap.rows[targetRow]) {
          row = this.gridMap.rows[targetRow]
          if (row.length) {
            this.focusedRow = targetRow
            this.focusedCol = row[0]
            break
          }
          targetRow += 1
        }
      }
    },
    moveRowStart() {
      let row = this.gridMap.rows[this.focusedRow]
      this.focusedCol = row[0]
    },
    moveRowEnd() {
      let row = this.gridMap.rows[this.focusedRow]
      this.focusedCol = row[row.length - 1]
    },
    moveGridStart() {
      this.focusedCol = this.gridMap.firstPosition[0]
      this.focusedRow = this.gridMap.firstPosition[1]
    },
    moveGridEnd() {
      this.focusedCol = this.gridMap.lastPosition[0]
      this.focusedRow = this.gridMap.lastPosition[1]
    },
    moveColStart() {
      const col = this.gridMap.cols[this.focusedCol]
      this.focusedRow = col[0]
    },
    moveColEnd() {
      const col = this.gridMap.cols[this.focusedCol]
      this.focusedRow = col[col.length - 1]
    },
  }
}
</script>

<style scoped>
table {
  border-spacing: 0;
  border-collapse: collapse;
  width: 100%;
}
th, td {
  border: 1px solid #333;
  padding: 0;
  box-sizing: border-box;
}
button.cell-control {
  padding: 0;
  color: #000;
}
.cell-control {
  display: flexbox;
  background: #FFF;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}
.focused-row, .focused-col  {
  background: lightblue;
}
.cell-control:focus {
  background: turquoise;
  outline: 2px solid black;
}
.cell-control:disabled {
  opacity: 0.4;
}
</style>