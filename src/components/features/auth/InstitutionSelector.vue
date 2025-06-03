<script lang="ts" setup>
import { useMessages } from '@/composables/useMessages';
import type { Institution } from '@/types/schema/Institution';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Skeleton from 'primevue/skeleton';
import { useI18n } from 'vue-i18n';

defineProps<{
    institutions?: Institution[];
    isLoading: boolean;
}>();

const { showMessage } = useMessages();
const { locale } = useI18n();

function handleInstitutionSelection(institution: Institution): void {
    showMessage({
        severity: 'warn',
        summary: 'Not implemented',
        detail: `You can't log in with ${institution.slug[locale.value as any]!} yet.`,
    });
}
</script>

<template>
    <div class="grid grid-cols-2 gap-3 my-4">
        <template v-if="isLoading">
            <Skeleton height="96px" v-for="_ in 9" />
        </template>
        <template v-for="institution in institutions" :key="institution.name" v-else>
            <div
                class="flex items-center gap-4 p-4 border-2 border-slate-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                @click="handleInstitutionSelection(institution)">
                <img
                    :src="institution.logo.url"
                    :alt="institution.name[locale as any]!"
                    class="w-15 h-15 object-contain" />
                <div>
                    <h3 class="text-lg font-semibold">{{ institution.name[locale] }}</h3>
                    <p class="text-sm text-gray-600">{{ institution.slug[locale] }}</p>
                </div>
            </div>
        </template>
    </div>
    <h2 class="text-xl font-semibold text-color my-6">Search for additional institutions</h2>
    <IconField>
        <InputIcon>
            <FontAwesomeIcon :icon="faMagnifyingGlass" />
        </InputIcon>
        <InputText class="w-full" placeholder="Search for your institution" />
    </IconField>
</template>
