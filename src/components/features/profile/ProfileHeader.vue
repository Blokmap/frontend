<script setup lang="ts">
import Card from 'primevue/card';
import Chip from 'primevue/chip';
import Skeleton from 'primevue/skeleton';
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import CopyButton from '@/components/shared/atoms/CopyButton.vue';
import { faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { Profile } from '@/domain/profile';

defineProps<{
    profile?: Profile;
    loading?: boolean;
    editable?: boolean;
}>();

defineEmits<{
    'click:edit': [];
}>();
</script>

<template>
    <Card>
        <template #content>
            <div class="profile-header">
                <!-- Avatar Section -->
                <template v-if="loading || !profile">
                    <Skeleton shape="circle" size="96px" />
                </template>
                <template v-else>
                    <div class="avatar-wrapper">
                        <ProfileAvatar
                            :profile="profile"
                            :editable="editable"
                            @click:edit="$emit('click:edit')">
                        </ProfileAvatar>
                    </div>
                </template>

                <!-- Profile Info -->
                <div class="profile-info">
                    <template v-if="loading">
                        <Skeleton height="36px" width="200px" />
                        <Skeleton height="21px" width="300px" />
                        <Skeleton height="21px" width="250px" />
                    </template>
                    <template v-else-if="profile">
                        <!-- Name -->
                        <div class="profile-info__name">
                            <h1 class="text-2xl font-bold text-gray-900">
                                {{ profile.firstName }} {{ profile.lastName }}
                            </h1>
                        </div>

                        <!-- Username -->
                        <div class="flex items-center gap-2 text-gray-600">
                            <FontAwesomeIcon
                                :icon="faUser"
                                class="!md:inline !hidden text-gray-400">
                            </FontAwesomeIcon>
                            <span class="text-xs md:text-base"> @{{ profile.username }} </span>
                            <CopyButton :value="profile.username" />
                        </div>

                        <!-- Email -->
                        <div class="flex items-center gap-2 text-gray-600 md:gap-3">
                            <FontAwesomeIcon
                                :icon="faEnvelope"
                                class="!md:inline !hidden text-gray-400">
                            </FontAwesomeIcon>
                            <span class="text-xs text-gray-700 md:text-base">
                                {{ profile.email }}
                            </span>
                        </div>

                        <!-- Authorities/Roles -->
                        <div v-if="profile.authorities?.length" class="flex flex-wrap gap-2">
                            <Chip
                                v-for="authority in profile.authorities"
                                :key="authority.id"
                                :label="authority.name"
                                class="bg-primary-100 text-primary-700">
                            </Chip>
                        </div>
                    </template>
                </div>
            </div>
        </template>
    </Card>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.profile-header {
    @apply flex flex-row items-center gap-3 md:gap-6;

    .avatar-wrapper {
        @apply h-16 w-16 flex-shrink-0;
        @apply md:h-24 md:w-24;
    }

    .profile-info {
        @apply flex flex-col;
        @apply md:space-y-1;

        .profile-info__name {
            @apply flex flex-row items-center gap-0.5;
            @apply md:gap-3;

            h1 {
                @apply text-base leading-tight font-bold;
                @apply md:text-2xl md:leading-normal;
            }
        }
    }
}
</style>
