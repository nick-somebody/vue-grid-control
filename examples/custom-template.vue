<template>
  <div class="grid" ref="gridBody">
    <template v-for="(gridRow, rowKey, rowIdx) in gridMap.map">
      <div
        tabindex="0"
        v-for="(cell, colKey, colIdx) in gridRow"
        :key="`${colIdx}-${rowIdx}`"
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
        :style="{
          gridColumn: colIdx + 1,
          gridRow: rowIdx + 1
        }">
        {{ cell.value }}
      </div>
    </template>
  </div>
</template>

<script>
import GridControl from '../src/components/GridControl'

const getFocusedCellElement = (gridBody, { focusedRow, focusedCol, rows, columns }) => {
  // this function is the one that will traverse your template for the cell to focus
  return gridBody.value.children[focusedRow * columns + focusedCol]
}

export default GridControl(getFocusedCellElement)
</script>

<style scoped>
.grid {
  display: grid;
  column-gap: 50px;
  row-gap: 10px;
  width: 100%;
}
.cell-control {
  width: 100%;
  height: 20px;
  padding: 5px 0;
  border-radius: 20px;
  text-align: center;
  border: 1px solid blue;
}
</style>