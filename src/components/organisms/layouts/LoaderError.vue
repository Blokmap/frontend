<script lang="ts" setup>
import { AxiosError } from 'axios';

defineProps<{
    errors?: (AxiosError | null)[];
}>();
</script>

<template>
    {{ errors }}
</template>
