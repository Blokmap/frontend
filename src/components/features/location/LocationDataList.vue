<script lang="ts" setup>
import EmptyState from '@/components/shared/molecules/EmptyState.vue';
import { computed } from 'vue';
import type { Location } from '@/domain/location';

const props = withDefaults(
    defineProps<{
        locations?: Location[];
        loading?: boolean;
        emptyMessage?: string;
        emptyTitle?: string;
    }>(),
    {
        loading: false,
        emptyMessage: 'Geen locaties gevonden',
    },
);

const isEmpty = computed(() => {
    return !props.locations || props.locations.length === 0;
});
</script>

<template>
    <div class="location-data-list">
        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col gap-4">
            <!-- TODO: Add loading skeleton items -->
        </div>

        <!-- Empty State -->
        <EmptyState v-else-if="isEmpty" :message="emptyMessage" :title="emptyTitle">
            <template #actions>
                <slot name="empty-actions"></slot>
            </template>
        </EmptyState>

        <!-- Content -->
        <div v-else class="flex flex-col gap-4">
            <slot v-for="location in locations" :key="location.id" :location="location" name="item">
            </slot>
        </div>
    </div>
</template>
