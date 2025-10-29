<script lang="ts" setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import LoginForm from '@/components/features/auth/forms/LoginForm.vue';
import RegisterForm from '@/components/features/auth/forms/RegisterForm.vue';
import { faArrowRight, faSchoolFlag } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { isAxiosError } from 'axios';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';
import { useAuthLogin, useAuthRegister } from '@/composables/data/useAuth';
import { useReadInstitutions } from '@/composables/data/useInstitutions';
import { useToast } from '@/composables/store/useToast';
import { endpoints } from '@/config/endpoints';
import { AUTH_IDPS, pullRedirectUrl } from '@/domain/auth';

const { locale, t } = useI18n();
const toast = useToast();
const router = useRouter();
const route = useRoute();

const { data: institutions, isLoading: isLoadingInstitutions } = useReadInstitutions({});

const {
    mutate: login,
    isPending: loginIsLoading,
    error: loginError,
} = useAuthLogin({
    onError: (error) => {
        if (isAxiosError(error)) {
            toast.add({
                severity: 'error',
                summary: t('domains.auth.errors.loginFailed'),
                detail: error.response?.data,
            });
        }
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
            summary: t('domains.auth.success.loggedIn'),
            detail: t('domains.auth.success.loggedInDetail'),
        });
    },
});

const {
    mutate: register,
    isPending: registerIsLoading,
    error: registerError,
} = useAuthRegister({
    onError: (error) => {
        if (isAxiosError(error)) {
            toast.add({
                severity: 'error',
                summary: t('domains.auth.errors.registerFailed'),
                detail: error.response?.data,
            });
        }
    },
    onSuccess: () => {
        toast.add({
            severity: 'success',
            summary: t('domains.auth.success.registered'),
            detail: t('domains.auth.success.registeredDetail'),
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

    return institutions.value.data.filter((institution) => {
        const slug = institution.slug?.toLowerCase().trim() || '';
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
    <h1 ref="title" class="text-bold text-center text-4xl" data-testid="auth-title">
        <span class="font-bold text-slate-700">{{ $t('pages.auth.title') }}</span>
    </h1>
    <p class="text-md mt-1 max-w-80 text-center text-slate-500">
        {{ $t('pages.auth.subtitle') }}
    </p>
    <IconField class="my-2">
        <InputIcon>
            <FontAwesomeIcon :icon="faSchoolFlag" class="text-slate-500" />
        </InputIcon>
        <Select
            class="!w-[300px] py-1 ps-6"
            :placeholder="$t('pages.auth.institution.select')"
            data-testid="institution-select"
            pt:overlay:class="!w-[300px] w-full"
            pt:list-container:class="p-0"
            :options="filteredInstitutions"
            :loading="isLoadingInstitutions"
            @change="handleSelectInstitution">
            <template #header>
                <InputText
                    v-model="institutionFilter"
                    :placeholder="$t('pages.auth.institution.search')"
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
                        <p class="text-sm font-bold">
                            {{ option.slug[locale] }}
                        </p>
                        <p class="text-sm text-gray-400">
                            {{ option.name[locale] }}
                        </p>
                    </div>
                </div>
            </template>
            <template #value="{ value }">
                <p v-if="value" class="text-sm font-bold text-slate-600">
                    {{ value.name[locale] }}
                </p>
            </template>
            <template #empty>
                <span class="text-gray-500">
                    {{ $t('pages.auth.institution.noMatch') }}
                </span>
            </template>
        </Select>
    </IconField>
    <template v-for="idp in AUTH_IDPS" :key="idp.name">
        <a :href="'/api/' + endpoints.auth.sso.replace('{provider}', idp.id)">
            <Button
                class="w-[300px]"
                severity="contrast"
                size="small"
                :label="$t('pages.auth.actions.loginWith', [idp.name])">
                <template #icon>
                    <img :src="idp.logo!" :alt="idp.name" class="h-5 w-5 object-contain" />
                </template>
            </Button>
        </a>
    </template>
    <div class="absolute right-4 bottom-4">
        <Button
            severity="secondary"
            size="small"
            link
            data-testid="password-login-button"
            @click="switchToLogin">
            <span class="hover:underline">{{ $t('pages.auth.actions.loginPassword') }}</span>
            <FontAwesomeIcon :icon="faArrowRight" />
        </Button>
    </div>
    <Dialog
        class="w-[500px]"
        :visible="isDialogVisible"
        modal
        data-testid="auth-dialog"
        @update:visible="closeDialog">
        <template #header>
            <h2 class="text-lg font-bold">
                {{
                    route.params.action === 'register'
                        ? $t('pages.auth.actions.register')
                        : $t('pages.auth.actions.login')
                }}
            </h2>
        </template>
        <template #default>
            <template v-if="route.params.action === 'login'">
                <LoginForm :loading="loginIsLoading" :error="loginError" @submit="login" />
                <span
                    class="mt-4 block cursor-pointer text-center hover:underline"
                    @click="switchToRegister">
                    {{ $t('pages.auth.actions.noAccount') }}
                </span>
            </template>
            <template v-else-if="route.params.action === 'register'">
                <RegisterForm
                    :loading="registerIsLoading"
                    :error="registerError"
                    @submit="register" />
                <span
                    class="mt-4 block cursor-pointer text-center hover:underline"
                    @click="switchToLogin">
                    {{ $t('pages.auth.actions.hasAccount') }}
                </span>
            </template>
        </template>
    </Dialog>
</template>
