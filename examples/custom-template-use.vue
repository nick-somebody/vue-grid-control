<template>
  <div>
    <h2>Custom template</h2>
    <p>The regular template uses tables. I've done a different one that uses a grid layout. Perhaps you're just not happy with the markup you get out of the box.</p>
    <my-grid :rows="5" :columns="5" />
  </div>
</template>

<script>
import CustomTemplate from "./custom-template.vue";
export default {
  components: { MyGrid: CustomTemplate },
}
</script>