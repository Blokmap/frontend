<script lang="ts" setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import SelectButtons, { type SelectButtonOption } from '@/components/atoms/SelectButtons.vue';
import DateInput from '@/components/atoms/form/DateInput.vue';
import TimeInput from '@/components/atoms/form/TimeInput.vue';
import TagSelect from '@/components/molecules/tags/TagSelect.vue';
import { useDebounceFn } from '@vueuse/core';
import { storeToRefs } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useReadTags } from '@/composables/data/useTags';
import { useLocationFilters } from '@/composables/store/useLocationFilters';
import type { LocationSearchFilter } from '@/domain/location';
import type { Tag as TagType } from '@/domain/tag';
import type { Time } from '@/utils/time';

const filterStore = useLocationFilters();

const { filters, locations, isFetching } = storeToRefs(filterStore);

const { data: tags, isLoading: isLoadingTags } = useReadTags();

const visible = defineModel<boolean>('visible', {
    default: false,
});

const reservable = ref<boolean | null>(filters.value.reservable ?? null);
const openOnDay = ref<Date | null>(filters.value.openOnDay ?? null);
const openOnTime = ref<Time | null>(filters.value.openOnTime ?? null);
const selectedTags = ref<TagType[]>(filters.value.tags ?? []);

const reservableOptions = computed<SelectButtonOption<boolean | null>[]>(() => {
    return [
        { label: 'Geen voorkeur', value: null },
        { label: 'Reservatie vereist', value: true },
        { label: 'Zonder reservatie', value: false },
    ];
});

const clearAllFilters = () => {
    reservable.value = null;
    openOnDay.value = null;
    openOnTime.value = null;
    tags.value = [];
};

const debouncedFilterUpdate = useDebounceFn((filters: LocationSearchFilter) => {
    filterStore.updateFilters(filters);
}, 400);

watch([reservable, openOnDay, openOnTime, selectedTags], () => {
    debouncedFilterUpdate({
        page: 1,
        reservable: reservable.value,
        openOnDay: openOnDay.value,
        openOnTime: openOnTime.value,
        tags: selectedTags.value,
    });
});
</script>

<template>
    <Dialog class="w-full max-w-xl" v-model:visible="visible" modal closable>
        <template #header>
            <div class="dialog__header">
                <h2 class="dialog__title">Filters</h2>
            </div>
        </template>
        <template #default>
            <div class="dialog">
                <section class="dialog__section">
                    <h3 class="section__title">Reserveerbaarheid</h3>
                    <SelectButtons :options="reservableOptions" v-model="reservable" />
                </section>
                <section class="dialog__section grid grid-cols-2 gap-4">
                    <div class="section__subsection">
                        <h3 class="section__title">Open op dag</h3>
                        <DateInput
                            v-model:date="openOnDay"
                            placeholder="Selecteer datum"
                            show-clear>
                        </DateInput>
                    </div>
                    <div class="section__subsection">
                        <h3 class="section__title">Open op tijdstip</h3>
                        <TimeInput v-model="openOnTime" placeholder="Selecteer tijd" show-clear>
                        </TimeInput>
                    </div>
                </section>
                <section class="dialog__section">
                    <h3 class="section__title">Tags</h3>
                    <TagSelect v-model="selectedTags" :tags="tags" :loading="isLoadingTags" />
                </section>
            </div>
        </template>
        <template #footer>
            <Button severity="contrast" @click="clearAllFilters"> Verwijder alle filters </Button>
            <RouterLink :to="{ name: 'locations' }">
                <Button @click="visible = false" :disabled="isFetching">
                    Toon {{ locations?.total }} Resultaten
                </Button>
            </RouterLink>
        </template>
    </Dialog>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.dialog__header {
    @apply mx-auto;

    .dialog__title {
        @apply mx-auto text-center text-xl font-bold text-slate-700;
    }
}

.dialog {
    .dialog__section {
        @apply space-y-3 border-b border-slate-100 py-6;
        @apply first:pt-0 last:border-b-0;

        .section__title {
            @apply font-bold text-slate-700;
        }

        .section__subsection {
            @apply space-y-3;
        }
    }
}
</style>
