<script lang="ts" setup>
import Popover from 'primevue/popover';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import {
    LOCATION_PERMISSIONS,
    AUTHORITY_PERMISSIONS,
    INSTITUTION_PERMISSIONS,
} from '@/domain/auth/constants';
import type { PermissionType, Role } from '@/domain/auth';

const {
    clickable = true,
    type = 'location',
    role,
} = defineProps<{
    role: Role;
    types: number[];
    clickable?: boolean;
    type?: PermissionType;
}>();

const popover = ref();

const permissions = computed(() => {
    const lists = {
        location: LOCATION_PERMISSIONS,
        authority: AUTHORITY_PERMISSIONS,
        institution: INSTITUTION_PERMISSIONS,
    };
    return lists[type];
});

const onClickLabel = (event: Event) => {
    if (clickable) popover.value?.toggle(event);
};
</script>

<template>
    <div class="role-label" :class="{ clickable }" @click="onClickLabel">
        <span class="circle" :style="{ backgroundColor: role.colour }"></span>
        <span class="text" :style="{ color: role.colour }">{{ role.name }}</span>
    </div>

    <Popover ref="popover">
        <div class="permissions-popover">
            <div class="header">
                <span class="circle" :style="{ backgroundColor: role.colour }"></span>
                <h3 :style="{ color: role.colour }">{{ role.name }}</h3>
            </div>
            <ul v-if="permissions.length" class="permissions">
                <li v-for="perm in permissions" :key="perm.value">
                    <p class="mb-2 text-sm font-medium">
                        <FontAwesomeIcon :icon="faCheck" />
                        {{ $t(`permissions.${type}.${perm.name}.name`) }}
                    </p>
                    <p class="text-xs text-slate-500">
                        {{ $t(`permissions.${type}.${perm.name}.description`) }}
                    </p>
                </li>
            </ul>
            <p v-else class="empty">No permissions</p>
        </div>
    </Popover>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.role-label {
    @apply inline-flex items-center gap-2;
    @apply bg-secondary-100 rounded-full px-3 py-1;
    @apply text-xs transition-colors;

    &.clickable {
        @apply hover:bg-secondary-200 cursor-pointer;
    }

    .circle {
        @apply h-3 w-3 rounded-full;
    }

    .text {
        @apply font-medium;
    }
}

.permissions-popover {
    @apply min-w-64 overflow-hidden rounded-lg;

    .header {
        @apply flex items-center justify-center gap-2;
        @apply bg-slate-100 py-3;

        .circle {
            @apply h-3 w-3 rounded-full;
        }

        h3 {
            @apply text-sm font-semibold;
        }
    }

    .permissions {
        @apply m-0 list-none space-y-3 p-4;
    }

    .empty {
        @apply text-secondary-500 px-4 py-3 text-center text-sm italic;
    }
}
</style>
