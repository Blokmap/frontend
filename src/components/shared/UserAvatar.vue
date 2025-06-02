<script lang="ts" setup>
import { useAuthLogout } from '@/composables/services/useAuth';
import { useMessages } from '@/composables/useMessages';
import { Profile } from '@/types/model/Profile';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import Popover from 'primevue/popover';
import { useTemplateRef } from 'vue';

defineProps<{
    profile: Profile;
    logoutIsLoading?: boolean;
}>();

const { showMessage } = useMessages();

const popoverTemplate = useTemplateRef('popover');
</script>

<template>
    <Avatar
        class="cursor-pointer h-12 w-12 text-xl"
        shape="circle"
        id="avatar"
        :label="profile.username?.[0]?.toUpperCase() ?? '?'"
        @click="popoverTemplate?.toggle($event)">
    </Avatar>
    <Popover ref="popover">
        <h3>
            Currently logged in as
            <span class="font-bold text-primary"> {{ profile.username }} </span>.
        </h3>
        <Divider />
        <div class="flex justify-end">
            <Button
                label="Log Out"
                class="text-xs py-1 px-3"
                severity="contrast"
                :loading="logoutIsLoading"
                @click="$emit('logout')"
                outlined>
                <template #icon>
                    <FontAwesomeIcon :icon="faSignOut" />
                </template>
            </Button>
        </div>
    </Popover>
</template>
