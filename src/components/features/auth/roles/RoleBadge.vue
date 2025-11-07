<script lang="ts" setup>
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useTemplateRef } from 'vue';
import { type PermissionType, type Role } from '@/domain/member';
import { getContrastColor } from '@/utils/colorUtils';
import RolePermissionsPopover from './RolePermissionsPopover.vue';

const {
    clickable = true,
    role,
    type,
} = defineProps<{
    role: Role | null;
    clickable?: boolean;
    type: PermissionType;
}>();

const popover = useTemplateRef('popover');

/**
 * Calculate the high contrast text color for the badge.
 */
function getTextColor(): string {
    return role ? getContrastColor(role.colour) : '#555';
}

/**
 * Handle click on role label
 *
 * @param event - The click event for toggling the popover
 */
function onClickLabel(event: Event): void {
    if (clickable && role) popover.value?.toggle(event);
}
</script>

<template>
    <div
        class="role-label"
        :class="{ clickable }"
        :style="{ backgroundColor: role?.colour ?? 'whitesmoke', color: getTextColor() }"
        @click.stop="onClickLabel">
        <FontAwesomeIcon class="mr-1" :icon="faTag" />
        <span class="font-semibold">{{ role?.name ?? 'Geen Rol' }}</span>
    </div>

    <RolePermissionsPopover v-if="role" ref="popover" :role="role" :type="type" />
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.role-label {
    @apply inline-flex items-center justify-center;
    @apply rounded-full px-3 py-1 text-sm;
    @apply transition-colors;
}
</style>
