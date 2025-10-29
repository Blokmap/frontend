<script lang="ts" setup generic="T extends Record<string, any>, G = any">
import EmptyState from '@/components/shared/molecules/EmptyState.vue';
import TableLoadingState from '@/components/shared/molecules/table/TableLoadingState.vue';
import { computed, provide, ref } from 'vue';
import type { TableGroup } from '.';

const props = withDefaults(
    defineProps<{
        value?: T[];
        grouped?: TableGroup<T, G>[];
        loading?: boolean;
        emptyMessage?: string;
        emptyTitle?: string;
    }>(),
    {
        loading: false,
        emptyMessage: 'Geen resultaten gevonden',
    },
);

const emit = defineEmits<{
    'click:row': [rowData: T];
    'click:group': [groupData: G];
}>();

const columns = ref<string[]>([]);

const isEmpty = computed(() => {
    if (props.grouped) {
        return props.grouped.length === 0;
    }

    return !props.value || props.value.length === 0;
});

/**
 * Handle row click event.
 *
 * @param item
 */
function onRowClick(item: T) {
    emit('click:row', item);
}

/**
 * Handle group click event.
 *
 * @param group
 */
function onGroupClick(group: G) {
    emit('click:group', group);
}

provide('registerColumn', (column: string) => {
    if (!columns.value.includes(column)) {
        columns.value.push(column);
    }
});
</script>

<template>
    <!-- Loading State -->
    <TableLoadingState v-if="loading" :columns="columns.length || 4" />

    <!-- Empty State -->
    <EmptyState v-else-if="isEmpty" :message="emptyMessage" :title="emptyTitle">
        <template #actions>
            <slot name="empty-actions"></slot>
        </template>
    </EmptyState>

    <!-- Content -->
    <template v-else>
        <!-- Desktop Table View -->
        <div class="table-container hidden md:block">
            <table class="table">
                <thead v-if="$slots.header || columns.length" class="table-header">
                    <slot name="header">
                        <tr>
                            <th
                                v-for="(column, index) in columns"
                                :key="index"
                                class="table-header-cell">
                                {{ column }}
                            </th>
                        </tr>
                    </slot>
                </thead>
                <tbody class="table-body">
                    <!-- Grouped rendering -->
                    <template v-if="props.grouped">
                        <template
                            v-for="(groupData, groupIndex) in props.grouped"
                            :key="groupIndex">
                            <!-- Group header row -->
                            <tr class="table-group-row" @click="onGroupClick(groupData.group)">
                                <td :colspan="columns.length || 100" class="table-group-cell">
                                    <slot
                                        name="group"
                                        :data="groupData.group"
                                        :items="groupData.items"
                                        :index="groupIndex"></slot>
                                </td>
                            </tr>
                            <!-- Group items -->
                            <tr
                                v-for="(item, itemIndex) in groupData.items"
                                :key="`${groupIndex}-${itemIndex}`"
                                class="table-row"
                                @click="onRowClick(item)">
                                <slot
                                    name="row"
                                    :data="item"
                                    :index="itemIndex"
                                    :group="groupData.group"></slot>
                            </tr>
                        </template>
                    </template>

                    <!-- Non-grouped rendering -->
                    <template v-else>
                        <tr
                            v-for="(item, index) in props.value"
                            :key="index"
                            class="table-row"
                            @click="onRowClick(item)">
                            <slot name="row" :data="item" :index="index"></slot>
                        </tr>
                    </template>
                </tbody>
            </table>
        </div>

        <!-- Mobile Card View -->
        <div class="mobile-card-container md:hidden">
            <!-- Grouped rendering -->
            <template v-if="props.grouped">
                <div
                    v-for="(groupData, groupIndex) in props.grouped"
                    :key="groupIndex"
                    class="mobile-card-group">
                    <!-- Group header -->
                    <div class="mobile-card-group-header" @click="onGroupClick(groupData.group)">
                        <slot
                            name="group"
                            :data="groupData.group"
                            :items="groupData.items"
                            :index="groupIndex"></slot>
                    </div>
                    <!-- Group items -->
                    <div
                        v-for="(item, itemIndex) in groupData.items"
                        :key="`${groupIndex}-${itemIndex}`"
                        class="mobile-card"
                        @click="onRowClick(item)">
                        <slot name="row" :data="item" :index="itemIndex" :group="groupData.group">
                        </slot>
                    </div>
                </div>
            </template>

            <!-- Non-grouped rendering -->
            <template v-else>
                <div
                    v-for="(item, index) in props.value"
                    :key="index"
                    class="mobile-card"
                    @click="onRowClick(item)">
                    <slot name="row" :data="item" :index="index"></slot>
                </div>
            </template>
        </div>
    </template>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

/* Desktop Table View */
.table-container {
    @apply hidden overflow-hidden rounded-lg border border-slate-200;
    @apply overflow-x-auto;
    @apply md:block;

    .table {
        @apply min-w-full bg-white;

        .table-header {
            @apply bg-slate-50;
            @apply border-b border-slate-200;

            .table-header-cell {
                @apply px-6 py-3 text-left text-xs font-medium;
                @apply tracking-wider text-slate-500 uppercase;
            }
        }

        .table-body {
            @apply divide-y divide-slate-200;

            .table-row {
                @apply cursor-pointer transition-colors hover:bg-slate-50;

                .table-cell {
                    @apply px-6 py-4 text-sm whitespace-nowrap;
                }
            }

            .table-group-row {
                @apply bg-slate-50;

                .table-group-cell {
                    @apply px-6 py-4;
                }

                &:hover {
                    @apply bg-slate-50;
                }
            }
        }
    }
}

/* Mobile Card View */
.mobile-card-container {
    @apply flex flex-col gap-3;
    @apply md:hidden;

    .mobile-card-group {
        @apply space-y-2;

        .mobile-card-group-header {
            @apply rounded-lg bg-slate-50 p-3;
            @apply border border-slate-200;
            @apply cursor-pointer;
        }
    }

    .mobile-card {
        @apply rounded-lg border border-slate-200 bg-white;
        @apply p-4;
        @apply cursor-pointer transition-all;
        @apply hover:border-slate-300 hover:shadow-sm;
        @apply active:scale-[0.99];

        /* Make table cells stack vertically on mobile */
        :deep(td) {
            @apply block px-0 py-2;
            @apply border-b border-slate-100 last:border-b-0;
            @apply whitespace-normal;

            /* First child in each cell acts as a label on mobile */
            &:first-child {
                @apply pt-0;
            }

            &:last-child {
                @apply pb-0;
            }
        }
    }
}
</style>
