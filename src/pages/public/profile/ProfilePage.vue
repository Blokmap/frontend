<script setup lang="ts">
import Card from 'primevue/card';
import Chip from 'primevue/chip';
import Skeleton from 'primevue/skeleton';
import ProfileQrCode from '@/components/features/profile/ProfileQrCode.vue';
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import ProfileAvatarDialog from '@/components/features/profile/avatar/ProfileAvatarDialog.vue';
import StatsCard from '@/components/features/profile/stats/StatsCard.vue';
import StatsCardSkeleton from '@/components/features/profile/stats/StatsCardSkeleton.vue';
import ProfileReservationsTable from '@/components/features/reservation/table/ProfileReservationsTable.vue';
import {
    faCalendarDays,
    faChartLine,
    faClock,
    faEnvelope,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useReadProfileStats } from '@/composables/data/useProfile';
import { useReadProfileReservations } from '@/composables/data/useReservations';

const { isLoading: profileIsLoading, data: profile, profileId } = useAuthProfile();

const {
    isLoading: reservationsIsLoading,
    isPending: reservationsIsPending,
    data: reservations,
} = useReadProfileReservations(profileId);

const {
    isLoading: profileStatsIsLoading,
    isPending: profileStatsIsPending,
    data: profileStatsData,
} = useReadProfileStats(profileId);

const showAvatarDialog = ref<boolean>(false);
// const showEditDialog = ref<boolean>(false);

const upcomingReservations = computed(() => profileStatsData.value?.upcomingReservations || 0);
const totalReservations = computed(() => profileStatsData.value?.totalReservations || 0);
const reservationHours = computed(() => profileStatsData.value?.totalReservationHours || 0);
</script>

<template>
    <div class="mx-auto w-full max-w-[1140px] space-y-6">
        <!-- Profile Header, Stats Cards, and QR Code Row -->
        <div class="grid grid-cols-1 gap-4 md:grid-cols-4">
            <!-- Left Column: Profile Header + Stats Cards -->
            <div class="space-y-4 md:col-span-3">
                <!-- Profile Header -->
                <Card>
                    <template #content>
                        <div class="profile-header">
                            <!-- Avatar Section -->
                            <template v-if="profileIsLoading || !profile">
                                <Skeleton shape="circle" size="96px" />
                            </template>
                            <template v-else>
                                <div class="avatar-wrapper">
                                    <ProfileAvatar
                                        :profile="profile"
                                        editable
                                        @click:edit="showAvatarDialog = true">
                                    </ProfileAvatar>
                                </div>
                                <ProfileAvatarDialog
                                    v-model:visible="showAvatarDialog"
                                    :profile="profile">
                                </ProfileAvatarDialog>
                            </template>

                            <!-- Profile Info -->
                            <div class="profile-info">
                                <template v-if="profileIsLoading">
                                    <Skeleton height="36px" width="200px" />
                                    <Skeleton height="21px" width="300px" />
                                    <Skeleton height="21px" width="250px" />
                                </template>
                                <template v-else-if="profile">
                                    <!-- Name and Edit Button -->
                                    <div class="profile-info__name">
                                        <h1 class="text-2xl font-bold text-gray-900">
                                            {{ profile.firstName }} {{ profile.lastName }}
                                        </h1>
                                        <!-- <ProfileEditDialog
                                            v-model:visible="showEditDialog"
                                            :profile="profile">
                                        </ProfileEditDialog> -->
                                    </div>

                                    <div class="flex items-center gap-2 text-gray-600">
                                        <FontAwesomeIcon
                                            :icon="faUser"
                                            class="!md:inline !hidden text-gray-400">
                                        </FontAwesomeIcon>
                                        <span class="text-xs md:text-base">
                                            @{{ profile.username }}
                                        </span>
                                    </div>

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
                                    <div
                                        v-if="profile.authorities?.length"
                                        class="flex flex-wrap gap-2">
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

                <!-- Stats Cards -->
                <div class="grid grid-cols-3 gap-4">
                    <template v-if="profileStatsIsLoading || profileStatsIsPending">
                        <StatsCardSkeleton v-for="n in 3" :key="n" />
                    </template>
                    <template v-else>
                        <!-- Total Reservations Card -->
                        <StatsCard
                            :icon="faCalendarDays"
                            :value="totalReservations"
                            :label="$t('pages.profile.stats.totalReservations', totalReservations)"
                            icon-color="text-secondary-500">
                        </StatsCard>

                        <!-- Study Hours Card -->
                        <StatsCard
                            :icon="faClock"
                            :value="`${reservationHours}u`"
                            :label="$t('pages.profile.stats.studyHours', reservationHours)"
                            icon-color="text-secondary-500">
                        </StatsCard>

                        <!-- Upcoming Card -->
                        <StatsCard
                            :icon="faChartLine"
                            :value="upcomingReservations"
                            :label="
                                $t('pages.profile.stats.upcomingReservations', upcomingReservations)
                            "
                            icon-color="text-slate-500">
                        </StatsCard>
                    </template>
                </div>
            </div>

            <!-- Right Column: QR Code Card -->
            <Card v-if="!profileIsLoading && profile" class="md:col-span-1">
                <template #content>
                    <div class="flex flex-col items-center gap-5 text-center">
                        <h3 class="text-lg font-semibold text-gray-900">
                            {{ $t('pages.profile.qrCode.title') }}
                        </h3>
                        <ProfileQrCode :profile="profile" />
                        <p class="text-xs text-gray-600">
                            {{ $t('pages.profile.qrCode.description') }}
                        </p>
                    </div>
                </template>
            </Card>
        </div>

        <!-- Current Week Activity -->
        <ProfileReservationsTable
            :reservations="reservations"
            :loading="reservationsIsLoading || reservationsIsPending"
            :empty-message="$t('pages.profile.reservations.empty')">
        </ProfileReservationsTable>
    </div>
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
        @apply flex flex-1 flex-col space-y-1;
        @apply md:space-y-3;

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
