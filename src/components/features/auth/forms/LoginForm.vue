<script lang="ts" setup>
import type { LoginRequest } from '@/types/schema/Auth';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';

defineProps<{
    error?: Error | null;
    isLoading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'submit', form: LoginRequest): Promise<unknown>;
}>();

const form = ref<LoginRequest>({
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
    <form class="space-y-3" @submit.prevent="handleFormSubmission">
        <FloatLabel variant="on">
            <label for="username">Username or Email</label>
            <InputText v-model="form.username" id="username" class="w-full" required> </InputText>
        </FloatLabel>

        <FloatLabel variant="on">
            <label for="password">Password</label>
            <InputText
                v-model="form.password"
                id="password"
                type="password"
                class="w-full"
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
            :loading="isLoading">
            <template #icon>
                <FontAwesomeIcon :icon="faArrowRight" />
            </template>
        </Button>
    </form>
</template>
