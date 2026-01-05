<script lang="ts" setup>
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { extractPermissions, isAdministrator, type Role } from '@/domain/member';
import type { PermissionType } from '@/domain/auth';

const props = defineProps<{
    role: Role;
    type: PermissionType;
}>();

const rolePermissions = computed(() => {
    return extractPermissions(props.role.permissions, props.type);
});

const isAdmin = computed(() => {
    return isAdministrator(props.role.permissions);
});
</script>

<template>
    <div class="role-popover">
        <template v-if="isAdmin">
            <div class="role-popover__item">
                <FontAwesomeIcon :icon="faCheck" class="role-popover__check" />
                <div class="role-popover__text">
                    <span class="role-popover__name">
                        {{ $t('permissions.administrator.name') }}
                    </span>
                    <span class="role-popover__description">
                        {{ $t('permissions.administrator.description') }}
                    </span>
                </div>
            </div>
        </template>
        <template v-else-if="rolePermissions.length > 0">
            <div v-for="[label, perm] in rolePermissions" :key="perm" class="role-popover__item">
                <FontAwesomeIcon :icon="faCheck" class="role-popover__check" />
                <div class="role-popover__text">
                    <span class="role-popover__name">
                        {{ $t(`permissions.${type}.${label}.name`) }}
                    </span>
                    <span class="role-popover__description">
                        {{ $t(`permissions.${type}.${label}.description`) }}
                    </span>
                </div>
            </div>
        </template>
        <p v-else class="role-popover__empty">
            {{ $t('permissions.none') }}
        </p>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.role-popover {
    @apply max-w-xs min-w-64;
    @apply rounded-lg bg-white p-3 shadow-lg;
}

.role-popover__item {
    @apply flex gap-2 py-4;
    @apply border-b border-slate-200 first:pt-2 last:border-0 last:pb-2;
}

.role-popover__check {
    @apply text-primary mt-0.5 flex-shrink-0 text-xs;
}

.role-popover__text {
    @apply flex min-w-0 flex-1 flex-col gap-0.5;
}

.role-popover__name {
    @apply text-sm font-medium text-slate-900;
}

.role-popover__description {
    @apply text-xs leading-snug text-slate-500;
}

.role-popover__empty {
    @apply text-sm text-slate-400 italic;
}
</style>
