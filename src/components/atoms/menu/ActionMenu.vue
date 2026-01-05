<script lang="ts" setup>
import Button from 'primevue/button';
import FloatingPopover from '@/components/atoms/FloatingPopover.vue';
import { faEllipsisH, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';

const props = defineProps<{
    pending?: boolean;
    disabled?: boolean;
    disabledTooltip?: string;
}>();

const visible = defineModel<boolean>('visible', {
    default: false,
});

const triggerRef = ref<HTMLElement | null>(null);

const onToggleActionMenu = (): void => {
    if (props.disabled) {
        return;
    }

    visible.value = !visible.value;
};

const hideMenu = (): void => {
    visible.value = false;
};
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

        <FloatingPopover :target-ref="triggerRef" v-model:visible="visible" :centered="false">
            <div class="rounded-lg bg-white p-3 shadow-lg">
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
        </FloatingPopover>
    </div>
</template>
