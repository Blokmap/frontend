<script lang="ts" setup>
import type { Idp } from '@/types/model/Profile';
import type { RegisterRequest } from '@/types/schema/Auth';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';

defineProps<{
    idps: Idp[];
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
    <form class="space-y-3 my-6" @submit.prevent="handleFormSubmission">
        <div class="grid grid-cols-2 gap-3">
            <FloatLabel variant="on">
                <label for="first-name">First Name</label>
                <InputText v-model="form.firstName" id="first-name" class="w-full" required>
                </InputText>
            </FloatLabel>
            <FloatLabel variant="on">
                <label for="last-name">Last Name</label>
                <InputText v-model="form.lastName" id="last-name" class="w-full" required>
                </InputText>
            </FloatLabel>
        </div>
        <div class="grid grid-cols-1 gap-3">
            <FloatLabel variant="on">
                <label for="email">Email</label>
                <InputText v-model="form.email" id="email" type="email" class="w-full" required>
                </InputText>
            </FloatLabel>
            <FloatLabel variant="on">
                <label for="username">Username</label>
                <InputText v-model="form.username" id="username" class="w-full" required>
                </InputText>
            </FloatLabel>
        </div>
        <div class="grid grid-cols-2 gap-3">
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
            <FloatLabel variant="on">
                <label for="confirm-password">Confirm Password</label>
                <InputText
                    v-model="form.passwordConfirmation"
                    id="confirm-password"
                    type="password"
                    class="w-full"
                    required>
                </InputText>
            </FloatLabel>
        </div>
        <Button
            class="w-full mt-3"
            label="Continue with email"
            severity="primary"
            type="submit"
            :loading="isLoading">
            <template #icon>
                <FontAwesomeIcon :icon="faArrowRight" />
            </template>
        </Button>
    </form>
    <div class="grid grid-cols-1 gap-3 my-4">
        <template v-for="idp in idps" :key="idp.name">
            <Button class="w-full" severity="secondary" :label="`Continue with ${idp.name}`">
                <template #icon>
                    <img :src="idp.logo!" :alt="idp.name" class="w-5 h-5 object-contain" />
                </template>
            </Button>
        </template>
    </div>
</template>
