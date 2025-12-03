<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import Callout from '@/components/shared/molecules/Callout.vue';
import EntityAvatar from '@/components/shared/molecules/avatar/EntityAvatar.vue';
import LayoutContent from '@/layouts/LayoutContent.vue';
import LayoutTitle from '@/layouts/LayoutTitle.vue';
import { faBuilding, faMapMarkerAlt, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useReadAuthorityLocations } from '@/composables/data/useLocations';
import { useReadAuthorityMembers } from '@/composables/data/useMembers';
import type { Authority } from '@/domain/authority';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    authority?: Authority;
    isLoading: boolean;
    error?: Error | null;
}>();

const authorityId = computed(() => props.authority?.id ?? 0);
const enabled = computed(() => !!props.authority?.id);

const { data: locations } = useReadAuthorityLocations(authorityId, { enabled });
const { data: membersData } = useReadAuthorityMembers(authorityId, { enabled });

const breadcrumbs = computed(() => [
    { label: props.authority?.name ?? 'Groep' },
    { label: 'Overzicht' },
]);

const logoUrl = computed(() => props.authority?.logo?.url ?? undefined);
</script>

<template>
    <LayoutContent>
        <ManageBreadcrumb :items="breadcrumbs" />
        <LayoutTitle :title="authority?.name ?? 'Groep overzicht'" />

        <p class="text-slate-600">Overzicht en instellingen van deze groep.</p>

        <!-- Error State -->
        <Callout v-if="error" severity="error">
            Er ging iets mis bij het laden van de groep. Probeer het later opnieuw.
        </Callout>

        <!-- Content -->
        <template v-else>
            <!-- Header Card -->
            <section class="overview-card">
                <div class="overview-header">
                    <template v-if="isLoading">
                        <Skeleton shape="circle" size="4rem" />
                        <div class="flex-1">
                            <Skeleton height="1.5rem" width="200px" class="mb-2" />
                            <Skeleton height="1rem" width="150px" />
                        </div>
                    </template>
                    <template v-else-if="authority">
                        <EntityAvatar :image="logoUrl" :icon="faBuilding" class="h-16 w-16" />
                        <div>
                            <h2 class="overview-header__title">{{ authority.name }}</h2>
                            <p v-if="authority.institution" class="overview-header__subtitle">
                                {{ authority.institution.name }}
                            </p>
                        </div>
                    </template>
                </div>

                <p v-if="authority?.description" class="overview-card__description">
                    {{ authority.description }}
                </p>
            </section>

            <!-- Stats -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-card__icon stat-card__icon--locations">
                        <FontAwesomeIcon :icon="faMapMarkerAlt" />
                    </div>
                    <div>
                        <p class="stat-card__value">{{ locations?.length ?? 0 }}</p>
                        <p class="stat-card__label">Locaties</p>
                    </div>
                </div>

                <div class="stat-card">
                    <div class="stat-card__icon stat-card__icon--members">
                        <FontAwesomeIcon :icon="faUsers" />
                    </div>
                    <div>
                        <p class="stat-card__value">{{ membersData?.data?.length ?? 0 }}</p>
                        <p class="stat-card__label">Leden</p>
                    </div>
                </div>
            </div>
        </template>
    </LayoutContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.overview-card {
    @apply rounded-xl border border-slate-200 bg-white p-4 lg:p-6;
}

.overview-header {
    @apply flex items-center gap-4;
}

.overview-header__title {
    @apply text-xl font-bold text-slate-900;
}

.overview-header__subtitle {
    @apply text-sm text-slate-500;
}

.overview-card__description {
    @apply mt-4 text-sm leading-relaxed text-slate-600;
}

.stats-grid {
    @apply grid grid-cols-2 gap-4;
}

.stat-card {
    @apply flex items-center gap-4 rounded-xl border border-slate-200 bg-white p-4;
}

.stat-card__icon {
    @apply flex h-12 w-12 items-center justify-center rounded-lg text-lg;
}

.stat-card__icon--locations {
    @apply bg-primary-100 text-primary-600;
}

.stat-card__icon--members {
    @apply bg-emerald-100 text-emerald-600;
}

.stat-card__value {
    @apply text-2xl font-bold text-slate-900;
}

.stat-card__label {
    @apply text-sm text-slate-500;
}
</style>
