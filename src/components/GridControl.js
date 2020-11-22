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

const makeGridMap = (rows, columns, records, disableCellFunc) => {
  const hasRecords = !!records

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
      for (let colIdx = 0; colIdx < columns; colIdx++) {
        
        let key = String(colIdx)
        let value = colIdx
        if (hasRecords) {
          const keys = Object.keys(record) 
          key = keys[colIdx]
          value = record[key]
        }
        const disabled = disableCellFunc(colIdx, rowIdx, value, record)
        grid.map[rowIdx][colIdx] = {
          key,
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
          grid.cols[colIdx].push(rowIdx)
          
          setFirstCol(grid, colIdx)
          setFirstRow(grid, rowIdx)

          grid.lastPosition = [colIdx, rowIdx]
        }
      }
    }
    return grid
  })
}

export default (getFocusedCellElement) => {
  return {
    props: {
      columns: {
        required: true,
      },
      rows: {
        required: true,
      },
      controlTag: {
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
            getFocusedCellElement(gridBody, {
              focusedRow: data.focusedRow,
              focusedCol: data.focusedCol,
              columns: props.columns,
              rows: props.rows,
            }).focus()
          }
        })
      })
  
      return data
    },
    methods: {
      clickCellControl({ colIdx, rowIdx, key, value, rowData }) {
        this.$emit("click-cell-control", { colIdx, rowIdx, key, value, rowData })
      },
      focusCellControl({ colIdx, rowIdx, key, value, rowData }) {
        this.focusedRow = rowIdx
        this.focusedCol = colIdx
        this.$emit("focus-cell-control", { colIdx, rowIdx, key, value, rowData })
      },
      blurCellControl({ colIdx, rowIdx, key, value, rowData }) {
        // if we do not get a changed index, focus has left the grid
        this.$emit("blur-cell-control", { colIdx, rowIdx, key, value, rowData })
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
}