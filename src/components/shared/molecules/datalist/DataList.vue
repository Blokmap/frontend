<script lang="ts" generic="T" setup>
import Skeleton from 'primevue/skeleton';
import EmptyState from '../EmptyState.vue';

defineProps<{
    items: T[] | undefined;
    loading?: boolean;
}>();
</script>

<template>
    <div class="flex flex-col gap-4">
        <slot v-if="loading" name="loading">
            <Skeleton v-for="_ in 5"></Skeleton>
        </slot>
        <slot v-else-if="!items || items.length === 0" name="empty">
            <EmptyState message="Geen items gevonden"></EmptyState>
        </slot>
        <slot v-else v-for="item in items" name="item" :item="item"> </slot>
    </div>
</template>
