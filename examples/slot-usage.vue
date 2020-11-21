<template>
  <div>
    <h2>Slot usage</h2>
    <grid-control :rows="3" :columns="3">
      <template v-slot="{ colIdx, rowIdx, key, value, rowData }">
        <div style="text-align: center">
          <div>
            <strong>{{ key }}: </strong><span>{{ value }}</span>
          </div>
          <div>
            <strong>({{colIdx}}, {{rowIdx}}): </strong><span>{{ rowData }}</span>
          </div>

        </div>
      </template>
    </grid-control>
  </div>
</template>

<script>
import GridControl from "../src/components/GridControl.vue";
export default {
  components: { GridControl },
}
</script>