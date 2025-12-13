<script lang="ts" setup>
import FloatingPopover from '@/components/shared/atoms/FloatingPopover.vue';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { type Role } from '@/domain/member';
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

const triggerRef = ref<HTMLElement | null>(null);
const isPopoverVisible = ref(false);

const bgColor = computed<string>(() => {
    return 'var(--color-slate-100)';
});

const textColor = computed<string>(() => {
    return 'var(--color-secondary-700)';
});

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
        ref="triggerRef"
        class="role-badge"
        :class="{ 'role-badge--clickable': clickable }"
        :style="{ backgroundColor: bgColor, color: textColor }"
        @click.stop="onClickLabel">
        <FontAwesomeIcon class="role-badge__icon" :icon="faTag" />
        <span class="role-badge__label">{{ role?.name ?? 'Geen Rol' }}</span>
    </div>

    <FloatingPopover v-if="role" :target-ref="triggerRef" v-model:visible="isPopoverVisible">
        <RolePermissionsPopover :role="role" :type="type" />
    </FloatingPopover>
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
