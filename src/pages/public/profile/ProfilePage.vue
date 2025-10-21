<script setup lang="ts">
import Button from 'primevue/button';
import Card from 'primevue/card';
import Chip from 'primevue/chip';
import Skeleton from 'primevue/skeleton';
import ProfileQrCode from '@/components/features/profile/ProfileQrCode.vue';
import ProfileAvatar from '@/components/features/profile/avatar/ProfileAvatar.vue';
import ProfileAvatarDialog from '@/components/features/profile/avatar/ProfileAvatarDialog.vue';
import ProfileEditDialog from '@/components/features/profile/edit/ProfileEditDialog.vue';
import StatsCard from '@/components/features/profile/stats/StatsCard.vue';
import StatsCardSkeleton from '@/components/features/profile/stats/StatsCardSkeleton.vue';
import ReservationItem from '@/components/features/reservation/lists/ReservationItem.vue';
import ReservationItemSkeleton from '@/components/features/reservation/lists/ReservationItemSkeleton.vue';
import {
    faBuilding,
    faCalendarDays,
    faChartLine,
    faCheckCircle,
    faClock,
    faEnvelope,
    faUser,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useReadProfileReservations, useReadProfileStats } from '@/composables/data/useProfile';

const router = useRouter();

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

const showAvatarDialog = ref(false);
const showEditDialog = ref(false);

function openReservationsModal(): void {
    router.push({ name: 'profile.reservations' });
}
</script>

<template>
    <div class="mx-auto w-full max-w-[1080px] space-y-6">
        <!-- Profile Header -->
        <Card>
            <template #content>
                <div class="relative">
                    <!-- QR Code Section - Top Right -->
                    <div
                        v-if="!profileIsLoading && profile"
                        class="absolute top-0 right-0 flex h-full flex-col justify-start">
                        <ProfileQrCode :profile="profile" />
                    </div>

                    <!-- Main Profile Content -->
                    <div class="flex flex-col items-center gap-6 pr-20 md:flex-row">
                        <!-- Avatar Section -->
                        <template v-if="profileIsLoading || !profile">
                            <Skeleton shape="circle" size="96px" />
                        </template>
                        <template v-else>
                            <div class="max-w-[120px]">
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
                        <div class="flex-1 space-y-3">
                            <template v-if="profileIsLoading">
                                <Skeleton height="36px" width="200px" />
                                <Skeleton height="21px" width="300px" />
                                <Skeleton height="21px" width="250px" />
                            </template>
                            <template v-else-if="profile">
                                <!-- Name and Edit Button -->
                                <div class="flex items-center gap-3">
                                    <h1 class="text-2xl font-bold text-gray-900">
                                        {{ profile.firstName }} {{ profile.lastName }}
                                    </h1>
                                    <Button
                                        size="small"
                                        severity="secondary"
                                        text
                                        @click="showEditDialog = true"
                                        class="text-sm">
                                        Profiel Bewerken
                                    </Button>
                                    <ProfileEditDialog
                                        v-model:visible="showEditDialog"
                                        :profile="profile" />
                                </div>

                                <div class="flex items-center gap-2 text-gray-600">
                                    <FontAwesomeIcon :icon="faUser" class="text-gray-400" />
                                    @{{ profile.username }}
                                </div>
                                <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <div class="flex items-center gap-3">
                                        <FontAwesomeIcon :icon="faEnvelope" class="text-gray-400" />
                                        <span class="text-gray-700">{{ profile.email }}</span>
                                    </div>
                                    <div v-if="profile.institution" class="flex items-center gap-3">
                                        <FontAwesomeIcon :icon="faBuilding" class="text-gray-400" />
                                        <span class="text-gray-700">{{
                                            profile.institution?.name
                                        }}</span>
                                    </div>
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
                </div>
            </template>
        </Card>

        <!-- Stats Cards -->
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
            <template v-if="profileStatsIsLoading || profileStatsIsPending">
                <StatsCardSkeleton v-for="n in 4" :key="n" />
            </template>
            <template v-else>
                <!-- Total Reservations Card -->
                <StatsCard
                    :icon="faCalendarDays"
                    :value="profileStatsData?.totalReservations || 0"
                    label="Aantal reservaties"
                    icon-color="text-secondary-500">
                </StatsCard>

                <!-- Study Hours Card -->
                <StatsCard
                    :icon="faClock"
                    :value="`${profileStatsData?.totalReservationHours || 0}u`"
                    label="Uren gereserveerd"
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
                    label="Aanstaande reservaties"
                    icon-color="text-slate-500">
                </StatsCard>
            </template>
        </div>

        <!-- Current Week Activity -->
        <Card>
            <template #header>
                <div class="flex items-center justify-between p-6 pb-0">
                    <h2 class="text-xl font-semibold text-gray-900">Reservaties Deze Week</h2>
                    <Button size="small" severity="secondary" text @click="openReservationsModal">
                        Bekijk Kalender
                    </Button>
                </div>
            </template>
            <template #content>
                <div class="space-y-4">
                    <template v-if="reservationsIsLoading || reservationsIsPending">
                        <ReservationItemSkeleton v-for="n in 3" :key="n" />
                    </template>
                    <template v-else-if="reservations && reservations.length > 0">
                        <ReservationItem
                            v-for="reservation in reservations"
                            :key="reservation.id"
                            :reservation="reservation">
                        </ReservationItem>
                    </template>
                    <template v-else>
                        <div class="space-y-4 py-8 text-center text-gray-500">
                            <FontAwesomeIcon :icon="faCalendarDays" class="text-4xl" />
                            <p>Geen reservaties deze week</p>
                            <Button
                                severity="secondary"
                                outlined
                                size="small"
                                @click="router.push({ name: 'locations' })">
                                Bekijk Locaties
                            </Button>
                        </div>
                    </template>
                </div>
            </template>
        </Card>
    </div>
</template>
