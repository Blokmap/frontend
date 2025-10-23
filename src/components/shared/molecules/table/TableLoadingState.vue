<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';

withDefaults(
    defineProps<{
        rows?: number;
        columns?: number;
    }>(),
    {
        rows: 5,
        columns: 4,
    },
);
</script>

<template>
    <!-- Desktop Table Loading -->
    <div class="hidden md:block">
        <div class="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <table class="min-w-full">
                <thead class="border-b border-slate-200 bg-slate-50">
                    <tr>
                        <th v-for="i in columns" :key="`header-${i}`" class="px-6 py-3 text-left">
                            <Skeleton width="80px" height="16px" />
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-200">
                    <tr v-for="row in rows" :key="`row-${row}`">
                        <td v-for="col in columns" :key="`cell-${row}-${col}`" class="px-6 py-4">
                            <Skeleton :width="col === 1 ? '120px' : '80px'" height="20px" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- Mobile Card Loading -->
    <div class="flex flex-col gap-3 md:hidden">
        <div
            v-for="i in rows"
            :key="`mobile-${i}`"
            class="rounded-lg border border-slate-200 bg-white p-4">
            <div class="space-y-3">
                <Skeleton width="60%" height="20px" />
                <Skeleton width="80%" height="16px" />
                <Skeleton width="40%" height="16px" />
            </div>
        </div>
    </div>
</template>
