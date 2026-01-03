<script lang="ts" setup>
import Dialog from 'primevue/dialog';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Paginator from 'primevue/paginator';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, computed } from 'vue';
import { usePagination } from '@/composables/usePagination';
import { FA_ICON_PACKS } from '@/config/faConfig';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

defineProps<{
    placeholder?: string;
    id?: string;
}>();

const selected = defineModel<string | null>();

const visible = ref<boolean>(false);
const filters = ref({ page: 1, perPage: 32, query: '' });

const { onPageChange, first, resetPage } = usePagination(filters);

const allIcons = computed<IconDefinition[]>(() => {
    const icons: IconDefinition[] = [];

    for (const pack of FA_ICON_PACKS) {
        const iconDefs = Object.values(pack);
        icons.push(...iconDefs);
    }

    return icons.sort((a, b) => a.iconName.localeCompare(b.iconName));
});

const filteredIcons = computed(() => {
    if (!filters.value.query.trim()) {
        return allIcons.value;
    }

    const q = filters.value.query.toLowerCase();

    return allIcons.value.filter((icon) => {
        return icon.iconName.toLowerCase().includes(q);
    });
});

const paginatedIcons = computed(() => {
    const start = ((filters.value.page ?? 1) - 1) * (filters.value.perPage ?? 48);
    const end = start + (filters.value.perPage ?? 48);
    return filteredIcons.value.slice(start, end);
});

const paginatedData = computed(() => ({
    data: paginatedIcons.value,
    page: filters.value.page ?? 1,
    perPage: filters.value.perPage ?? 48,
    total: filteredIcons.value.length,
    truncated: false,
}));

const openModal = () => {
    visible.value = true;
    filters.value.query = '';
    resetPage(false);
};

const closeModal = () => {
    visible.value = false;
};

const selectIcon = (icon: IconDefinition) => {
    selected.value = `${icon.prefix} ${icon.iconName}`;
    closeModal();
};

const onSearchInput = () => {
    resetPage(false);
};
</script>

<template>
    <div class="input-icon">
        <IconField>
            <InputIcon>
                <FontAwesomeIcon :icon="selected?.split(' ') ?? faTag" />
            </InputIcon>
            <InputText
                :id="id"
                :model-value="selected"
                :placeholder="placeholder"
                class="w-full"
                @click="openModal"
                readonly>
            </InputText>
        </IconField>

        <Dialog
            v-model:visible="visible"
            header="Select an Icon"
            class="w-full max-w-[800px]"
            :dismissable-mask="true"
            @hide="closeModal"
            modal>
            <div class="icon-picker">
                <div class="icon-picker__search">
                    <InputText
                        v-model="filters.query"
                        placeholder="Search icons..."
                        class="w-full"
                        @input="onSearchInput">
                    </InputText>
                </div>

                <div class="icon-picker__grid">
                    <button
                        v-for="icon in paginatedIcons"
                        class="icon-picker__item"
                        type="button"
                        :key="icon.prefix + icon.iconName"
                        :title="icon.iconName"
                        @click="selectIcon(icon)">
                        <FontAwesomeIcon :icon="icon" class="icon-picker__icon" />
                    </button>
                </div>

                <div v-if="filteredIcons.length === 0" class="icon-picker__empty">
                    No icons found matching "{{ filters.query }}"
                </div>

                <div
                    v-if="paginatedData.total > (filters.perPage ?? 48)"
                    class="icon-picker__filters">
                    <Paginator
                        :rows="paginatedData.perPage"
                        :total-records="paginatedData.total"
                        :first="first(paginatedData)"
                        @page="onPageChange">
                    </Paginator>
                </div>
            </div>
        </Dialog>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.icon-picker {
    @apply space-y-4;

    .icon-picker__search {
        @apply mb-4;
    }

    .icon-picker__grid {
        @apply grid grid-cols-6 items-start gap-2 md:grid-cols-8;

        .icon-picker__item {
            @apply flex aspect-square flex-col items-center justify-center gap-1 p-3;
            @apply hover:bg-secondary-50 rounded border border-gray-200 bg-white transition-all;

            .icon-picker__icon {
                @apply text-2xl text-gray-700;
            }
        }
    }

    .icon-picker__empty {
        @apply py-12 text-center text-gray-500;
    }

    .icon-picker__filters {
        @apply border-t border-gray-200 pt-4;
    }
}
</style>
