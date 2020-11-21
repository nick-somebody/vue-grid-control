<template>
  <div>
    <h2>Standard use</h2>
    <grid-control :rows="3" :columns="3" />
  </div>
</template>

<script>
import GridControl from "../src/components/GridControl.vue";
export default {
  components: { GridControl },
}
</script>