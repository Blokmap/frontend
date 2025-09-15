<script lang="ts" setup>
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Skeleton from 'primevue/skeleton';

import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';

import { useToast } from '@/composables/store/useToast';

import type { Institution } from '@/domain/institution';

defineProps<{
    institutions?: Institution[];
    isLoading: boolean;
}>();

const toast = useToast();
const { locale } = useI18n();

function handleInstitutionSelection(institution: Institution): void {
    toast.add({
        severity: 'warn',
        summary: 'Not implemented',
        detail: `You can't log in with ${institution.slug[locale.value as any]!} yet.`,
    });
}
</script>

<template>
    <IconField>
        <InputIcon>
            <FontAwesomeIcon :icon="faMagnifyingGlass" />
        </InputIcon>
        <InputText class="w-full" placeholder="Search for your institution" />
    </IconField>
    <div class="my-6 grid grid-cols-2 gap-3">
        <template v-if="isLoading">
            <Skeleton v-for="index in 9" :key="index" height="96px" />
        </template>
        <template v-for="institution in institutions" v-else :key="institution.name">
            <div class="institution" @click="handleInstitutionSelection(institution)">
                <img
                    :src="institution.logo.url"
                    :alt="institution.name[locale as any]!"
                    class="h-15 w-15 object-contain" />
                <div>
                    <h3 class="text-lg font-semibold">
                        {{ institution.name[locale] }}
                    </h3>
                    <p class="text-sm text-gray-600">
                        {{ institution.slug[locale] }}
                    </p>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.institution {
    @apply flex cursor-pointer items-center gap-4 rounded-lg border-1 border-slate-200 p-4 transition-colors hover:bg-gray-50;
}
</style>
