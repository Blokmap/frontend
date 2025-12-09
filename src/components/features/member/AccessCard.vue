<script lang="ts" setup>
import Card from 'primevue/card';

defineProps<{
    loading?: boolean;
}>();
</script>

<template>
    <Card>
        <template #content>
            <div class="flex flex-col gap-4">
                <div v-if="$slots.header">
                    <slot name="header"></slot>
                </div>

                <div v-if="loading" class="flex flex-col gap-3">
                    <slot name="loading">
                        <div
                            v-for="i in 2"
                            :key="i"
                            class="flex items-center gap-3 rounded-lg border border-slate-200 p-3">
                            <div
                                class="h-12 w-12 shrink-0 animate-pulse rounded-full bg-slate-200"></div>
                            <div class="min-w-0 flex-1">
                                <div class="mb-2 h-3 w-16 animate-pulse rounded bg-slate-200"></div>
                                <div class="h-4 w-32 animate-pulse rounded bg-slate-200"></div>
                            </div>
                            <div class="h-4 w-4 animate-pulse rounded bg-slate-200"></div>
                        </div>
                    </slot>
                </div>

                <div v-else class="flex flex-col gap-3">
                    <slot></slot>
                </div>
            </div>
        </template>
    </Card>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
