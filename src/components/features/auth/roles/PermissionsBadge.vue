<script lang="ts" setup>
import { faEllipsis, faShieldHalved } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, computed, useTemplateRef } from 'vue';
import { useFloatingPosition } from '@/composables/useFloatingPosition';
import { extractPermissions, isAdministrator, type Role } from '@/domain/member';
import RolePermissionsPopover from './RolePermissionsPopover.vue';
import type { PermissionType } from '@/domain/auth';

const props = defineProps<{
    role: Role;
    type: PermissionType;
}>();

const triggerRef = useTemplateRef<HTMLElement>('trigger');
const popoverRef = useTemplateRef<HTMLElement>('popover');
const isPopoverVisible = ref(false);

const { positionStyles } = useFloatingPosition(triggerRef, popoverRef, isPopoverVisible);

const permissions = computed(() => extractPermissions(props.role.permissions, props.type));
const isAdmin = computed(() => isAdministrator(props.role.permissions));
const hasMorePermissions = computed(() => permissions.value.length > 1);

function togglePopover(): void {
    isPopoverVisible.value = !isPopoverVisible.value;
}
</script>

<template>
    <div class="permissions-badge">
        <template v-if="isAdmin">
            <FontAwesomeIcon :icon="faShieldHalved" class="permissions-badge__icon" />
            <span class="permissions-badge__label">
                {{ $t('permissions.administrator.name') }}
            </span>
        </template>

        <template v-else-if="permissions.length > 0">
            <span class="permissions-badge__label">
                {{ $t(`permissions.${type}.${permissions[0][0]}.name`) }}
            </span>
            <button
                v-if="hasMorePermissions"
                ref="trigger"
                type="button"
                class="permissions-badge__more"
                @click.stop="togglePopover">
                <FontAwesomeIcon :icon="faEllipsis" class="permissions-badge__more-icon" />
                <span class="permissions-badge__more-count">+{{ permissions.length - 1 }}</span>
            </button>
        </template>

        <span v-else class="permissions-badge__empty">
            {{ $t('permissions.none') }}
        </span>
    </div>

    <Teleport to="body">
        <div v-if="isPopoverVisible" ref="popover" :style="positionStyles">
            <RolePermissionsPopover :role="role" :type="type" />
        </div>
    </Teleport>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.permissions-badge {
    @apply flex items-center gap-2;
}

.permissions-badge__icon {
    @apply text-xs text-gray-500;
}

.permissions-badge__label {
    @apply text-sm text-gray-700;
}

.permissions-badge__more {
    @apply inline-flex items-center gap-1;
    @apply rounded-full bg-gray-100 px-2 py-0.5;
    @apply text-xs text-gray-600;
    @apply transition-colors hover:bg-gray-200;
}

.permissions-badge__more-icon {
    @apply text-[0.625rem];
}

.permissions-badge__more-count {
    @apply font-medium;
}

.permissions-badge__empty {
    @apply text-sm text-slate-400 italic;
}
</style>
