<template>
  <footer class="bg-gray-800 text-white py-6 mt-10">
    <div class="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm">
      <p>&copy; {{ currentYear }} Grup. Tous droits réservés.</p>
      <div class="flex space-x-4 mt-2 md:mt-0">
        <a href="#" class="hover:underline">Conditions</a>
        <a href="#" class="hover:underline">Confidentialité</a>
        <a href="#" class="hover:underline">Contact</a>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>
