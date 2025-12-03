<script lang="ts" setup>
import { AxiosError } from 'axios';

defineProps<{
    error?: AxiosError | null;
}>();
</script>

<template>
    {{ error }}
</template>
