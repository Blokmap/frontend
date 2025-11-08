<script setup lang="ts">
import Card from 'primevue/card';
import ProfileHeader from '@/components/features/profile/ProfileHeader.vue';
import ProfileQrCode from '@/components/features/profile/ProfileQrCode.vue';
import ProfileAvatarDialog from '@/components/features/profile/avatar/ProfileAvatarDialog.vue';
import StatsCard from '@/components/features/profile/stats/StatsCard.vue';
import StatsCardSkeleton from '@/components/features/profile/stats/StatsCardSkeleton.vue';
import ProfileReservationsTable from '@/components/features/reservation/table/ProfileReservationsTable.vue';
import { faCalendarDays, faChartLine, faClock } from '@fortawesome/free-solid-svg-icons';
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
                <ProfileHeader
                    :profile="profile ?? undefined"
                    :loading="profileIsLoading"
                    editable
                    @click:edit="showAvatarDialog = true">
                </ProfileHeader>

                <ProfileAvatarDialog
                    v-if="profile"
                    v-model:visible="showAvatarDialog"
                    :profile="profile">
                </ProfileAvatarDialog>

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
</style>
