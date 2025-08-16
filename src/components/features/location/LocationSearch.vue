<script lang="ts" setup>
import { useGeoSearch } from '@/composables/data/useGeoCoding';
import type { LocationFilter } from '@/types/schema/Filter';
import {
    faCalendarDays,
    faClose,
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
import {
    type ComponentPublicInstance,
    computed,
    nextTick,
    ref,
    useTemplateRef,
    withDefaults,
} from 'vue';
import { useI18n } from 'vue-i18n';

const emit = defineEmits<{
    search: [];
}>();

const props = withDefaults(
    defineProps<{
        isSearching?: boolean;
    }>(),
    {
        isSearching: false,
    },
);

const filters = defineModel<LocationFilter>('filters', { required: true });
const isExpandedSearch = defineModel<boolean>('isExpandedSearch');
const geoLocation = defineModel<GeoJSON.GeoJsonProperties | null>('geoLocation');

const openOnDate = ref(filters.value.openOn);
const searchText = ref(filters.value.query);
const geoSearchText = ref(geoLocation.value?.name ?? '');

const { locale, t } = useI18n();
const { isLoading: isLoadingGeoSearch, data: geoSearchData } = useGeoSearch(geoSearchText);

const locationLabel = computed(() => {
    return geoLocation.value?.name || geoSearchText.value || t('components.search.inNeighborhood');
});

const hasActiveLocationFilter = computed(() => {
    return !!geoLocation.value;
});

const searchLabel = computed(() => {
    return filters.value.query || searchText.value || t('components.search.allLocations');
});

const dateLabel = computed(() => {
    const date = filters.value.openOn || openOnDate.value;

    if (date) {
        return date.toLocaleDateString(locale.value, {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
        });
    }

    return t('components.search.anyDay');
});

const locationInputRef = useTemplateRef<ComponentPublicInstance>('locationInput');
const queryInputRef = useTemplateRef<ComponentPublicInstance>('queryInput');
const dateInputRef = useTemplateRef<ComponentPublicInstance>('dateInput');

function handleSearchClick(): void {
    filters.value.query = searchText.value;
    filters.value.openOn = openOnDate.value;
    emit('search');
}

function handleLocationOptionSelect(option: AutoCompleteOptionSelectEvent): void {
    geoLocation.value = option.value;
    geoSearchText.value = option.value.name;
    isExpandedSearch.value = false;
}

function handleClickOutside(): void {
    isExpandedSearch.value = false;
}

function clearLocationFilter(): void {
    geoLocation.value = null;
    geoSearchText.value = '';
}

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
    <!-- Invisible overlay to handle outside clicks -->
    <div v-if="isExpandedSearch" class="fixed inset-0 z-10" @click="handleClickOutside"></div>

    <div ref="search" class="search" @keydown.enter="handleSearchClick" tabindex="-1">
        <!-- City filter -->
        <div class="search--filter" :class="{ 'has-active-filter': hasActiveLocationFilter }">
            <FontAwesomeIcon :icon="faMapLocation" />
            <template v-if="isExpandedSearch">
                <AutoComplete
                    ref="locationInput"
                    input-id="city"
                    option-label="name"
                    placeholder="Zoek op locatie"
                    pt:pcInputText:root:class="search-input"
                    pt:overlay:class="!min-w-[200px] mt-3"
                    :loading="isLoadingGeoSearch"
                    :suggestions="geoSearchData"
                    v-model="geoSearchText"
                    @option-select="handleLocationOptionSelect">
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
                <FontAwesomeIcon
                    :icon="faClose"
                    @click.stop="clearLocationFilter"
                    class="me-4"
                    v-if="hasActiveLocationFilter">
                </FontAwesomeIcon>
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
        <Button
            class="search-button bg-gradient-conic flex-shrink-0 rounded-full"
            :disabled="props.isSearching"
            @click.stop="handleSearchClick">
            <FontAwesomeIcon :icon="faSpinner" spin v-if="props.isSearching" />
            <FontAwesomeIcon :icon="faMagnifyingGlass" v-else />
        </Button>
    </div>
</template>

<style>
@reference '@/assets/styles/main.css';

.search {
    @apply relative z-20 flex w-full max-w-[600px] min-w-[350px] origin-top cursor-pointer flex-row items-center gap-3;
    @apply rounded-full border-2 border-slate-200 bg-white text-center text-sm transition-all duration-300;
    @apply ps-5;

    .search--filter {
        @apply flex w-full items-center justify-center gap-2 font-medium text-slate-700;
        @apply relative; /* For absolute positioning of clear button */

        .search-input {
            @apply w-full border-0 p-0 text-center text-sm shadow-none;
        }

        &.has-active-filter {
            @apply text-secondary-500;

            .fa-map-location {
                @apply text-secondary-500;
            }
        }
    }

    .search-button {
        @apply aspect-square h-[40px];
    }
}
</style>
