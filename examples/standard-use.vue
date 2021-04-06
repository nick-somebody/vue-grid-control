<template>
  <div class="standard-use">
    <h2>Standard use</h2>
    <p>Click on a cell, use the keyboard controls.</p>
    <p><code>{{ `<grid-control :rows="3" :columns="3" />` }}</code></p>
    <p>The most basic use of the GridControl component</p>
    <grid-control :rows="3" :columns="3" />
  </div>
</template>

<script>
import GridControl from "../src/components/GridControl.vue";
export default {
  components: { GridControl },
}
</script>

<style>
  .standard-use table {
    border-spacing: 0;
    border-collapse: collapse;
    width: 100%;
  }
  .standard-use th,
  .standard-use td {
    border: 1px solid #333;
    padding: 0;
  }
  .standard-use td div:focus {
    background: turquoise;
  }
</style>
