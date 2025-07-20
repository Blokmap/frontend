<script lang="ts" setup>
import InstitutionSelector from '@/components/features/auth/InstitutionSelector.vue';
import LoginForm from '@/components/features/auth/LoginForm.vue';
import GradientText from '@/components/shared/GradientText.vue';
import { useAuthLogin, useAuthRegister } from '@/composables/data/useAuth';
import { useInstitutions } from '@/composables/data/useInstitutions';
import { useMessages } from '@/composables/useMessages';
import { authIdentityProviders } from '@/config/auth';
import Divider from 'primevue/divider';
import { useI18n } from 'vue-i18n';
import { useRoute, useRouter } from 'vue-router';

const { showMessage } = useMessages();
const router = useRouter();
const route = useRoute();

const { data: institutions, isLoading: isLoadingInstitutions } = useInstitutions();

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
</script>

<template>
    <div class="flex items-start gap-8">
        <div class="basis-3/5">
            <h2 class="text-color my-6 text-xl font-semibold">
                <GradientText>Log in</GradientText> via jouw instelling
            </h2>
            <InstitutionSelector :institutions="institutions" :is-loading="isLoadingInstitutions" />
        </div>

        <Divider layout="vertical" align="center" class="mx-0 self-stretch">
            <span class="text-sm font-bold">OF</span>
        </Divider>

        <div class="basis-2/5">
            <h2 class="text-color my-6 text-xl font-semibold">
                <GradientText>Log in</GradientText> zonder instelling
            </h2>
            <LoginForm
                :idps="authIdentityProviders"
                :error="loginError"
                :is-loading="loginIsLoading"
                @submit="login">
            </LoginForm>
        </div>
    </div>
</template>
