<script lang="ts" setup>
import studying from '@/assets/img/icon/studying.png';
import { useGeoSearch } from '@/composables/services/useGeoCoding';
import { useTags } from '@/composables/services/useLocations';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import type { ReservableOption } from '@/types/schema/Filter';
import { faMagnifyingGlass, faMapLocation } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { storeToRefs } from 'pinia';
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import { onMounted, watch } from 'vue';

defineProps<{
    isExpandedSearch?: boolean;
}>();

const emit = defineEmits<{
    (e: 'toggle:expanded', state?: boolean): void;
}>();

const { search, query } = useGeoSearch();
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

onMounted(() => {
    search.value = 'Kortemark';
});

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
        class="relative z-20 flex w-full max-w-[600px] min-w-[350px] origin-top cursor-pointer items-center justify-between gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm transition-all duration-500 hover:shadow-lg"
        @click.stop="handleSearchClick"
        :class="{ 'mt-[4rem] max-w-[960px]': isExpandedSearch }">
        <img :src="studying" class="h-6 w-6" />
        <!-- City filter -->
        <div class="flex items-center gap-2 font-medium text-slate-700">
            <template v-if="isExpandedSearch">
                <FloatLabel variant="on">
                    <AutoComplete
                        v-model="filters.city"
                        class="w-full"
                        pt:input:class="border-0 px-0"
                        inputId="city"
                        :loading="query.isLoading.value"
                        :suggestions="(query.data.value?.features ?? []) as any[]"
                        @complete="(e) => (search = e.query)">
                        <template #option="{ option }">
                            <div class="flex flex-col gap-1">
                                <div class="flex items-center gap-2">
                                    <FontAwesomeIcon :icon="faMapLocation" />
                                    {{ option.properties.name }}
                                </div>
                                <div class="text-sm text-slate-600">
                                    {{ option.properties.full_address }}
                                </div>
                            </div>
                        </template>
                    </AutoComplete>
                    <label for="city">Zoek op locatie</label>
                </FloatLabel>
            </template>
            <template v-else>
                <span>{{ filters.city || 'In de buurt' }}</span>
            </template>
        </div>

        <div class="h-6 w-px bg-slate-300"></div>

        <!-- Query filter -->
        <div class="flex items-center gap-2 font-medium text-slate-700">
            <template v-if="isExpandedSearch">
                <FloatLabel variant="on">
                    <InputText v-model="filters.query" id="query" />
                    <label for="query">Zoek op naam</label>
                </FloatLabel>
            </template>
            <template v-else>
                <span>{{ filters.query || 'Alle locaties' }}</span>
            </template>
        </div>

        <div class="h-6 w-px bg-slate-300"></div>

        <!-- Date filter -->
        <div class="flex items-center gap-2 font-medium text-slate-700">
            <template v-if="isExpandedSearch">
                <!-- <Calendar
                            v-model="filters.openOnDay"
                            placeholder="Kies datum"
                            dateFormat="dd/mm/yy"
                            showIcon>
                            </Calendar> -->
            </template>
            <template v-else>
                <span>{{ filters.openOnDay || 'Alle data' }}</span>
            </template>
        </div>
        <Button class="flex h-8 w-8 items-center overflow-hidden rounded-full">
            <FontAwesomeIcon :icon="faMagnifyingGlass" />
        </Button>
    </div>
</template>
