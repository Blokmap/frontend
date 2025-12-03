<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import Callout from '@/components/shared/molecules/Callout.vue';
import EntityAvatar from '@/components/shared/molecules/avatar/EntityAvatar.vue';
import LayoutContent from '@/layouts/LayoutContent.vue';
import LayoutTitle from '@/layouts/LayoutTitle.vue';
import {
    faBuilding,
    faEnvelope,
    faLocationDot,
    faPhone,
    faUsers,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useReadInstitutionAuthorities } from '@/composables/data/useAuthorities';
import { useReadInstitutionMembers } from '@/composables/data/useMembers';
import type { Institution } from '@/domain/institution';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    institution?: Institution;
    isLoading: boolean;
    error?: Error | null;
}>();

const { locale } = useI18n();

const institutionId = computed(() => props.institution?.id ?? 0);
const enabled = computed(() => !!props.institution?.id);

const filters = ref({});

const { data: authoritiesData } = useReadInstitutionAuthorities(institutionId, filters, {
    enabled,
});
const { data: membersData } = useReadInstitutionMembers(institutionId, { enabled });

const institutionName = computed(() => {
    const name = props.institution?.name;
    if (!name) return 'Instelling';
    return name[locale.value] ?? name.nl ?? 'Instelling';
});

const breadcrumbs = computed(() => [{ label: institutionName.value }, { label: 'Overzicht' }]);

const logoUrl = computed(() => props.institution?.logo?.url ?? undefined);

const address = computed(() => {
    if (!props.institution) return null;
    const { street, number, zip, city } = props.institution;
    if (!street && !city) return null;
    return `${street ?? ''} ${number ?? ''}, ${zip ?? ''} ${city ?? ''}`.trim();
});
</script>

<template>
    <LayoutContent>
        <ManageBreadcrumb :items="breadcrumbs" />
        <LayoutTitle :title="institutionName" />

        <p class="text-slate-600">Overzicht en instellingen van deze instelling.</p>

        <!-- Error State -->
        <Callout v-if="error" severity="error">
            Er ging iets mis bij het laden van de instelling. Probeer het later opnieuw.
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
                    <template v-else-if="institution">
                        <EntityAvatar :image="logoUrl" :icon="faBuilding" class="h-16 w-16" />
                        <div>
                            <h2 class="overview-header__title">{{ institutionName }}</h2>
                            <p class="overview-header__subtitle">{{ institution.category }}</p>
                        </div>
                    </template>
                </div>

                <!-- Contact Info -->
                <div v-if="!isLoading && institution" class="contact-info">
                    <div v-if="institution.email" class="contact-item">
                        <FontAwesomeIcon :icon="faEnvelope" class="contact-item__icon" />
                        <a :href="`mailto:${institution.email}`" class="contact-item__link">
                            {{ institution.email }}
                        </a>
                    </div>
                    <div v-if="institution.phone" class="contact-item">
                        <FontAwesomeIcon :icon="faPhone" class="contact-item__icon" />
                        <a :href="`tel:${institution.phone}`" class="contact-item__link">
                            {{ institution.phone }}
                        </a>
                    </div>
                    <div v-if="address" class="contact-item">
                        <FontAwesomeIcon :icon="faLocationDot" class="contact-item__icon" />
                        <span>{{ address }}</span>
                    </div>
                </div>
            </section>

            <!-- Stats -->
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-card__icon stat-card__icon--authorities">
                        <FontAwesomeIcon :icon="faBuilding" />
                    </div>
                    <div>
                        <p class="stat-card__value">{{ authoritiesData?.data?.length ?? 0 }}</p>
                        <p class="stat-card__label">Groepen</p>
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

.contact-info {
    @apply mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4;
}

.contact-item {
    @apply flex items-center gap-2 text-sm text-slate-600;
}

.contact-item__icon {
    @apply h-4 w-4 text-slate-400;
}

.contact-item__link {
    @apply text-primary-600 hover:underline;
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

.stat-card__icon--authorities {
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
