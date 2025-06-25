<script setup lang="ts">
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>

<template>
    <div
        class="flex h-6 w-9 cursor-pointer items-center justify-center rounded-full bg-slate-900 drop-shadow-lg transition-transform duration-200 hover:scale-115">
        <FontAwesomeIcon :icon="faLocationDot" class="text-slate-50" />
    </div>
</template>
