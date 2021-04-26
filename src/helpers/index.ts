import { Grid } from "@/components/grid";

export const setFirstCol = (grid: Grid, colIdx: number) => {
  if (grid.firstPosition[0] < 0) {
    grid.firstPosition[0] = colIdx;
  }
};

export const setFirstRow = (grid: Grid, rowIdx: number) => {
  if (grid.firstPosition[1] < 0) {
    grid.firstPosition[1] = rowIdx;
  }
};

export const setGridEnabledCellInfo = (
  grid: Grid,
  colIdx: number,
  rowIdx: number
) => {
  grid.rows[rowIdx].push(colIdx);
  grid.cols[colIdx].push(rowIdx);

  setFirstCol(grid, colIdx);
  setFirstRow(grid, rowIdx);

  grid.lastPosition = [colIdx, rowIdx];
};
