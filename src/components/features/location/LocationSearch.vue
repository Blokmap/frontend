<script lang="ts" setup>
import { useGeoSearch } from '@/composables/data/useGeoCoding';
import { useLocationsSearch } from '@/composables/data/useLocations';
import type { LocationFilter } from '@/types/schema/Filter';
import {
    faCalendarDays,
    faMagnifyingGlass,
    faMapLocation,
    faQuoteLeft,
    faSpinner,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { type AutoCompleteOptionSelectEvent } from 'primevue';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import InputText from 'primevue/inputtext';
import { type ComponentPublicInstance, computed, nextTick, ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';

const { filters } = defineProps<{
    filters: LocationFilter;
}>();

const emit = defineEmits<{
    (e: 'update:filters', filters: Partial<LocationFilter>): void;
}>();

const isExpandedSearch = defineModel<boolean>('isExpandedSearch');

const searchText = ref(filters.query ?? '');
const openOnDate = ref(filters.openOn ?? null);
const geoSearchLocation = ref(filters.location ?? null);
const geoSearchText = ref(filters.location?.name ?? '');

const locationLabel = computed(() => {
    return filters.location?.name || geoSearchText.value || t('components.search.inNeighborhood');
});

const searchLabel = computed(() => {
    return filters.query || searchText.value || t('components.search.allLocations');
});

const dateLabel = computed(() => {
    const date = filters.openOn || openOnDate.value;

    if (date) {
        return date.toLocaleDateString(locale.value, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
    }

    return t('components.search.anyDay');
});

const { locale, t } = useI18n();
const { isFetching } = useLocationsSearch(filters, { enabled: false });
const { isLoading: isLoadingGeoSearch, data: geoSearchData } = useGeoSearch(geoSearchText);

const locationInputRef = useTemplateRef<ComponentPublicInstance>('locationInput');
const queryInputRef = useTemplateRef<ComponentPublicInstance>('queryInput');
const dateInputRef = useTemplateRef<ComponentPublicInstance>('dateInput');

/**
 * Handles the search button click event.
 * Updates the filters with the current search criteria and resets the input fields.
 */
function handleSearchClick(): void {
    emit('update:filters', {
        query: searchText.value,
        openOn: openOnDate.value,
        location: geoSearchLocation.value,
    });
}

/**
 * Handles the selection of a location option from the autocomplete suggestions.
 *
 * @param option - The selected location option.
 */
function handleLocationOptionSelect(option: AutoCompleteOptionSelectEvent): void {
    geoSearchLocation.value = option.value;
    geoSearchText.value = option.value.name;
}

/**
 * Handles the change event of the location input.
 * Resets the selected location when the input changes.
 */
function handleLocationOptionChange(): void {
    if (geoSearchLocation.value) {
        geoSearchText.value = '';
        geoSearchLocation.value = null;
    }
}

/**
 * Focuses the specified input field based on the provided field type.
 *
 * @param field - The field to focus ('location', 'query', or 'date').
 */
async function handleFocusField(field: 'location' | 'query' | 'date'): Promise<void> {
    isExpandedSearch.value = true;

    await nextTick();

    switch (field) {
        case 'location': {
            const el = locationInputRef.value?.$el?.querySelector('input');
            el?.focus();
            break;
        }
        case 'query': {
            const el = queryInputRef.value?.$el;
            el?.focus();
            break;
        }
        case 'date': {
            const el = dateInputRef.value?.$el?.querySelector('input');
            el?.focus();
            break;
        }
    }
}
</script>

<template>
    <div ref="search" class="search" @keydown.enter="handleSearchClick">
        <!-- City filter -->
        <div class="search--filter">
            <FontAwesomeIcon :icon="faMapLocation" />
            <template v-if="isExpandedSearch">
                <AutoComplete
                    ref="locationInput"
                    input-id="city"
                    placeholder="Zoek op locatie"
                    pt:pcInputText:root:class="search-input"
                    pt:overlay:class="!min-w-[200px]"
                    :loading="isLoadingGeoSearch"
                    :suggestions="geoSearchData"
                    v-model="geoSearchText"
                    option-label="name"
                    @change="handleLocationOptionChange"
                    @option-select="handleLocationOptionSelect">
                    <template #option="{ option }">
                        <div class="flex flex-col gap-1">
                            <div class="flex items-center gap-2">
                                <FontAwesomeIcon class="text-secondary-500" :icon="faMapLocation" />
                                {{ option.name }}
                                {{ option.province }}
                            </div>
                            <div class="text-sm text-slate-600">
                                {{ option.full_address }}
                            </div>
                        </div>
                    </template>
                    <template #empty>
                        <span class="text-sm text-slate-500">
                            {{ t('components.search.noResults') }}
                        </span>
                    </template>
                </AutoComplete>
            </template>
            <template v-else>
                <span class="w-full truncate" @click="handleFocusField('location')">
                    {{ locationLabel }}
                </span>
            </template>
        </div>

        <!-- Query filter -->
        <div class="search--filter">
            <FontAwesomeIcon :icon="faQuoteLeft" />
            <template v-if="isExpandedSearch">
                <InputText
                    ref="queryInput"
                    class="search-input"
                    id="query"
                    placeholder="Zoek op naam"
                    v-model="searchText">
                </InputText>
            </template>
            <template v-else>
                <span class="w-full truncate" @click="handleFocusField('query')">
                    {{ searchLabel }}
                </span>
            </template>
        </div>

        <!-- Date filter -->
        <div class="search--filter">
            <FontAwesomeIcon :icon="faCalendarDays" />
            <template v-if="isExpandedSearch">
                <DatePicker
                    v-model="openOnDate"
                    ref="dateInput"
                    placeholder="Open op datum"
                    dateFormat="dd/mm/yy"
                    inputId="openOnDay"
                    pt:pc-input-text:root:class="search-input"
                    @clear-click="openOnDate = null"
                    show-button-bar>
                </DatePicker>
            </template>
            <template v-else>
                <span class="w-full" @click="handleFocusField('date')">
                    {{ dateLabel }}
                </span>
            </template>
        </div>

        <!--  Search button -->
        <Button class="h-8 w-8 rounded-full" :disabled="isFetching" @click.stop="handleSearchClick">
            <FontAwesomeIcon :icon="faSpinner" spin v-if="isFetching" />
            <FontAwesomeIcon :icon="faMagnifyingGlass" v-else />
        </Button>
    </div>
</template>

<style>
@reference '@/assets/styles/main.css';

.search {
    @apply relative z-20 flex w-full max-w-[600px] min-w-[350px] origin-top cursor-pointer flex-row items-center justify-between gap-3;
    @apply rounded-full border-2 border-slate-200 bg-white px-5 py-1.5 text-center text-sm transition-all duration-300;

    .search--filter {
        @apply flex w-full items-center justify-center gap-2 font-medium text-slate-700;

        .search-input {
            @apply w-full border-0 p-0 text-center text-sm shadow-none;
        }
    }
}
</style>
