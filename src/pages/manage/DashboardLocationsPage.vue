<script lang="ts" setup>
import Button from 'primevue/button';
import LocationCardSkeleton from '@/components/features/location/LocationCardSkeleton.vue';
import LocationDetailCard from '@/components/features/location/LocationDetailCard.vue';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import Callout from '@/components/shared/molecules/Callout.vue';
import EmptyState from '@/components/shared/molecules/EmptyState.vue';
import LayoutContent from '@/layouts/LayoutContent.vue';
import LayoutTitle from '@/layouts/LayoutTitle.vue';
import { faMapMarkerAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useReadProfileLocationMemberships } from '@/composables/data/useMembers';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    profile: Profile;
    profileId?: string;
    isOtherProfile: boolean;
}>();

const profileId = computed(() => props.profileId ?? props.profile.id);

const { data: memberships, isLoading, error } = useReadProfileLocationMemberships(profileId);
</script>

<template>
    <LayoutContent>
        <ManageBreadcrumb :items="[{ label: 'Mijn locaties' }]" :profile-id="profileId" />

        <LayoutTitle title="Mijn locaties" />

        <p class="text-slate-600">Locaties waar je rechtstreeks beherend lid van bent.</p>

        <!-- Error State -->
        <Callout v-if="error" severity="error">
            Er ging iets mis bij het laden van je locaties. Probeer het later opnieuw.
        </Callout>

        <!-- Empty State -->
        <EmptyState
            v-else-if="!isLoading && memberships?.length === 0"
            :icon="faMapMarkerAlt"
            title="Geen locaties"
            message="Je bent nog geen lid van een locatie.">
            <template #actions>
                <RouterLink :to="{ name: 'locations.submit' }">
                    <Button>
                        <FontAwesomeIcon :icon="faPlus" />
                        <span>Nieuwe locatie registreren</span>
                    </Button>
                </RouterLink>
            </template>
        </EmptyState>

        <!-- Loading State -->
        <div v-else-if="isLoading" class="locations-grid">
            <LocationCardSkeleton v-for="i in 6" :key="i" />
        </div>

        <!-- Data State -->
        <TransitionGroup v-else name="staggered-cards" tag="div" class="locations-grid" appear>
            <div
                v-for="({ location }, index) in memberships"
                :key="location.id"
                :style="{ '--i': index }"
                class="location-card-wrapper">
                <LocationDetailCard
                    :location="location"
                    :to="{
                        name: 'manage.location',
                        params: { locationId: location.id },
                    }">
                </LocationDetailCard>
            </div>
        </TransitionGroup>
    </LayoutContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.locations-grid {
    @apply grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3;
}

.location-card-wrapper {
    @apply h-full;
}

.staggered-cards-enter-active {
    transition-delay: calc(var(--i) * 0.05s);
}

.staggered-cards-leave-active {
    transition-delay: calc(var(--i) * 0.02s);
}
</style>
