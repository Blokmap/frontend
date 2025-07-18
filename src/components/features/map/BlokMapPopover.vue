<script lang="ts" setup>
import type { Location } from '@/types/schema/Location';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { PrimeIcons } from '@primevue/core';
import Button from 'primevue/button';
import Popover from 'primevue/popover';
import { ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

defineProps<{
    selectedLocation: Location | null;
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
    <Popover
        ref="popover"
        class="w-md max-w-full duration-250"
        @hide="isShown = false"
        @show="isShown = true">
        <template v-if="selectedLocation !== null">
            <div class="justify-content-between flex">
                <h2 class="m-0 text-xl font-bold">{{ selectedLocation.name }}</h2>
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
            <div class="my-3 flex gap-2"></div>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum possimus vitae culpa
                minus iste non inventore, sint accusantium nostrum ipsum, maiores laudantium!
                Adipisci omnis officiis velit quia repudiandae alias soluta!
            </p>
            <Button
                severity="contrast"
                icon-pos="right"
                :label="t('components.blokmap.popover.button')"
                class="mt-3"
                outlined>
                <template #icon>
                    <FontAwesomeIcon :icon="faArrowRight" />
                </template>
            </Button>
        </template>
    </Popover>
</template>
