<script lang="ts" setup>
import { useTitleAnimation } from '@/composables/anim/useTitleAnimation';
import { useAuthLogin } from '@/composables/data/useAuth';
import { useInstitutions } from '@/composables/data/useInstitutions';
import { useMessages } from '@/composables/useMessages';
import { faSchoolFlag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import { computed, ref, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const { locale } = useI18n();
const { showMessage } = useMessages();
const router = useRouter();
const route = useRoute();

const { data: institutions, isLoading: isLoadingInstitutions } = useInstitutions();

const institutionFilter = ref<string>('');

const filteredInstitutions = computed(() => {
    if (!institutions.value) {
        return [];
    }

    return institutions.value.filter((institution) => {
        const slug = institution.slug[locale.value]?.toLowerCase().trim() || '';
        const name = institution.name[locale.value]?.toLowerCase().trim() || '';
        const filter = institutionFilter.value.toLowerCase();
        return slug.includes(filter) || name.includes(filter);
    });
});

const {
    mutate: login,
    isPending: loginIsLoading,
    error: loginError,
} = useAuthLogin({
    onError: (error) => {
        showMessage({
            severity: 'error',
            summary: 'An error occurred',
            detail: error.response?.data,
        });
    },
    onSuccess: () => {
        if (route.query.redirect) {
            router.push({ path: route.query.redirect.toString() });
        } else {
            router.push({ name: 'locations' });
        }

        showMessage({
            severity: 'success',
            summary: 'Login Successful',
            detail: 'Successfully logged in.',
        });
    },
});

useTitleAnimation(useTemplateRef('title'));

function handleSelectInstitution(institution: { value: string }): void {
    if (!institution.value) {
        return;
    }
}
</script>

<template>
    <h1 class="text-bold text-center text-4xl" ref="title">
        <span class="text-gradient-conic font-bold">Blokmap Account</span>
    </h1>
    <p class="my-2 text-center text-lg text-slate-500">Log in via je onderwijsinstelling</p>
    <IconField>
        <InputIcon>
            <FontAwesomeIcon :icon="faSchoolFlag" class="text-slate-500" />
        </InputIcon>
        <Select
            class="!w-[300px] py-2 ps-6"
            placeholder="Selecteer een instelling"
            pt:overlay:class="!w-[300px] w-full"
            pt:list-container:class="p-0"
            :options="filteredInstitutions"
            :loading="isLoadingInstitutions"
            @change="handleSelectInstitution">
            <template #header>
                <InputText
                    v-model="institutionFilter"
                    placeholder="Zoek een instelling"
                    class="w-full border-0">
                </InputText>
            </template>
            <template #option="{ option }">
                <div class="flex items-center gap-2">
                    <img
                        :alt="option.name"
                        :src="option.logo.url"
                        class="h-10 w-10 object-contain" />
                    <div class="flex flex-col">
                        <p class="text-sm font-bold">{{ option.slug[locale] }}</p>
                        <p class="text-sm text-gray-400">{{ option.name[locale] }}</p>
                    </div>
                </div>
            </template>
            <template #value="{ value }">
                <p class="text-sm font-bold text-slate-600" v-if="value">
                    {{ value.name[locale] }}
                </p>
            </template>
            <template #empty>
                <span class="text-gray-500">
                    Geen overeenkomsten gevonden. Geen zorgen, je kan nog steeds een account maken
                    via de opties hieronder 😄
                </span>
            </template>
        </Select>
    </IconField>
</template>
