<script lang="ts" setup>
import InstitutionSelector from '@/components/features/auth/InstitutionSelector.vue';
import RegisterForm from '@/components/features/auth/RegisterForm.vue';
import { useAuthRegister } from '@/composables/services/useAuth';
import { useInstitutions } from '@/composables/services/useInstitutions';
import { useMessages } from '@/composables/useMessages';
import { authIdentityProviders } from '@/config/auth';
import Divider from 'primevue/divider';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const { showMessage } = useMessages();

const { data: institutions, isLoading: isLoadingInstitutions } = useInstitutions();

const { register, registerIsLoading, registerError } = useAuthRegister({
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
            <h2 class="text-xl font-semibold text-color my-6">
                <span class="text-secondary font-bold">Register</span> through your institution
            </h2>
            <InstitutionSelector :institutions="institutions" :is-loading="isLoadingInstitutions" />
        </div>

        <Divider layout="vertical" align="center" class="self-stretch mx-0">
            <span class="text-sm font-bold">OR</span>
        </Divider>

        <div class="basis-2/5">
            <h2 class="text-xl font-semibold text-color my-6">
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
