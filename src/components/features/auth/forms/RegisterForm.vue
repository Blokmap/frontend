<script lang="ts" setup>
import Button from 'primevue/button';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';

import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';

import type { RegisterRequest } from '@/domain/auth';

defineProps<{
    error?: Error | null;
    isLoading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'submit', form: RegisterRequest): Promise<unknown>;
}>();

const form = ref<RegisterRequest>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    passwordConfirmation: '',
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
        <div class="grid grid-cols-2 gap-3">
            <FloatLabel variant="on">
                <label for="first-name">First Name</label>
                <InputText id="first-name" v-model="form.firstName" class="w-full" required />
            </FloatLabel>
            <FloatLabel variant="on">
                <label for="last-name">Last Name</label>
                <InputText id="last-name" v-model="form.lastName" class="w-full" required />
            </FloatLabel>
        </div>
        <div class="grid grid-cols-1 gap-3">
            <FloatLabel variant="on">
                <label for="email">Email</label>
                <InputText id="email" v-model="form.email" type="email" class="w-full" required />
            </FloatLabel>
            <FloatLabel variant="on">
                <label for="username">Username</label>
                <InputText id="username" v-model="form.username" class="w-full" required />
            </FloatLabel>
        </div>
        <div class="grid grid-cols-2 gap-3">
            <FloatLabel variant="on">
                <label for="password">Password</label>
                <InputText
                    id="password"
                    v-model="form.password"
                    type="password"
                    class="w-full"
                    required />
            </FloatLabel>
            <FloatLabel variant="on">
                <label for="confirm-password">Confirm Password</label>
                <InputText
                    id="confirm-password"
                    v-model="form.passwordConfirmation"
                    type="password"
                    class="w-full"
                    required />
            </FloatLabel>
        </div>
        <Button
            class="mt-3 w-full"
            label="Continue with email"
            severity="primary"
            type="submit"
            :loading="isLoading">
            <template #icon>
                <FontAwesomeIcon :icon="faArrowRight" />
            </template>
        </Button>
    </form>
</template>
