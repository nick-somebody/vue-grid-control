import { setFirstCol, setFirstRow, setGridEnabledCellInfo } from "@/helpers";
import {
  onMounted,
  ref,
  computed,
  reactive,
  watchEffect,
  defineComponent,
  UnwrapRef,
  Ref,
  ComputedRef
} from "vue";
import {
  CellControlEvent,
  DisableCellFunc,
  GetFocusedCellElementFunc,
  RangeGrid
} from "./grid";

const makeGridMap = (props: any): ComputedRef<RangeGrid> => {
  const hasRecords = !!props.records;

  return computed<RangeGrid>(() => {
    const grid: RangeGrid = {
      map: {},
      rows: {}, // 2D array of enabled cells by row
      cols: {}, // 2D array of enabled cells by column
      lastPosition: [-1, -1], // last  enabled position in grid
      firstPosition: [-1, -1], // first  enabled position in grid
      rangeStart: [-1, -1],
      rangeEnd: [-1, -1]
    };
    let inRange = false;
    for (let rowIdx = 0; rowIdx < props.rows; rowIdx++) {
      const record = hasRecords ? props.records[rowIdx] : {};
      grid.map[rowIdx] = {};
      grid.rows[rowIdx] = [];
      for (let colIdx = 0; colIdx < props.columns; colIdx++) {
        let key = String(colIdx);
        let value = colIdx;
        if (hasRecords) {
          const keys = Object.keys(record);
          key = keys[colIdx];
          value = record[key];
        }
        const isStart = value === props.start;
        if (isStart) {
          grid.rangeStart = [colIdx, rowIdx];
          // inRange can only be true if there is an end
          inRange = !!props.end;
        }
        const disabled = props.disableCellFunc(colIdx, rowIdx, value, record);
        grid.map[rowIdx][colIdx] = {
          key,
          value,
          disabled,
          colIdx,
          rowIdx,
          inRange,
          rowData: record
        };
        if (value === props.end) {
          grid.rangeEnd = [colIdx, rowIdx];
          inRange = false;
        }
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
      "update:start": null,
      "update:end": null,
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
      headers: {},
      // pass a function that will be given the following arguments
      // colIdx, rowIdx, value, rowData
      // a return value of true will disable this cell
      disableCellFunc: {
        default: () => () => false
      },
      start: {},
      end: {}
    },
    setup(props) {
      const gridBody = ref<unknown | HTMLElement>(null);

      const gridMap = makeGridMap(props);

      const data = reactive({
        focusedRow: -1,
        focusedCol: -1,
        firstSelectRow: -1,
        firstSelectCol: -1,
        gridBody,
        gridMap,
        startEvent: null as any
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
      isRangeStart(
        event1: CellControlEvent,
        event2: CellControlEvent
      ): boolean {
        if (event1.rowIdx < event2.rowIdx) {
          return true;
        }
        if (event1.rowIdx > event2.rowIdx) {
          return false;
        }
        return event1.colIdx < event2.colIdx;
      },
      emitModel(cellEvent: CellControlEvent) {
        if (!this.startEvent) {
          this.$emit("update:start", cellEvent.value);
          this.$emit("update:end", null);
          this.startEvent = cellEvent;
        } else {
          if (this.isRangeStart(this.startEvent, cellEvent)) {
            this.$emit("update:start", this.startEvent.value);
            this.$emit("update:end", cellEvent.value);
          } else {
            this.$emit("update:start", cellEvent.value);
            this.$emit("update:end", this.startEvent.value);
          }
          this.startEvent = null;
        }
      },
      select(cellEvent: CellControlEvent, keyEvent: KeyboardEvent) {
        if (cellEvent.disabled) {
          return;
        }
        this.emitModel(cellEvent);
      },
      // for select, need to check if selected already
      shiftClickControl(cellEvent: CellControlEvent) {
        if (cellEvent.disabled) {
          return;
        }
        // shift is for range select
        this.$emit("shift-click-cell-control", cellEvent);
      },
      ctrlClickControl(cellEvent: CellControlEvent) {
        if (cellEvent.disabled) {
          return;
        }
        // ctrl is for multi select
        this.$emit("ctrl-click-cell-control", cellEvent);
      },
      getValueAt(place: { colIdx: number; rowIdx: number }) {
        return this.gridMap.map[place.rowIdx][place.colIdx];
      },
      clickCellControl(cellEvent: CellControlEvent) {
        if (cellEvent.disabled) {
          return;
        }
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
        const [startCol, startRow] = this.gridMap.rangeStart;
        const col = [...this.gridMap.cols[this.focusedCol]];
        if (startCol === this.focusedCol) {
          // have to search for next value if target is startRow`
        }
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
