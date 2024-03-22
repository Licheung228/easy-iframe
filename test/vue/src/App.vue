<script setup lang="ts">
import { ref } from 'vue'
import HelloWorld from './components/HelloWorld.vue'

const simulateRoute = ref(true)
</script>

<template>
  <button @click="() => (simulateRoute = !simulateRoute)">
    changeRoute
  </button>
  <HelloWorld v-if="simulateRoute" />
  <div v-else>
    <h1>Here is nothing</h1>
  </div>
</template>

<style scoped></style>
