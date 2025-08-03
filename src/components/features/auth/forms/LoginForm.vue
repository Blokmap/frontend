<script lang="ts" setup>
import type { LoginRequest } from '@/types/schema/Auth';
import type { Idp } from '@/types/schema/Profile';
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
    (e: 'submit', form: LoginRequest): Promise<unknown>;
}>();

const form = ref<LoginRequest>({
    username: '',
    password: '',
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
        <div class="grid grid-cols-1">
            <FloatLabel variant="on">
                <label for="username">Username or Email</label>
                <InputText v-model="form.username" id="username" class="w-full" required>
                </InputText>
            </FloatLabel>
        </div>
        <div class="grid grid-cols-1">
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
        </div>
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
