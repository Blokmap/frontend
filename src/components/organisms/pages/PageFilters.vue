<script lang="ts" setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { breakpointsTailwind, useBreakpoints } from '@vueuse/core';
import { ref } from 'vue';

defineProps<{
    isFiltering?: boolean;
}>();

const breakpoints = useBreakpoints(breakpointsTailwind);
const isMobile = breakpoints.smaller('md');

const showDialog = ref(false);

function openDialog(): void {
    showDialog.value = true;
}

function closeDialog(): void {
    showDialog.value = false;
}

function applyFilters(): void {
    showDialog.value = false;
}
</script>

<template>
    <!-- Desktop: Show filters inline -->
    <div v-if="!isMobile" class="flex flex-wrap items-center gap-3">
        <slot></slot>
    </div>

    <!-- Mobile: Show filter button -->
    <div v-else class="relative">
        <Button @click="openDialog" outlined>
            <template #icon>
                <FontAwesomeIcon :icon="faFilter" />
            </template>
        </Button>
        <span
            v-if="isFiltering"
            class="bg-primary absolute top-0 right-0 h-2 w-2 rounded-full"></span>

        <!-- Mobile Dialog -->
        <Dialog
            v-model:visible="showDialog"
            modal
            :draggable="false"
            :dismissable-mask="true"
            header="Filters"
            class="w-[90vw] max-w-md">
            <div class="flex w-full flex-col gap-3">
                <slot></slot>
            </div>

            <template #footer>
                <div class="flex gap-2">
                    <Button label="Sluiten" severity="contrast" class="flex-1" @click="closeDialog">
                    </Button>
                    <Button label="Toepassen" class="flex-1" @click="applyFilters" />
                </div>
            </template>
        </Dialog>
    </div>
</template>
