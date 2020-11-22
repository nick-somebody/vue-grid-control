<template>
  <div>
    <h2>Custom control element</h2>
    <p>The default is div but this example has passed a h1 tag. You can pass your own custom component, it would just need to be globally registered.</p>
    <grid-control :rows="3" :columns="3" control-tag="h1" />
  </div>
</template>

<script>
import GridControl from "../src/components/GridControl.vue";
export default {
  components: { GridControl },
}
</script>