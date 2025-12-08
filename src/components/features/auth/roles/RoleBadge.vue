<script lang="ts" setup>
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, useTemplateRef } from 'vue';
import { useFloatingPosition } from '@/composables/useFloatingPosition';
import { type Role } from '@/domain/member';
import { getContrastColor } from '@/utils/colorUtils';
import RolePermissionsPopover from './RolePermissionsPopover.vue';
import type { PermissionType } from '@/domain/auth';

const {
    clickable = true,
    role,
    type,
} = defineProps<{
    role: Role | null;
    clickable?: boolean;
    type: PermissionType;
}>();

const triggerRef = useTemplateRef<HTMLElement>('trigger');
const popoverRef = useTemplateRef<HTMLElement>('popover');
const isPopoverVisible = ref(false);

const { positionStyles } = useFloatingPosition(triggerRef, popoverRef, isPopoverVisible);

/**
 * Calculate the high contrast text color for the badge.
 */
function getTextColor(): string {
    return role ? getContrastColor(role.colour) : '#555';
}

/**
 * Handle click on role label
 */
function onClickLabel(): void {
    if (clickable && role) {
        isPopoverVisible.value = !isPopoverVisible.value;
    }
}
</script>

<template>
    <div
        ref="trigger"
        class="role-badge"
        :class="{ 'role-badge--clickable': clickable }"
        :style="{ backgroundColor: role?.colour ?? 'whitesmoke', color: getTextColor() }"
        @click.stop="onClickLabel">
        <FontAwesomeIcon class="role-badge__icon" :icon="faTag" />
        <span class="role-badge__label">{{ role?.name ?? 'Geen Rol' }}</span>
    </div>

    <Teleport to="body">
        <div v-if="role && isPopoverVisible" ref="popover" :style="positionStyles">
            <RolePermissionsPopover :role="role" :type="type" />
        </div>
    </Teleport>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.role-badge {
    @apply inline-flex items-center justify-center;
    @apply rounded-full px-3 py-1 text-sm;
    @apply transition-colors;

    &.role-badge--clickable {
        @apply cursor-pointer;
    }

    .role-badge__icon {
        @apply mr-1;
    }

    .role-badge__label {
        @apply font-semibold;
    }
}
</style>
