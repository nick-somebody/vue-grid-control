<template>
  <div>
    <h2>Custom template</h2>
    <my-grid :rows="5" :columns="5" />
  </div>
</template>

<script>
import CustomTemplate from "./custom-template.vue";
export default {
  components: { MyGrid: CustomTemplate },
}
</script>