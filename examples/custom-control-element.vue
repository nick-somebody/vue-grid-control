<template>
  <div>
    <h2>Custom control element</h2>
    <grid-control :rows="3" :columns="3" control-tag="h1" />
  </div>
</template>

<script>
import GridControl from "../src/components/GridControl.vue";
export default {
  components: { GridControl },
}
</script>