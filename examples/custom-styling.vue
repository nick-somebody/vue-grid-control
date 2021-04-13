<template>
  <div>
    <h2>Custom styling</h2>
    <p>
      The GridControl component has styling classes applied.
      You can style accordingly.
    </p>
    <ul>
      <li><code>.focused-row</code> - to style a row in focus</li>
      <li><code>.focused-col</code> - to style a column in focus</li>
      <li><code>.header-focused-col</code> - to style a column in focus's header</li>
      <li><code>.cell-control</code> - is the class applied to the control that is focused</li>
    </ul>
    <grid-control class="griddy" :headers="['1', '2', '3', '4', '5', '6', '7', '8']" :rows="5" :columns="8" />
  </div>
</template>

<script>
import GridControl from "../src/components/GridControl.vue";
export default {
  components: { GridControl },
}
</script>
<style scoped>
.griddy {
  width: 50%;
  border-spacing: 10px;
  border-collapse: unset;
}
.griddy >>> th {
  border: 1px solid white;
  padding: 5px;
  background: black;
  color: white;
}
.griddy >>> th.header-focused-col {
  background: rgb(0, 0, 100);
}
.griddy >>> td {
  border: 1px solid black;
}
.griddy >>> .cell-control {
  background: lightblue;
  width: 100%;
  height: 100%;
}
.griddy >>> .focused-row {
  background: lightskyblue;
  outline: 4px solid blue;
  outline-style: groove;
  outline-offset: 3px;
}
.griddy >>> .focused-col  {
  background: lightskyblue;
  outline: 4px solid blue;
  outline-style: groove;
  outline-offset: 4px;
}
.griddy >>> .cell-control:focus {
  background: darkblue;
  color: white;
  outline: 4px solid black;
  outline-offset: 3px;
}
.griddy >>> .cell-control:disabled {
  opacity: 0.4;
}
</style>