<script lang="ts" setup>
import { useGeoSearch } from '@/composables/services/useGeoCoding';
import { useTags } from '@/composables/services/useLocations';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import type { ReservableOption } from '@/types/schema/Filter';
import { faMagnifyingGlass, faMapLocation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { storeToRefs } from 'pinia';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import { watch } from 'vue';

defineProps<{
    isExpandedSearch?: boolean;
}>();

const emit = defineEmits<{
    (e: 'toggle:expanded', state?: boolean): void;
}>();

const { search, searchResults, searchIsLoading } = useGeoSearch();
const { reservableOptions, updateFilters } = useLocationFilters();
const { filters } = storeToRefs(useLocationFilters());
const { tags } = useTags();

// Watch selected value and sync to search input
watch(
    () => filters.value.city,
    (city?: string | null) => {
        if (city !== search.value) {
            search.value = city ?? '';
        }
    },
);

/**
 * Handles the click event on the search field to toggle the expanded search state.
 */
function handleSearchClick(): void {
    emit('toggle:expanded', true);
}

/**
 * Update the filters to set the selected reservable option.
 *
 * @param option The reservable option to set.
 */
function setReservableOption(option: ReservableOption): void {
    updateFilters({ isReservable: option.value });
}
</script>

<template>
    <div
        ref="search"
        class="gap- relative z-20 flex w-full max-w-[600px] min-w-[350px] origin-top cursor-pointer items-center justify-between rounded-full border border-slate-200 bg-white px-5 py-2 text-center text-sm shadow-sm transition-all duration-500 hover:shadow-lg"
        @click.stop="handleSearchClick"
        :class="{ 'mt-[4rem] max-w-[960px]': isExpandedSearch }">
        <!-- City filter -->
        <div class="flex w-full items-center justify-center gap-2 font-medium text-slate-700">
            <template v-if="isExpandedSearch">
                <FloatLabel variant="on">
                    <AutoComplete
                        inputId="city"
                        :loading="searchIsLoading"
                        :suggestions="searchResults"
                        @complete="(e) => (search = e.query)">
                        <template #option="{ option }">
                            <div class="flex flex-col gap-1">
                                <div class="flex items-center gap-2">
                                    <FontAwesomeIcon :icon="faMapLocation" />
                                    {{ option.name }}
                                    {{ option.province }}
                                </div>
                                <div class="text-sm text-slate-600">
                                    {{ option.full_address }}
                                </div>
                            </div>
                        </template>
                    </AutoComplete>
                    <label for="city" class="text-nowrap">Zoek op locatie</label>
                </FloatLabel>
            </template>
            <template v-else>
                <span>{{ filters.city || 'In de buurt' }}</span>
            </template>
        </div>

        <div class="h-6 w-[3px] bg-slate-300"></div>

        <!-- Query filter -->
        <div class="flex w-full items-center justify-center gap-2 font-medium text-slate-700">
            <template v-if="isExpandedSearch">
                <FloatLabel variant="on">
                    <InputText v-model="filters.query" id="query" />
                    <label for="query" class="text-nowrap">Zoek op naam</label>
                </FloatLabel>
            </template>
            <template v-else>
                <span>{{ filters.query || 'Alle locaties' }}</span>
            </template>
        </div>

        <div class="h-6 w-[3px] bg-slate-300"></div>

        <!-- Date filter -->
        <div
            class="flex w-full items-center justify-center gap-2 overflow-hidden font-medium text-slate-700">
            <template v-if="isExpandedSearch">
                <FloatLabel variant="on">
                    <DatePicker
                        v-model="filters.openOnDay"
                        dateFormat="dd/mm/yy"
                        inputId="openOnDay">
                    </DatePicker>
                    <label for="openOnDay" class="text-nowrap">Open op datum</label>
                </FloatLabel>
            </template>
            <template v-else>
                <span>{{ filters.openOnDay || 'Alle data' }}</span>
            </template>
        </div>
        <RouterLink :to="{ name: 'locations' }" @click.stop>
            <Button class="flex h-8 w-8 items-center overflow-hidden rounded-full">
                <FontAwesomeIcon :icon="faMagnifyingGlass" />
            </Button>
        </RouterLink>
    </div>
</template>
