export interface Grid {
  map: {
    [rowIdx: string]: {
      [colIdx: string]: any
    }
  };
  rows: {
    [rowIdx: string]: number[]
  };
  cols: {
    [colIdx: string]: number[]
  };
  lastPosition: number[2];
  firstPosition: number[2];
}
export interface RangeGrid extends Grid {
  rangeStart: number[2];
  rangeEnd: number[2];
}

export type DisableCellFunc = (
  colIdx: number,
  rowIdx: number,
  value: any,
  rowData: any
) => boolean;

export type GetFocusedCellElementFunc = (
  gridBody: HTMLElement,
  focusParams: {
    focusedRow: number;
    focusedCol: number;
    rows: number;
    columns: number;
  }
) => HTMLElement

export interface CellControlEvent {
  colIdx: number;
  rowIdx: number;
  key: string;
  value: any;
  rowData: any;
  disabled: boolean;
}