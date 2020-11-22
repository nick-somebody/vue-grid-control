<template>
  <table role="grid" :aria-colcount="columns" @blur="blurGrid">
    <thead v-if="headers">
      <tr>
        <th
          v-for="(header, idx) in headers"
          :key="idx"
          :class="{'header-focused-col': focusedCol === idx}">
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
          :class="{
            'focused-col': focusedCol === colIdx,
            'focused-row': focusedRow === rowIdx,
          }"
        >
          <component
            :is="controlTag"
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
import GridControl from './GridControl'

const getFocusedCellElement = (gridBody, { focusedRow, focusedCol }) => {
  return gridBody.value.children[focusedRow].children[focusedCol].firstChild
}

export default GridControl(getFocusedCellElement)
</script>