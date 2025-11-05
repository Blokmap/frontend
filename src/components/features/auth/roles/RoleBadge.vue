<script lang="ts" setup>
import Popover from 'primevue/popover';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, useTemplateRef } from 'vue';
import { extractPermissions, isAdministrator } from '@/domain/member';
import { getContrastColor } from '@/utils/color';
import type { PermissionType, Role } from '@/domain/auth';

const {
    clickable = true,
    role,
    type,
} = defineProps<{
    role: Role;
    clickable?: boolean;
    type: PermissionType;
}>();

const popover = useTemplateRef('popover');

/**
 * Extract the permissions from the role's permission bitmask.
 * Returns an array of [label, value] tuples for display.
 */
const rolePermissions = computed(() => extractPermissions(role.permissions, type));

/**
 * Check if the role has administrator permissions.
 */
const isAdmin = computed(() => isAdministrator(role.permissions));

/**
 * Calculate the high contrast text color for the badge.
 */
const textColor = computed(() => getContrastColor(role.colour));

/**
 * Handle click on role label
 *
 * @param event - The click event for toggling the popover
 */
function onClickLabel(event: Event): void {
    if (clickable) popover.value?.toggle(event);
}
</script>

<template>
    <div
        class="role-label"
        :class="{ clickable }"
        :style="{ backgroundColor: role.colour, color: textColor }"
        @click="onClickLabel">
        <span class="text">{{ role.name }}</span>
    </div>

    <Popover ref="popover">
        <div class="permissions-popover">
            <template v-if="isAdmin">
                <div class="permission-item">
                    <FontAwesomeIcon :icon="faCheck" class="check-icon" />
                    <div class="text">
                        <span class="name">{{ $t('permissions.administrator.name') }}</span>
                        <span class="desc">{{ $t('permissions.administrator.description') }}</span>
                    </div>
                </div>
            </template>
            <template v-else-if="rolePermissions.length > 0">
                <div v-for="[label, perm] in rolePermissions" :key="perm" class="permission-item">
                    <FontAwesomeIcon :icon="faCheck" class="check-icon" />
                    <div class="text">
                        <span class="name">
                            {{ $t(`permissions.${type}.${label}.name`) }}
                        </span>
                        <span class="desc">
                            {{ $t(`permissions.${type}.${label}.description`) }}
                        </span>
                    </div>
                </div>
            </template>
            <p v-else class="empty">{{ $t('permissions.none') }}</p>
        </div>
    </Popover>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.role-label {
    @apply inline-flex items-center justify-center;
    @apply rounded-full px-3 py-1;
    @apply text-xs transition-colors;

    &.clickable {
        @apply cursor-pointer;

        &:hover {
            @apply brightness-110;
        }
    }

    .text {
        @apply font-medium;
    }
}

.permissions-popover {
    @apply max-w-xs min-w-64;

    .permission-item {
        @apply flex gap-2 py-2;
        @apply border-b border-slate-100 last:border-0;

        .check-icon {
            @apply text-primary mt-0.5 flex-shrink-0 text-xs;
        }

        .text {
            @apply flex min-w-0 flex-1 flex-col gap-0.5;

            .name {
                @apply text-sm font-medium text-slate-900;
            }

            .desc {
                @apply text-xs leading-snug text-slate-500;
            }
        }
    }

    .empty {
        @apply text-sm text-slate-400 italic;
    }
}
</style>
