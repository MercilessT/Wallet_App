<template>
  <div class="app-container">
    <app-header></app-header>
    <router-view />
    <!--    <app-footer class="shadow-top" />-->
  </div>
</template>

<script setup>
import AppHeader from './components/layout/AppHeader.vue'
// import AppFooter from './components/layout/AppFooter.vue'
</script>

<style>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #B9E5FE;
}
</style>
