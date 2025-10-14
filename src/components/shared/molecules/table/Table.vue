<script lang="ts" setup generic="T extends Record<string, any>, G = any">
export type TableGroup<TData, TGroup = any> = {
    group: TGroup;
    items: TData[];
};

const props = defineProps<{
    value?: T[];
    grouped?: TableGroup<T, G>[];
}>();

const emit = defineEmits<{
    'click:row': [rowData: T];
    'click:group': [groupData: G];
}>();

function onRowClick(item: T) {
    emit('click:row', item);
}

function onGroupClick(group: G) {
    emit('click:group', group);
}
</script>

<template>
    <div class="table-container">
        <table class="table">
            <thead class="table-header">
                <slot name="header"> </slot>
            </thead>
            <tbody class="table-body">
                <!-- Grouped rendering -->
                <template v-if="props.grouped">
                    <template v-for="(groupData, groupIndex) in props.grouped" :key="groupIndex">
                        <!-- Group header row -->
                        <tr class="table-group-row" @click="onGroupClick(groupData.group)">
                            <td :colspan="100" class="table-group-cell">
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
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.table-container {
    @apply overflow-hidden rounded-lg border border-slate-200;
    @apply overflow-x-auto;

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
</style>
