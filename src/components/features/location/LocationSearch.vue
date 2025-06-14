<script lang="ts" setup>
import { useTags } from '@/composables/services/useLocations';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import type { ReservableOption } from '@/types/schema/Filter';
import {
    faMagnifyingGlass,
    faMinus,
    faPlus,
    faSliders,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { storeToRefs } from 'pinia';
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import { computed, ref } from 'vue';

const { reservableOptions, updateFilters } = useLocationFilters();
const { filters } = storeToRefs(useLocationFilters());
const { tags } = useTags();

const showFilterDialog = ref(false);
const selectedReservableIndex = computed(() => {
    return reservableOptions.findIndex((option) => option.value == filters.value.isReservable);
});

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
    <Dialog
        class="mx-3 max-w-full w-xl"
        v-model:visible="showFilterDialog"
        :draggable="false"
        modal>
        <template #header>
            <h2 class="text-center text-lg font-bold w-full">Filters</h2>
        </template>
        <template #default>
            <div class="flex flex-col gap-4 border-b-2 border-slate-200 pb-5">
                <h2 class="text-lg font-semibold">Type</h2>
                <div
                    class="relative flex rounded-full border-2 border-slate-200 bg-white overflow-hidden">
                    <div
                        class="absolute inset-y-0 left-0 w-1/3 border border-primary bg-primary transition-transform duration-300 rounded-full"
                        :style="{
                            transform: `translateX(${selectedReservableIndex * 100}%)`,
                        }" />
                    <button
                        v-for="option in reservableOptions"
                        :key="option.label"
                        class="flex-1 z-10 py-2 text-sm font-medium transition-colors duration-200"
                        :class="{ 'text-primary-contrast': filters.isReservable == option.value }"
                        @click="setReservableOption(option)">
                        {{ option.label }}
                    </button>
                </div>
            </div>
            <div class="flex flex-col gap-4 border-b-2 border-slate-200 py-5">
                <h2 class="text-lg font-semibold">Availability</h2>
                <DatePicker
                    placeholder="Choose a opening date"
                    date-format="M d"
                    icon-display="input"
                    show-time
                    show-icon>
                </DatePicker>
            </div>
            <div class="flex flex-col gap-4 pt-5">
                <!-- <h2 class="flex justify-between items-center text-lg font-semibold">
                    Features <Badge :value="selectedTagIds.length" severity="secondary" />
                </h2>
                <div class="inline-flex flex-wrap gap-2">
                    <button
                        v-for="tag in tags"
                        :key="tag.id"
                        @click="toggleTag(tag.id)"
                        class="rounded-full px-4 py-1 text-sm font-medium border transition-colors duration-200"
                        :class="{
                            'bg-primary text-white border-primary': selectedTagIds.includes(tag.id),
                            'bg-white text-gray-700 border-gray-300 hover:bg-gray-50':
                                !selectedTagIds.includes(tag.id),
                        }">
                        <FontAwesomeIcon
                            :icon="selectedTagIds.includes(tag.id) ? faMinus : faPlus" />{{
                            tag.name.nl
                        }}
                    </button>
                </div> -->
            </div>
        </template>
        <template #footer>
            <Button label="Clear Filters" class="me-auto text-color" text>
                <template #icon>
                    <FontAwesomeIcon :icon="faTimes" />
                </template>
            </Button>
            <Button severity="contrast" label="Apply Filters">
                <template #icon>
                    <FontAwesomeIcon :icon="faSliders" />
                </template>
            </Button>
        </template>
    </Dialog>
    <IconField>
        <InputIcon>
            <FontAwesomeIcon :icon="faMagnifyingGlass" />
        </InputIcon>
        <InputText class="w-full" placeholder="Search for locations"> </InputText>
        <InputIcon
            v-tooltip.top="'Configure Filters'"
            class="cursor-pointer"
            @click="showFilterDialog = !showFilterDialog">
            <FontAwesomeIcon class="hover:scale-[1.1] transition-transform" :icon="faSliders" />
        </InputIcon>
    </IconField>
</template>
