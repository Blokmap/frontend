<script setup lang="ts">
import SearchField from '@/components/shared/atoms/SearchField.vue';

interface Props {
    title: string;
    totalCount?: number | null;
    currentCount?: number | null;
    maxCount?: number | null;
    truncated?: boolean;
    emptyMessage: string;
    searchPlaceholder: string;
    searchLoading?: boolean;
}

interface Emits {
    (e: 'search', value: string): void;
}

withDefaults(defineProps<Props>(), {
    totalCount: null,
    currentCount: null,
    maxCount: null,
    truncated: false,
    searchLoading: false,
});

const emit = defineEmits<Emits>();

const searchQuery = defineModel<string>('searchQuery', { default: '' });

const onSearchChange = () => {
    emit('search', searchQuery.value);
};
</script>

<template>
    <div class="flex items-end justify-between gap-3">
        <div class="space-y-2">
            <h1 class="text-3xl font-bold">
                {{ title }}
            </h1>

            <p class="text-sm font-normal text-slate-700">
                <template v-if="totalCount || maxCount">
                    {{ currentCount ?? '...' }} van {{ totalCount ?? maxCount ?? '...' }}
                    <template v-if="truncated">+</template> resultaten getoond.
                </template>
                <template v-else>
                    {{ emptyMessage }}
                </template>
            </p>
        </div>

        <div class="flex gap-2">
            <SearchField
                v-model="searchQuery"
                :placeholder="searchPlaceholder"
                :loading="searchLoading"
                @input="onSearchChange">
            </SearchField>

            <!-- Slot for additional actions like "New" button -->
            <slot name="actions" />
        </div>
    </div>
</template>
