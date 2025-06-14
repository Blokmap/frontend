<script setup lang="ts">
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>

<template>
    <div
        class="cursor-pointer w-8 h-5 rounded-full bg-slate-50 drop-shadow-lg flex items-center justify-center transition-transform duration-200 hover:scale-125">
        <FontAwesomeIcon :icon="faLocationDot" class="text-secondary" />
    </div>
</template>
