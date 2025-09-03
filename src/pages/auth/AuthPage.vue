<script lang="ts" setup>
import LoginForm from '@/components/features/auth/forms/LoginForm.vue';
import RegisterForm from '@/components/features/auth/forms/RegisterForm.vue';
import { useAuthLogin, useAuthRegister } from '@/composables/data/useAuth';
import { useInstitutions } from '@/composables/data/useInstitutions';
import { useToast } from '@/composables/store/useToast';
import { authIdentityProviders, pullRedirectUrl } from '@/domain/auth';
import { endpoints } from '@/endpoints';
import { faArrowRight, faSchoolFlag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const { locale } = useI18n();
const toast = useToast();
const router = useRouter();
const route = useRoute();

const { data: institutions, isLoading: isLoadingInstitutions } = useInstitutions();

const {
    mutate: login,
    isPending: loginIsLoading,
    error: loginError,
} = useAuthLogin({
    onError: (error) => {
        toast.add({
            severity: 'error',
            summary: 'Inloggen mislukt',
            detail: error.response?.data,
        });
    },
    onSuccess: () => {
        const redirect = pullRedirectUrl();

        if (redirect) {
            router.push({ path: redirect.toString() });
        } else {
            router.push({ name: 'locations' });
        }

        toast.add({
            severity: 'success',
            summary: 'Ingelogd!',
            detail: 'Je bent succesvol ingelogd.',
        });
    },
});

const {
    mutate: register,
    isPending: registerIsLoading,
    error: registerError,
} = useAuthRegister({
    onError: (error) => {
        toast.add({
            severity: 'error',
            summary: 'Registratie mislukt',
            detail: error.response?.data,
        });
    },
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: 'Geregistreerd!',
            detail: 'Je bent succesvol geregistreerd. Je kan nu inloggen.',
        });
        router.push({ name: 'auth', params: { action: 'login' } });
    },
});

const institutionFilter = ref('');
const isDialogVisible = computed(() => !!route.params.action);

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

function handleSelectInstitution(institution: { value: string }): void {
    if (!institution.value) {
        return;
    }
}

function closeDialog(): void {
    router.push({ name: 'auth' });
}

function switchToLogin(): void {
    router.push({ name: 'auth', params: { action: 'login' } });
}

function switchToRegister(): void {
    router.push({ name: 'auth', params: { action: 'register' } });
}
</script>

<template>
    <h1 class="text-bold text-center text-4xl" ref="title">
        <span class="text-gradient-conic font-bold">Blokmap Account</span>
    </h1>
    <p class="text-md mt-1 max-w-80 text-center text-slate-500">
        Gebruik je onderwijsinstelling of een ander type account om in te loggen.
    </p>
    <IconField class="my-2">
        <InputIcon>
            <FontAwesomeIcon :icon="faSchoolFlag" class="text-slate-500" />
        </InputIcon>
        <Select
            class="!w-[300px] py-1 ps-6"
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
                    via de opties hieronder!
                </span>
            </template>
        </Select>
    </IconField>
    <template v-for="idp in authIdentityProviders" :key="idp.name">
        <a :href="'/api/' + endpoints.auth.sso.replace('{provider}', idp.id)">
            <Button
                class="w-[300px]"
                severity="contrast"
                size="small"
                :label="`Log in met ${idp.name}`">
                <template #icon>
                    <img :src="idp.logo!" :alt="idp.name" class="h-5 w-5 object-contain" />
                </template>
            </Button>
        </a>
    </template>
    <div class="absolute right-4 bottom-4">
        <Button severity="secondary" size="small" @click="switchToLogin" link>
            <span class="hover:underline">Inloggen met wachtwoord</span>
            <FontAwesomeIcon :icon="faArrowRight" />
        </Button>
    </div>
    <Dialog class="w-[500px]" :visible="isDialogVisible" @update:visible="closeDialog" modal>
        <template #header>
            <h2 class="text-lg font-bold">
                {{ route.params.action === 'register' ? 'Registreren' : 'Inloggen met wachtwoord' }}
            </h2>
        </template>
        <template #default>
            <template v-if="route.params.action === 'login'">
                <LoginForm :is-loading="loginIsLoading" :error="loginError" @submit="login" />
                <span
                    class="mt-4 block cursor-pointer text-center hover:underline"
                    @click="switchToRegister">
                    Heb je nog geen account?
                </span>
            </template>
            <template v-else-if="route.params.action === 'register'">
                <RegisterForm
                    :is-loading="registerIsLoading"
                    :error="registerError"
                    @submit="register" />
                <span
                    class="mt-4 block cursor-pointer text-center hover:underline"
                    @click="switchToLogin">
                    Heb je al een account?
                </span>
            </template>
        </template>
    </Dialog>
</template>
