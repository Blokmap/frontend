<script lang="ts" setup>
import { useToast } from '@/composables/useToast';
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
            <Skeleton height="96px" v-for="_ in 9" />
        </template>
        <template v-for="institution in institutions" :key="institution.name" v-else>
            <div class="institution" @click="handleInstitutionSelection(institution)">
                <img
                    :src="institution.logo.url"
                    :alt="institution.name[locale as any]!"
                    class="h-15 w-15 object-contain" />
                <div>
                    <h3 class="text-lg font-semibold">{{ institution.name[locale] }}</h3>
                    <p class="text-sm text-gray-600">{{ institution.slug[locale] }}</p>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.institution {
    @apply flex cursor-pointer items-center gap-4 rounded-lg border-2 border-slate-200 p-4 transition-colors hover:bg-gray-50;
}
</style>
