<script lang="ts" setup>
import Button from 'primevue/button';
import { faEllipsisH, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';
import { useFloatingPosition } from '@/composables/useFloatingPosition';

const props = defineProps<{
    pending?: boolean;
    disabled?: boolean;
    disabledTooltip?: string;
}>();

const triggerRef = ref<HTMLElement | null>(null);
const overlayRef = ref<HTMLElement | null>(null);
const isVisible = ref<boolean>(false);

const { positionStyles } = useFloatingPosition(triggerRef, overlayRef, isVisible);

function onToggleActionMenu(): void {
    if (props.disabled) {
        return;
    }

    isVisible.value = !isVisible.value;
}

function hideMenu(): void {
    isVisible.value = false;
}
</script>

<template>
    <div>
        <div ref="triggerRef">
            <slot name="trigger" :toggle="onToggleActionMenu">
                <Button
                    severity="contrast"
                    aria-haspopup="true"
                    v-tooltip.top="disabled ? disabledTooltip : ''"
                    :disabled="disabled"
                    @click.stop="onToggleActionMenu"
                    text>
                    <template #icon>
                        <FontAwesomeIcon :icon="faEllipsisH" v-if="!pending" />
                        <FontAwesomeIcon :icon="faSpinner" spin v-else />
                    </template>
                </Button>
            </slot>
        </div>

        <Teleport to="body">
            <Transition name="slide-down">
                <div
                    v-if="isVisible"
                    ref="overlayRef"
                    :style="positionStyles"
                    class="rounded-lg bg-white p-2 shadow-lg">
                    <p class="mb-3 text-sm font-medium text-slate-500">Acties</p>
                    <div class="space-y-3">
                        <!-- Main content slot -->
                        <slot name="content" :hide-menu="hideMenu">
                            <!-- Default content slot -->
                            <slot :hide-menu="hideMenu"></slot>
                        </slot>

                        <!-- Navigation section (always rendered independently) -->
                        <div v-if="$slots.navigation" class="space-y-2">
                            <slot name="navigation" :hide-menu="hideMenu"></slot>
                        </div>
                    </div>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>
