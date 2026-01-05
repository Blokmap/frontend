<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';

withDefaults(
    defineProps<{
        rows?: number;
        columns?: number;
        isMobile: boolean;
    }>(),
    {
        rows: 5,
        columns: 4,
    },
);
</script>

<template>
    <Transition name="fade" mode="out-in" appear>
        <!-- Desktop Table Loading -->
        <div class="skeleton__table" v-if="!isMobile">
            <table class="skeleton__table-inner">
                <thead class="skeleton__header">
                    <tr>
                        <th v-for="i in columns" :key="`header-${i}`" class="skeleton__header-cell">
                            <Skeleton width="80px" height="16px" />
                        </th>
                    </tr>
                </thead>
                <tbody class="skeleton__body">
                    <tr v-for="row in rows" :key="`row-${row}`" class="skeleton__row">
                        <td
                            v-for="col in columns"
                            :key="`cell-${row}-${col}`"
                            class="skeleton__cell">
                            <Skeleton :width="col === 1 ? '120px' : '80px'" height="20px" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Mobile Card Loading -->
        <div class="flex flex-col gap-3" v-else>
            <div v-for="i in rows" :key="`mobile-${i}`" class="skeleton__card">
                <div class="skeleton__card-content">
                    <Skeleton width="60%" height="20px" />
                    <Skeleton width="80%" height="16px" />
                    <Skeleton width="40%" height="16px" />
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.skeleton__table {
    @apply overflow-hidden rounded-lg border border-slate-200 bg-white;

    .skeleton__table-inner {
        @apply min-w-full;
    }

    .skeleton__header {
        @apply border-b border-slate-200 bg-slate-50;

        .skeleton__header-cell {
            @apply px-6 py-3 text-left;
        }
    }

    .skeleton__body {
        @apply divide-y divide-slate-200;

        .skeleton__cell {
            @apply px-6 py-4;
        }
    }
}

.skeleton__card {
    @apply rounded-lg border border-slate-200 bg-white p-4;

    .skeleton__card-content {
        @apply space-y-3;
    }
}
</style>
