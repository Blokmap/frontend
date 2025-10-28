<script lang="ts" setup>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, watchEffect } from 'vue';
import { DEFAULT_AUTHORITY_REQUEST, authorityToRequest } from '@/domain/authority';
import type { Authority, AuthorityRequest } from '@/domain/authority';

const props = defineProps<{
    authority?: Authority;
    isLoading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'click:save', form: AuthorityRequest): void;
}>();

const form = ref<AuthorityRequest>({ ...DEFAULT_AUTHORITY_REQUEST });

watchEffect(() => {
    if (props.authority) {
        form.value = authorityToRequest(props.authority);
    }
});

/**
 * Handles the form submission by emitting the 'click:save' event with the form data.
 */
function handleFormSubmission(): void {
    emit('click:save', form.value);
}
</script>

<template>
    <form class="space-y-4" @submit.prevent="handleFormSubmission">
        <!-- Name -->
        <div>
            <label for="name" class="mb-2 block text-sm font-medium text-gray-700">
                {{ $t('components.authorityForm.name') }} *
            </label>
            <InputText id="name" v-model="form.name" class="w-full" required />
        </div>

        <!-- Description -->
        <div>
            <label for="description" class="mb-2 block text-sm font-medium text-gray-700">
                {{ $t('components.authorityForm.description') }}
            </label>
            <Textarea id="description" v-model="form.description" class="w-full" rows="4">
            </Textarea>
        </div>

        <!-- Submit Button -->
        <Button
            :label="
                authority
                    ? $t('components.authorityForm.updateButton')
                    : $t('components.authorityForm.createButton')
            "
            severity="primary"
            type="submit"
            :loading="isLoading">
            <template #icon>
                <FontAwesomeIcon :icon="faSave" />
            </template>
        </Button>
    </form>
</template>
