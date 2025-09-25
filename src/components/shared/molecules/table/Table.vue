<script lang="ts" setup generic="T extends Record<string, any>">
const props = defineProps<{
    value?: T[];
}>();

const emit = defineEmits<{
    'click:row': [rowData: T];
}>();

function onRowClick(item: T) {
    emit('click:row', item);
}
</script>

<template>
    <div class="table-container">
        <table class="table">
            <thead class="table-header">
                <slot name="header"> </slot>
            </thead>
            <tbody class="table-body">
                <tr
                    v-for="(item, index) in props.value"
                    :key="index"
                    class="table-row"
                    @click="onRowClick(item)">
                    <slot name="row" :data="item" :index="index"></slot>
                </tr>
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
        }
    }
}
</style>
