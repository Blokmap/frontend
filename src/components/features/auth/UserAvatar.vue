<script lang="ts" setup>
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import Popover from 'primevue/popover';
import Skeleton from 'primevue/skeleton';

import { faSignOut, faSpaghettiMonsterFlying } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useTemplateRef } from 'vue';

import type { Profile } from '@/domain/profile';

defineProps<{
    profile?: Profile | null;
    logoutIsLoading?: boolean;
}>();

defineEmits<{
    (e: 'logout'): void;
}>();

const popoverTemplate = useTemplateRef('popover');
</script>

<template>
    <template v-if="profile">
        <Avatar
            id="avatar"
            class="h-11 w-11 cursor-pointer text-xl"
            shape="circle"
            @click="popoverTemplate?.toggle($event)">
            <FontAwesomeIcon :icon="faSpaghettiMonsterFlying" class="text-color" />
        </Avatar>
        <Popover ref="popover">
            <h3>
                Currently logged in as
                <span class="text-primary font-bold"> {{ profile.username }} </span>.
            </h3>
            <Divider />
            <div class="flex justify-end">
                <Button
                    label="Log Out"
                    class="px-3 py-1 text-xs"
                    severity="contrast"
                    :loading="logoutIsLoading"
                    outlined
                    @click="$emit('logout')">
                    <template #icon>
                        <FontAwesomeIcon :icon="faSignOut" />
                    </template>
                </Button>
            </div>
        </Popover>
    </template>
    <template v-else>
        <Skeleton class="!h-11 !w-11" shape="circle" />
    </template>
</template>
