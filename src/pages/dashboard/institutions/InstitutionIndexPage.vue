<script setup lang="ts">
import Button from 'primevue/button';
import InstitutionTable from '@/components/features/institution/InstitutionTable.vue';
import SearchField from '@/components/shared/atoms/SearchField.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useDebounceFn } from '@vueuse/core';
import { ref } from 'vue';
import { useAdminCounts } from '@/composables/data/useAdmin';
import { useInstitutionsFiltered } from '@/composables/data/useInstitutions';
import { abbreviateCount } from '@/utils/format';
import type { Institution, InstitutionFilter } from '@/domain/institution';

const searchQuery = ref<string>('');

const filters = ref<InstitutionFilter>({
    query: '',
});

const { data: institutions, isFetching, isLoading } = useInstitutionsFiltered(filters);
const { data: counts } = useAdminCounts();

const onSearchChange = useDebounceFn(() => {
    filters.value.query = searchQuery.value;
}, 300);

const onInstitutionClick = (institution: Institution) => {
    console.log('Institution clicked:', institution);
};

const onCreateInstitution = () => {
    console.log('Create institution clicked');
};
</script>

<template>
    <div class="flex items-end justify-between gap-3">
        <div class="space-y-2">
            <h1 class="text-3xl font-bold">
                Alle Instellingen ({{ abbreviateCount(counts?.institutionCount) ?? '...' }})
            </h1>

            <p class="text-sm font-normal text-slate-700">
                <template v-if="institutions?.length">
                    {{ institutions.length }} resultaten getoond.
                </template>
                <template v-else> Geen instellingen gevonden. </template>
            </p>
        </div>
        <div class="flex gap-2">
            <SearchField
                v-model="searchQuery"
                placeholder="Zoek door alle instellingen..."
                :loading="isFetching"
                @input="onSearchChange">
            </SearchField>
            <Button severity="secondary" @click="onCreateInstitution">
                <FontAwesomeIcon :icon="faPlus" class="mr-2" />
                Nieuwe Instelling
            </Button>
        </div>
    </div>

    <InstitutionTable
        :institutions="institutions"
        :loading="isLoading"
        @click:institution="onInstitutionClick">
    </InstitutionTable>
</template>
