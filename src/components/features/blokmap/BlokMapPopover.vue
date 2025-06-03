<script lang="ts" setup>
import type { SearchedLocation } from '@/types/schema/Location';
import { PrimeIcons } from '@primevue/core';
import Button from 'primevue/button';
import Popover from 'primevue/popover';
import Tag from 'primevue/tag';
import { ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{
    selectedLocation: SearchedLocation | null;
    isFavoriteLocation: boolean;
}>();

const { t } = useI18n();
const container = useTemplateRef('popover');
const isShown = ref(false);

/**
 * Updates the popover overlay position.
 */
function update(): void {
    if (!isShown.value) return;
    container.value?.alignOverlay();
}

/**
 * Hides the popover overlay.
 */
function hide(): void {
    if (!isShown.value) return;
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
    <Popover ref="popover" class="w-md max-w-full" @hide="isShown = false" @show="isShown = true">
        <template v-if="selectedLocation !== null">
            <div class="flex justify-content-between">
                <h2 class="m-0">{{ selectedLocation.name }}</h2>
                <div class="cursor-pointer">
                    <template v-if="isFavoriteLocation">
                        <i
                            v-tooltip.top="t('components.blokmap.popover.unfavorite')"
                            :class="PrimeIcons.STAR_FILL">
                        </i>
                    </template>
                    <template v-else>
                        <i
                            v-tooltip.top="t('components.blokmap.popover.favorite')"
                            :class="PrimeIcons.STAR">
                        </i>
                    </template>
                </div>
            </div>
            <div class="flex gap-2 my-3">
                <Tag :icon="PrimeIcons.STAR" severity="contrast"> Popular </Tag>
                <Tag :icon="PrimeIcons.CALENDAR" severity="secondary"> Event </Tag>
                <Tag :icon="PrimeIcons.BOLT" severity="secondary"> Coffee </Tag>
            </div>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum possimus vitae culpa
                minus iste non inventore, sint accusantium nostrum ipsum, maiores laudantium!
                Adipisci omnis officiis velit quia repudiandae alias soluta!
            </p>
            <Button
                severity="contrast"
                icon-pos="right"
                :label="t('components.blokmap.popover.button')"
                :icon="PrimeIcons.ARROW_RIGHT"
                outlined>
            </Button>
        </template>
    </Popover>
</template>
