<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';
import CopyButton from '@/components/atoms/CopyButton.vue';
import EntityAvatar from '@/components/molecules/avatar/EntityAvatar.vue';
import EntityAvatarDialog from '@/components/molecules/avatar/EntityAvatarDialog.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useDeleteProfileAvatar, useUpdateProfileAvatar } from '@/composables/data/useProfile';
import ProfileQrCode from './ProfileQrCode.vue';
import type { Profile, ProfileStats } from '@/domain/profile';

const props = defineProps<{
    profile?: Profile | null;
    stats?: ProfileStats | null;
    showQr?: boolean;
    editable?: boolean;
}>();

const { locale } = useI18n();

const { mutateAsync: updateProfileAvatar, isPending: isUpdatingProfileAvatar } =
    useUpdateProfileAvatar({
        onSuccess: () => {
            showEntityAvatarDialog.value = false;
        },
    });

const { mutateAsync: deleteProfileAvatar, isPending: isDeletingProfileAvatar } =
    useDeleteProfileAvatar({
        onSuccess: () => {
            showEntityAvatarDialog.value = false;
        },
    });

const showEntityAvatarDialog = ref<boolean>(false);

function onAvatarEditClick() {
    showEntityAvatarDialog.value = true;
}

function onUpdateProfileAvatar(file: File) {
    if (!props.profile) {
        return;
    }

    updateProfileAvatar({ profileId: props.profile.id, file });
}

function onDeleteProfileAvatar() {
    if (!props.profile) {
        return;
    }

    deleteProfileAvatar(props.profile.id);
}
</script>

<template>
    <div class="profile-card">
        <div class="profile-card__info">
            <div class="profile-card__info-avatar">
                <EntityAvatar
                    class="h-full w-full"
                    v-if="profile"
                    :image="profile.avatar?.url"
                    @click:edit="onAvatarEditClick"
                    editable>
                </EntityAvatar>
                <Skeleton shape="circle" size="100%" v-else />
            </div>

            <div class="profile-card__info-content">
                <template v-if="profile">
                    <h2 class="info-content__name">{{ profile.firstName }}</h2>
                    <p class="info-content__username">
                        <span>@{{ profile.username }}</span>
                        <CopyButton :value="profile?.username" />
                    </p>
                </template>
                <template v-else>
                    <Skeleton width="75px" height="32px" />
                    <Skeleton width="100px" height="15px" />
                </template>
            </div>
        </div>

        <div class="profile-card__stats">
            <div class="profile-card__stat">
                <template v-if="stats">
                    <p class="stat__value">{{ stats.upcomingReservations }}</p>
                    <p class="stat__label">nieuwe reservaties</p>
                </template>
                <template v-else>
                    <Skeleton width="50px" height="28px" class="mb-1" />
                    <Skeleton width="100px" height="12px" />
                </template>
            </div>

            <div class="profile-card__stat">
                <template v-if="stats">
                    <p class="stat__value">{{ stats.totalReservationHours }}</p>
                    <p class="stat__label">uur gereserveerd</p>
                </template>
                <template v-else>
                    <Skeleton width="50px" height="28px" class="mb-1" />
                    <Skeleton width="100px" height="12px" />
                </template>
            </div>

            <div class="profile-card__stat">
                <template v-if="profile">
                    <p class="stat__value">
                        {{
                            profile?.createdAt.toLocaleDateString(locale, {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                            })
                        }}
                    </p>
                    <p class="stat__label">account gemaakt</p>
                </template>
                <template v-else>
                    <Skeleton width="50px" height="28px" class="mb-1" />
                    <Skeleton width="100px" height="12px" />
                </template>
            </div>
        </div>

        <div class="profile-card__qr" v-if="showQr">
            <ProfileQrCode v-if="profile" :profile="profile" />
            <Skeleton v-else width="200px" height="200px" />
        </div>

        <Teleport to="body">
            <EntityAvatarDialog
                v-if="profile"
                title="Profielfoto"
                subtitle="Je profielfoto is zichtbaar voor anderen op je reviews en geregistreerde
                    locaties."
                :profile="profile"
                :is-updating="isUpdatingProfileAvatar"
                :is-deleting="isDeletingProfileAvatar"
                :image="profile.avatar?.url"
                v-model:visible="showEntityAvatarDialog"
                @update="onUpdateProfileAvatar"
                @delete="onDeleteProfileAvatar">
            </EntityAvatarDialog>
        </Teleport>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.profile-card {
    @apply grid grid-cols-2 items-center gap-4 p-4 sm:flex sm:flex-row sm:items-center sm:gap-8 sm:p-8;
    @apply justify-items-center sm:justify-items-stretch;
    @apply rounded-xl bg-white shadow-md;

    .profile-card__info {
        @apply col-span-1 flex flex-col items-center justify-center gap-3;

        .profile-card__info-avatar {
            @apply h-24 w-24 flex-none rounded-full;
        }

        .profile-card__info-content {
            @apply space-y-1 text-center;

            .info-content__name {
                @apply text-2xl font-bold;
            }
            .info-content__username {
                @apply flex items-center gap-1 text-xs text-slate-500;
            }
        }
    }

    .profile-card__stats {
        @apply col-span-1 flex min-w-0 flex-col items-center divide-y-1 divide-slate-200;
        @apply sm:flex-1;

        .profile-card__stat {
            @apply w-full px-3 py-3 text-left;

            .stat__value {
                @apply text-xl font-bold;
            }
            .stat__label {
                @apply text-xs text-slate-700;
            }
        }
    }

    .profile-card__qr {
        @apply col-span-2 flex w-full justify-center;
        @apply sm:col-auto sm:ml-auto sm:justify-end;
        @apply sm:w-48 sm:flex-none;
    }
}
</style>
