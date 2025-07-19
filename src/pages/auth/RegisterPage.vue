<script lang="ts" setup>
import InstitutionSelector from '@/components/features/auth/InstitutionSelector.vue';
import RegisterForm from '@/components/features/auth/RegisterForm.vue';
import { useAuthRegister } from '@/composables/data/useAuth';
import { useInstitutions } from '@/composables/data/useInstitutions';
import { useMessages } from '@/composables/useMessages';
import { authIdentityProviders } from '@/config/auth';
import Divider from 'primevue/divider';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { showMessage } = useMessages();

const { data: institutions, isLoading: isLoadingInstitutions } = useInstitutions();

const {
    mutate: register,
    isPending: registerIsLoading,
    error: registerError,
} = useAuthRegister({
    onError: (error) => {
        showMessage({
            severity: 'error',
            summary: 'An error occurred',
            detail: error.response?.data,
        });
    },
    onSuccess: () => {
        showMessage({
            severity: 'success',
            summary: 'Registration Successful',
            detail: 'You have successfully registered. Please check your email for further instructions.',
        });
    },
});
</script>

<template>
    <div class="flex items-start gap-8">
        <div class="basis-3/5">
            <h2 class="text-color my-6 text-xl font-semibold">
                <span class="text-secondary font-bold">Register</span> through your institution
            </h2>
            <InstitutionSelector :institutions="institutions" :is-loading="isLoadingInstitutions" />
        </div>

        <Divider layout="vertical" align="center" class="mx-0 self-stretch">
            <span class="text-sm font-bold">OR</span>
        </Divider>

        <div class="basis-2/5">
            <h2 class="text-color my-6 text-xl font-semibold">
                <span class="text-secondary font-bold">Register</span> without institution
            </h2>
            <RegisterForm
                @submit="register"
                :idps="authIdentityProviders"
                :is-loading="registerIsLoading"
                :error="registerError">
            </RegisterForm>
        </div>
    </div>
</template>
