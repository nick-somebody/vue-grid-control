import { setGridEnabledCellInfo } from "@/helpers";
import {
  onMounted,
  ref,
  computed,
  reactive,
  watchEffect,
  defineComponent,
  ComputedRef,
  Prop
} from "vue";
import {
  CellControlEvent,
  DisableCellFunc,
  GetFocusedCellElementFunc,
  Grid
} from "./grid";

interface Props {
  rows: number;
  columns: number;
  records: any;
  controlTag: string;
  headers: string[];
  disableCellFunc: DisableCellFunc;
}

const makeGridMap = (
  rows: number,
  columns: number,
  records: any,
  disableCellFunc: DisableCellFunc
): ComputedRef<Grid> => {
  const hasRecords = !!records;

  return computed<Grid>(() => {
    const grid: Grid = {
      map: {},
      rows: {}, // 2D array of enabled cells by row
      cols: {}, // 2D array of enabled cells by column
      lastPosition: [-1, -1], // last  enabled position in grid
      firstPosition: [-1, -1] // first  enabled position in grid
    };
    for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
      const record = hasRecords ? records[rowIdx] : {};
      grid.map[rowIdx] = {};
      grid.rows[rowIdx] = [];
      for (let colIdx = 0; colIdx < columns; colIdx++) {
        let key = String(colIdx);
        let value = colIdx;
        if (hasRecords) {
          const keys = Object.keys(record);
          key = keys[colIdx];
          value = record[key];
        }
        const disabled = disableCellFunc(colIdx, rowIdx, value, record);
        grid.map[rowIdx][colIdx] = {
          key,
          value,
          disabled,
          colIdx,
          rowIdx,
          rowData: record
        };
        if (!grid.cols[colIdx]) {
          grid.cols[colIdx] = [];
        }
        if (!disabled) {
          setGridEnabledCellInfo(grid, colIdx, rowIdx);
        }
      }
    }
    return grid;
  });
};
// possibly do different components for different styles of model
export default (getFocusedCellElement: GetFocusedCellElementFunc) => {
  return defineComponent({
    emits: {
      "update:modelValue": null,
      "shift-click-cell-control": null,
      "ctrl-click-cell-control": null,
      "click-cell-control": null,
      "focus-cell-control": null,
      "blur-cell-control": null,
      "blur-grid": null
    },
    props: {
      columns: {
        type: Number,
        required: true
      },
      rows: {
        type: Number,
        required: true
      },
      controlTag: {
        default: "div"
      },
      records: { default: null },
      headers: [],
      // pass a function that will be given the following arguments
      // colIdx, rowIdx, value, rowData
      // a return value of true will disable this cell
      disableCellFunc: {
        default: () => () => false
      },
      modelValue: {}
    },
    setup(props) {
      const gridBody = ref<unknown | HTMLElement>(null);

      const gridMap = makeGridMap(
        props.rows,
        props.columns,
        props.records,
        props.disableCellFunc
      );

      const data = reactive({
        focusedRow: -1,
        focusedCol: -1,
        firstSelectRow: -1,
        firstSelectCol: -1,
        gridBody,
        gridMap
      });

      onMounted(() => {
        watchEffect(() => {
          if (data.focusedRow >= 0 && data.focusedCol >= 0) {
            getFocusedCellElement(<any>gridBody, {
              focusedRow: data.focusedRow,
              focusedCol: data.focusedCol,
              columns: props.columns,
              rows: props.rows
            }).focus();
          }
        });
      });
      return data;
    },
    methods: {
      emitModel(cellEvent: CellControlEvent) {
        this.$emit("update:modelValue", cellEvent.value);
      },
      select(cellEvent: CellControlEvent, keyEvent: KeyboardEvent) {
        if (cellEvent.disabled) {
          return;
        }
        this.emitModel(cellEvent);
      },
      // for select, need to check if selected already
      shiftClickControl(cellEvent: CellControlEvent) {
        // shift is for range select
        this.$emit("shift-click-cell-control", cellEvent);
      },
      ctrlClickControl(cellEvent: CellControlEvent) {
        // ctrl is for multi select
        this.$emit("ctrl-click-cell-control", cellEvent);
      },
      getValueAt(place: { colIdx: number; rowIdx: number }) {
        return this.gridMap.map[place.rowIdx][place.colIdx];
      },
      clickCellControl(cellEvent: CellControlEvent) {
        this.$emit("click-cell-control", cellEvent);
        this.emitModel(cellEvent);
      },
      focusCellControl(cellEvent: CellControlEvent) {
        this.focusedRow = cellEvent.rowIdx;
        this.focusedCol = cellEvent.colIdx;
        this.$emit("focus-cell-control", cellEvent);
      },
      blurCellControl(cellEvent: CellControlEvent) {
        // if we do not get a changed index, focus has left the grid
        this.$emit("blur-cell-control", cellEvent);
        setTimeout(() => {
          if (
            this.focusedRow === cellEvent.rowIdx &&
            this.focusedCol === cellEvent.colIdx
          ) {
            this.blurGrid();
          }
        }, 0);
      },
      clearFocus() {
        this.focusedRow = -1;
        this.focusedCol = -1;
      },
      blurGrid() {
        this.clearFocus();
        this.$emit("blur-grid");
      },
      moveUp() {
        const col = this.gridMap.cols[this.focusedCol];
        const enabledCellIdx = col.indexOf(this.focusedRow);
        if (enabledCellIdx > 0) {
          this.focusedRow = col[enabledCellIdx - 1];
        }
      },
      moveDown() {
        const col = this.gridMap.cols[this.focusedCol];
        const enabledCellIdx = col.indexOf(this.focusedRow);
        if (enabledCellIdx + 1 < col.length) {
          this.focusedRow = col[enabledCellIdx + 1];
        }
      },
      moveLeft() {
        let row = this.gridMap.rows[this.focusedRow];
        const enabledCellIdx = row.indexOf(this.focusedCol);

        if (enabledCellIdx > 0) {
          this.focusedCol = row[enabledCellIdx - 1];
          return;
        }
        // search previous rows for cell to move to
        let targetRow = this.focusedRow - 1;
        while (this.gridMap.rows[targetRow]) {
          row = this.gridMap.rows[targetRow];
          if (row.length) {
            this.focusedRow = targetRow;
            this.focusedCol = row[row.length - 1];
            break;
          }
          targetRow -= 1;
        }
      },
      moveRight() {
        let row = this.gridMap.rows[this.focusedRow];
        const enabledCellIdx = row.indexOf(this.focusedCol);
        if (enabledCellIdx + 1 < row.length) {
          this.focusedCol = row[enabledCellIdx + 1];
          return;
        }
        // search following rows for cell to move to
        let targetRow = this.focusedRow + 1;
        while (this.gridMap.rows[targetRow]) {
          row = this.gridMap.rows[targetRow];
          if (row.length) {
            this.focusedRow = targetRow;
            this.focusedCol = row[0];
            break;
          }
          targetRow += 1;
        }
      },
      moveRowStart() {
        let row = this.gridMap.rows[this.focusedRow];
        this.focusedCol = row[0];
      },
      moveRowEnd() {
        let row = this.gridMap.rows[this.focusedRow];
        this.focusedCol = row[row.length - 1];
      },
      moveGridStart() {
        this.focusedCol = this.gridMap.firstPosition[0];
        this.focusedRow = this.gridMap.firstPosition[1];
      },
      moveGridEnd() {
        this.focusedCol = this.gridMap.lastPosition[0];
        this.focusedRow = this.gridMap.lastPosition[1];
      },
      moveColStart() {
        const col = this.gridMap.cols[this.focusedCol];
        this.focusedRow = col[0];
      },
      moveColEnd() {
        const col = this.gridMap.cols[this.focusedCol];
        this.focusedRow = col[col.length - 1];
      }
    }
  });
};
