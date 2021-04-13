<template>
  <div>
    <h1>Examples</h1>
    <h2>Keyboard controls</h2>
    <dl>
      <dt>Left key</dt>
      <dd>Previous enabled cell control</dd>

      <dt>Right key</dt>
      <dd>Next enabled cell control</dd>

      <dt>Up key</dt>
      <dd>Previous enabled cell control in column</dd>

      <dt>Down key</dt>
      <dd>Next enabled cell control in column</dd>

      <dt>Page Up key</dt>
      <dd>First enabled cell control in column</dd>

      <dt>Page Down key</dt>
      <dd>Last enabled cell control in column</dd>

      <dt>Home key</dt>
      <dd>First enabled cell control in row</dd>

      <dt>End key</dt>
      <dd>Last enabled cell control in row</dd>

      <dt>Ctrl+Home key</dt>
      <dd>First enabled cell control in grid</dd>

      <dt>Ctrl+End key</dt>
      <dd>Last enabled cell control in grid</dd>

      <dt>Tab key</dt>
      <dd>As normal</dd>
      <dt>Shift + tab key</dt>
      <dd>As normal</dd>
    </dl>
    <standard-use></standard-use>
    <model-use></model-use>
    <custom-styling></custom-styling>
    <event-handling></event-handling>
    <with-records></with-records>
    <with-headers></with-headers>
    <custom-control-tag></custom-control-tag>
    <conditional-active-cells />

    <custom-template-use />
    <slot-usage />
  </div>
</template>

<script>
import StandardUse from "../examples/standard-use.vue";
import ModelUse from "../examples/model-use.vue";
import EventHandling from "../examples/event-handling.vue";
import WithRecords from "../examples/with-records.vue";
import WithHeaders from "../examples/with-headers.vue";
import CustomControlTag from "../examples/custom-control-element.vue";
import CustomStyling from "../examples/custom-styling.vue";
import ConditionalActiveCells from "../examples/conditional-active-cells.vue";
import SlotUsage from "../examples/slot-usage.vue";
import CustomTemplateUse from "../examples/custom-template-use";

export default {
  name: "App",
  components: {
    StandardUse,
    ModelUse,
    EventHandling,
    WithRecords,
    WithHeaders,
    ConditionalActiveCells,
    CustomControlTag,
    CustomStyling,
    SlotUsage,
    CustomTemplateUse
  },
};
</script>

<style>
table {
  border-spacing: 0;
  border-collapse: collapse;
  width: 100%;
}
th, td {
  border: 1px solid #333;
  padding: 0;
}
button.cell-control {
  padding: 0;
  color: #000;
}
.cell-control {
  width: 100%;
  height: 100%;
}
.focused-row,
.focused-col,
.focused-row > *,
.focused-col > * {
  background: lightblue;
}
.focused-row.focused-col,
.focused-row.focused-col > * {
  background: turquoise;
  outline: 2px solid black;
}
.cell-control:disabled {
  opacity: 0.4;
}
.in-range,
.in-range > *{
  background: rgb(200, 255, 200);
}
.focused-row.focused-col.selected,
.selected,
.focused-row.focused-col.selected > *,
.selected > * {
  background: chartreuse;
}
</style>