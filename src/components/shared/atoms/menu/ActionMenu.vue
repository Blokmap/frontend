<script lang="ts" setup>
import Button from 'primevue/button';
import Popover from 'primevue/popover';
import { faEllipsisH, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useTemplateRef } from 'vue';

defineProps<{
    isPending?: boolean;
}>();

const actionMenuRef = useTemplateRef('menu');

function onToggleActionMenu(event: Event): void {
    actionMenuRef.value?.toggle(event);
    event.stopPropagation();
}

function hideMenu(): void {
    actionMenuRef.value?.hide();
}
</script>

<template>
    <div>
        <slot name="trigger" :toggle="onToggleActionMenu" ref="toggle">
            <Button severity="contrast" aria-haspopup="true" @click="onToggleActionMenu" text>
                <template #icon>
                    <FontAwesomeIcon :icon="faEllipsisH" v-if="!isPending" />
                    <FontAwesomeIcon :icon="faSpinner" spin v-else />
                </template>
            </Button>
        </slot>

        <Popover ref="menu">
            <div class="p-2">
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
        </Popover>
    </div>
</template>
