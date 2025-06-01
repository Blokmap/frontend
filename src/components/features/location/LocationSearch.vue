<script lang="ts" setup>
import {
    faMagnifyingGlass,
    faMinus,
    faPlus,
    faSliders,
    faTimes,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Badge from 'primevue/badge';
import Button from 'primevue/button';
import DatePicker from 'primevue/datepicker';
import Dialog from 'primevue/dialog';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';

const options = [
    { label: 'Reservable', value: 'reservable' },
    { label: 'Without Reservations', value: 'without' },
    { label: 'All Types', value: 'all' },
];

const tags = ref([
    { id: '1', name: { nl: 'Toegankelijk', en: 'Accessible' } },
    { id: '2', name: { nl: 'Binnen', en: 'Indoors' } },
    { id: '3', name: { nl: 'Gratis', en: 'Free' } },
]);

const showFilterDialog = ref(false);

const selectedIndex = ref(0);
const selectedTagIds = ref<string[]>([]);

// Dummy tag data example:

function selectTypeIndex(index: number): void {
    selectedIndex.value = index;
}

function toggleTag(id: string): void {
    if (selectedTagIds.value.includes(id)) {
        selectedTagIds.value = selectedTagIds.value.filter((tid) => tid !== id);
    } else {
        selectedTagIds.value.push(id);
    }
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
            <div class="flex flex-col gap-5 border-b-1 border-slate-100 pb-5">
                <h2 class="text-lg font-semibold">Availability</h2>
                <DatePicker
                    placeholder="Select a date range"
                    selection-mode="range"
                    date-format="M d"
                    :manual-input="false"
                    icon-display="input"
                    show-icon>
                </DatePicker>
            </div>
            <div class="flex flex-col gap-5 border-b-1 border-slate-100 py-5">
                <h2 class="text-lg font-semibold">Type</h2>
                <div class="inline-flex flex-col gap-2">
                    <div
                        class="relative flex rounded-full border border-slate-300 bg-white overflow-hidden">
                        <div
                            class="absolute top-0 left-0 h-full w-1/3 bg-gray-100 transition-transform duration-300 ease-in-out rounded-full"
                            :style="{ transform: `translateX(${selectedIndex * 100}%)` }"></div>
                        <button
                            v-for="(option, index) in options"
                            :key="option.value"
                            class="flex-1 z-10 py-2 text-sm font-medium transition-colors duration-200 cursor-pointer"
                            :class="{
                                'text-black': selectedIndex === index,
                                'text-gray-500': selectedIndex !== index,
                            }"
                            @click="selectTypeIndex(index)">
                            {{ option.label }}
                        </button>
                    </div>
                </div>
            </div>
            <div class="flex flex-col gap-5 pt-5">
                <h2 class="flex justify-between items-center text-lg font-semibold">
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
                </div>
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
