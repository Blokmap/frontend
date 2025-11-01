<script lang="ts" setup>
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';
import type { LoginBody } from '@/domain/auth';

defineProps<{
    error?: Error | null;
    isLoading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'submit', form: LoginBody): Promise<unknown>;
}>();

const form = ref<LoginBody>({
    username: '',
    password: '',
    remember: false,
});

/**
 * Handles the form submission by emitting the 'submit' event with the form data.
 */
function handleFormSubmission(): void {
    emit('submit', form.value);
}
</script>

<template>
    <form class="space-y-3" @submit.prevent="handleFormSubmission" data-testid="login-form">
        <FloatLabel variant="on">
            <label for="username">Username or Email</label>
            <InputText
                id="username"
                v-model="form.username"
                class="w-full"
                data-testid="login-username"
                required>
            </InputText>
        </FloatLabel>

        <FloatLabel variant="on">
            <label for="password">Password</label>
            <InputText
                id="password"
                v-model="form.password"
                type="password"
                class="w-full"
                data-testid="login-password"
                required>
            </InputText>
        </FloatLabel>

        <label class="mt-5 mb-4 flex items-center gap-2" for="remember">
            <Checkbox v-model="form.remember" input-id="remember" binary />
            <span class="text-md">Ik wil ingelogd blijven op dit apparaat</span>
        </label>

        <Button
            class="mt-2 w-full"
            label="Log in with email"
            severity="primary"
            type="submit"
            data-testid="login-submit"
            :loading="isLoading">
            <template #icon>
                <FontAwesomeIcon :icon="faArrowRight" />
            </template>
        </Button>
    </form>
</template>
