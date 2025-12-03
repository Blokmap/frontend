<script lang="ts" setup>
import LayoutContent from '@/layouts/LayoutContent.vue';
import LayoutTitle from '@/layouts/LayoutTitle.vue';
import { computed } from 'vue';
import {
    useReadProfileLocationMemberships,
    useReadProfileAuthorityMemberships,
    useReadProfileInstitutionMemberships,
} from '@/composables/data/useMembers';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    profile: Profile;
}>();

const profileId = computed(() => props.profile.id);

// Fetch all memberships for overview
const { data: locationMemberships, isLoading: locationsLoading } =
    useReadProfileLocationMemberships(profileId);

const { data: authorityMemberships, isLoading: authoritiesLoading } =
    useReadProfileAuthorityMemberships(profileId);

const { data: institutionMemberships, isLoading: institutionsLoading } =
    useReadProfileInstitutionMemberships(profileId);

const isLoading = computed(
    () => locationsLoading.value || authoritiesLoading.value || institutionsLoading.value,
);
</script>

<template>
    <LayoutContent>
        <LayoutTitle title="Dashboard" />

        <p class="text-slate-600">
            Welkom in de beheermodus, {{ profile.firstName }}. Hier kun je al je locaties en
            organisaties beheren.
        </p>

        <!-- Debug: Raw data output -->
        <div v-if="!isLoading" class="space-y-4">
            <details class="rounded-lg border border-slate-200 p-4">
                <summary class="cursor-pointer font-semibold">
                    Locatie lidmaatschappen ({{ locationMemberships?.length ?? 0 }})
                </summary>
                <pre class="mt-2 overflow-auto text-xs">{{
                    JSON.stringify(locationMemberships, null, 2)
                }}</pre>
            </details>

            <details class="rounded-lg border border-slate-200 p-4">
                <summary class="cursor-pointer font-semibold">
                    Groep lidmaatschappen ({{ authorityMemberships?.length ?? 0 }})
                </summary>
                <pre class="mt-2 overflow-auto text-xs">{{
                    JSON.stringify(authorityMemberships, null, 2)
                }}</pre>
            </details>

            <details class="rounded-lg border border-slate-200 p-4">
                <summary class="cursor-pointer font-semibold">
                    Instelling lidmaatschappen ({{ institutionMemberships?.length ?? 0 }})
                </summary>
                <pre class="mt-2 overflow-auto text-xs">{{
                    JSON.stringify(institutionMemberships, null, 2)
                }}</pre>
            </details>
        </div>

        <div v-else class="text-slate-500">Laden...</div>
    </LayoutContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
