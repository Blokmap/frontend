<script setup lang="ts">
import SubmitLocationCTA from '@/components/features/layout/SubmitLocationCTA.vue';
import StatsCard from '@/components/features/profile/StatsCard.vue';
import StatsCardSkeleton from '@/components/features/profile/StatsCardSkeleton.vue';
import ReservationItem from '@/components/features/reservation/ReservationItem.vue';
import ReservationItemSkeleton from '@/components/features/reservation/ReservationItemSkeleton.vue';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useProfileStats } from '@/composables/data/useProfile';
import { useProfileReservations } from '@/composables/data/useReservations';
import { getProfileInitials } from '@/utils/profile';
import {
    faAward,
    faBuilding,
    faCalendarDays,
    faChartLine,
    faCheckCircle,
    faClock,
    faEnvelope,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Avatar from 'primevue/avatar';
import Button from 'primevue/button';
import Card from 'primevue/card';
import Chip from 'primevue/chip';
import Skeleton from 'primevue/skeleton';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const router = useRouter();
const { t } = useI18n();

const { isLoading: profileIsLoading, data: profile, profileId } = useAuthProfile();

const {
    isLoading: reservationsIsLoading,
    isPending: reservationsIsPending,
    data: reservations,
} = useProfileReservations(profileId);

const {
    isLoading: profileStatsIsLoading,
    isPending: profileStatsIsPending,
    data: profileStatsData,
} = useProfileStats(profileId);

const reservationsLoading = computed(
    () => reservationsIsLoading.value || reservationsIsPending.value,
);

const profileStatsLoading = computed(
    () => profileStatsIsLoading.value || profileStatsIsPending.value,
);
</script>

<template>
    <div class="mx-auto w-full max-w-[1080px] space-y-6">
        <!-- Profile Header -->
        <Card>
            <template #content>
                <div class="flex flex-col items-center gap-6 md:flex-row">
                    <!-- Avatar Section -->
                    <div class="flex flex-col items-center gap-4">
                        <template v-if="profileIsLoading || !profile">
                            <Skeleton shape="circle" size="96px" />
                        </template>
                        <template v-else>
                            <Avatar
                                :label="getProfileInitials(profile)"
                                class="profile-avatar"
                                size="xlarge"
                                shape="circle">
                            </Avatar>
                        </template>
                    </div>

                    <!-- Profile Info -->
                    <div class="flex-1 space-y-3">
                        <template v-if="profileIsLoading">
                            <Skeleton height="36px" width="200px" />
                            <Skeleton height="21px" width="300px" />
                            <Skeleton height="21px" width="250px" />
                        </template>
                        <template v-else-if="profile">
                            <h1 class="text-3xl font-bold text-gray-900">
                                {{ profile.firstName }} {{ profile.lastName }}
                            </h1>
                            <div class="flex items-center gap-2 text-gray-600">
                                <FontAwesomeIcon :icon="faUser" class="text-gray-400" />
                                @{{ profile.username }}
                            </div>
                            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div class="flex items-center gap-3">
                                    <FontAwesomeIcon :icon="faEnvelope" class="text-gray-400" />
                                    <span class="text-gray-700">{{ profile.email }}</span>
                                </div>
                                <div class="flex items-center gap-3" v-if="profile.institution">
                                    <FontAwesomeIcon :icon="faBuilding" class="text-gray-400" />
                                    <span class="text-gray-700">{{
                                        profile.institution?.name
                                    }}</span>
                                </div>
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

        <!-- Stats Cards -->
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
            <template v-if="profileStatsLoading">
                <StatsCardSkeleton v-for="n in 4" :key="n" />
            </template>
            <template v-else>
                <!-- Total Reservations Card -->
                <StatsCard
                    :icon="faCalendarDays"
                    :value="profileStatsData?.totalReservations || 0"
                    label="Aantal reservaties"
                    icon-color="text-primary-500">
                </StatsCard>

                <!-- Study Hours Card -->
                <StatsCard
                    :icon="faClock"
                    :value="`${profileStatsData?.totalReservationHours || 0}u`"
                    label="Studieuren"
                    icon-color="text-secondary-500">
                </StatsCard>

                <!-- Completed Card -->
                <StatsCard
                    :icon="faCheckCircle"
                    :value="profileStatsData?.completedReservations || 0"
                    label="Voltooide reservaties"
                    icon-color="text-slate-500">
                </StatsCard>

                <!-- Upcoming Card -->
                <StatsCard
                    :icon="faChartLine"
                    :value="profileStatsData?.upcomingReservations || 0"
                    label="Komende reservaties"
                    icon-color="text-slate-500">
                </StatsCard>
            </template>
        </div>

        <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <!-- Current Week Activity -->
            <Card>
                <template #header>
                    <div class="flex items-center justify-between p-6 pb-0">
                        <h2 class="text-xl font-semibold text-gray-900">Reservaties Deze Week</h2>
                        <RouterLink :to="{ name: 'profile.reservations' }">
                            <Button size="small" severity="secondary" text>
                                Bekijk Kalender
                            </Button>
                        </RouterLink>
                    </div>
                </template>
                <template #content>
                    <div class="space-y-4">
                        <template v-if="reservationsLoading">
                            <ReservationItemSkeleton v-for="n in 3" :key="n" />
                        </template>
                        <template v-else-if="reservations">
                            <ReservationItem
                                v-for="reservation in reservations"
                                :key="reservation.id"
                                :reservation="reservation">
                            </ReservationItem>
                        </template>
                        <template v-else>
                            <div class="py-8 text-center text-gray-500">
                                <FontAwesomeIcon :icon="faCalendarDays" class="mb-4 text-4xl" />
                                <p>Geen reservaties deze week</p>
                                <p class="text-sm">
                                    Begin met het verkennen van locaties om je eerste reservatie te
                                    maken!
                                </p>
                            </div>
                        </template>
                    </div>
                </template>
            </Card>

            <!-- Achievements -->
            <Card>
                <template #header>
                    <h2 class="p-6 pb-0 text-xl font-semibold text-gray-900">Prestaties</h2>
                </template>
                <template #content>
                    <div class="space-y-3">
                        <template v-if="false"> </template>
                        <template v-else>
                            <div class="py-6 text-center text-gray-500">
                                <FontAwesomeIcon :icon="faAward" class="mb-3 text-3xl" />
                                <p class="text-sm">
                                    Maak meer reservatie om prestaties te ontgrendelen!
                                </p>
                            </div>
                        </template>
                    </div>
                </template>
            </Card>
        </div>

        <SubmitLocationCTA />
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.profile-avatar {
    @apply bg-gradient-conic text-white;
    @apply h-[6rem] w-[6rem] text-3xl font-bold;
}
</style>
