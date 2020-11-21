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
    </dl>
    <standard-use></standard-use>
    <event-handling></event-handling>
    <custom-control-tag></custom-control-tag>
    <conditional-active-cells />
    <slot-usage />
  </div>
</template>

<script>
import StandardUse from "../examples/standard-use.vue";
import EventHandling from "../examples/event-handling.vue";
import CustomControlTag from "../examples/custom-control-element.vue";
import ConditionalActiveCells from "../examples/conditional-active-cells.vue";
import SlotUsage from "../examples/slot-usage.vue";

export default {
  name: "App",
  components: {
    StandardUse,
    EventHandling,
    ConditionalActiveCells,
    CustomControlTag,
    SlotUsage
  },
};
</script>
