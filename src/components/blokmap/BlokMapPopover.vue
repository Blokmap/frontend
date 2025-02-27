<script lang="ts" setup>
import type { Location } from '@/types/model/Location';
import { PrimeIcons } from '@primevue/core';
import { Popover, Button } from 'primevue';
import { ref } from 'vue';

defineProps<{
    location: Location | null;
}>();

const container = ref<InstanceType<typeof Popover> | null>(null);
const shown = ref(false);

/**
 * Updates the popover overlay position.
 */
function update(): void {
    if (!shown.value) return;
    container.value?.alignOverlay();
}

/**
 * Hides the popover overlay.
 */
function hide(): void {
    if (!shown.value) return;
    container.value?.hide();
}

/**
 * Shows the popover overlay.
 */
function show(event: Event, target?: Element): void {
    container.value?.show(event, target);
}

/**
 * Expose the popover component methods.
 */
defineExpose({
    update,
    hide,
    show,
});
</script>

<template>
    <Popover
        ref="container"
        class="w-30rem max-w-full"
        @hide="shown = false"
        @show="shown = true">
        <template v-if="location !== null">
            <h2 class="m-0">{{ location.name }}</h2>
            <div class="flex gap-2 my-3">
                <Tag :icon="PrimeIcons.STAR" severity="contrast"> Popular </Tag>
                <Tag :icon="PrimeIcons.CALENDAR" severity="secondary">
                    Event
                </Tag>
                <Tag :icon="PrimeIcons.BOLT" severity="secondary"> Coffee </Tag>
            </div>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum
                possimus vitae culpa minus iste non inventore, sint accusantium
                nostrum ipsum, maiores laudantium! Adipisci omnis officiis velit
                quia repudiandae alias soluta!
            </p>
            <Button
                label="More information"
                severity="contrast"
                icon-pos="right"
                :icon="PrimeIcons.ARROW_RIGHT"
                outlined>
            </Button>
        </template>
    </Popover>
</template>
