<script setup lang="ts">
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>

<template>
    <div
        class="flex h-5 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-50 drop-shadow-lg transition-transform duration-200 hover:scale-125">
        <FontAwesomeIcon :icon="faLocationDot" class="text-slate-800" />
    </div>
</template>
