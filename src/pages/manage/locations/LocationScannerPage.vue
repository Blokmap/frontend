<script lang="ts" setup>
import ManageBreadcrumb from '@/components/shared/molecules/Breadcrumb.vue';
import LayoutContent from '@/layouts/LayoutContent.vue';
import LayoutTitle from '@/layouts/LayoutTitle.vue';
import { computed } from 'vue';
import type { Location } from '@/domain/location';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    location?: Location;
    isLoading: boolean;
    error?: Error | null;
}>();

const breadcrumbs = computed(() => [
    { label: 'Mijn locaties', to: { name: 'manage.locations' } },
    { label: props.location?.name ?? 'Locatie', to: { name: 'manage.location.info' } },
    { label: 'Scanner' },
]);
</script>

<template>
    <LayoutContent>
        <ManageBreadcrumb :items="breadcrumbs" />
        <LayoutTitle title="Scanner" />

        <p class="text-slate-600">
            Scan QR-codes om reservaties te bevestigen wanneer studenten aanwezig zijn.
        </p>

        <!-- Debug: Raw data output -->
        <div v-if="!isLoading && location" class="space-y-4">
            <details class="rounded-lg border border-slate-200 p-4" open>
                <summary class="cursor-pointer font-semibold">Locatie data (voor scanner)</summary>
                <pre class="mt-2 overflow-auto text-xs">{{
                    JSON.stringify(
                        {
                            id: location.id,
                            name: location.name,
                            isReservable: location.isReservable,
                        },
                        null,
                        2,
                    )
                }}</pre>
            </details>
        </div>

        <div v-else-if="isLoading" class="text-slate-500">Laden...</div>
        <div v-else-if="error" class="text-red-500">Fout bij laden: {{ error.message }}</div>
    </LayoutContent>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
