<script lang="ts" setup>
import Popover from 'primevue/popover';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, useTemplateRef } from 'vue';
import {
    extractPermissions,
    isAdministrator,
    type PermissionType,
    type Role,
} from '@/domain/member';

const props = defineProps<{
    role: Role;
    type: PermissionType;
}>();

const popover = useTemplateRef('popover');

/**
 * Extract the permissions from the role's permission bitmask.
 * Returns an array of [label, value] tuples for display.
 */
const rolePermissions = computed(() => {
    return extractPermissions(props.role.permissions, props.type);
});

/**
 * Check if the role has administrator permissions.
 */
const isAdmin = computed(() => {
    return isAdministrator(props.role.permissions);
});

/**
 * Toggle the popover
 */
function toggle(event: Event): void {
    popover.value?.toggle(event);
}

defineExpose({
    toggle,
});
</script>

<template>
    <Popover ref="popover">
        <div class="permissions-popover">
            <template v-if="isAdmin">
                <div class="permission-item">
                    <FontAwesomeIcon :icon="faCheck" class="check-icon" />
                    <div class="text">
                        <span class="text-sm font-medium text-slate-900">
                            {{ $t('permissions.administrator.name') }}
                        </span>
                        <span class="text-xs leading-snug text-slate-500">
                            {{ $t('permissions.administrator.description') }}
                        </span>
                    </div>
                </div>
            </template>
            <template v-else-if="rolePermissions.length > 0">
                <div v-for="[label, perm] in rolePermissions" :key="perm" class="permission-item">
                    <FontAwesomeIcon :icon="faCheck" class="check-icon" />
                    <div class="text">
                        <span class="text-sm font-medium text-slate-900">
                            {{ $t(`permissions.${type}.${label}.name`) }}
                        </span>
                        <span class="text-xs leading-snug text-slate-500">
                            {{ $t(`permissions.${type}.${label}.description`) }}
                        </span>
                    </div>
                </div>
            </template>
            <p v-else class="text-sm text-slate-400 italic">
                {{ $t('permissions.none') }}
            </p>
        </div>
    </Popover>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

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
        }
    }
}
</style>
