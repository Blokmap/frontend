<script lang="ts" setup>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import InputHint from '@/components/molecules/form/InputHint.vue';
import InputLabel from '@/components/molecules/form/InputLabel.vue';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import { DEFAULT_AUTHORITY_REQUEST, authorityToRequest } from '@/domain/authority';
import type { Authority, AuthorityRequest } from '@/domain/authority';
import type { InstitutionMembership } from '@/domain/member';

const props = defineProps<{
    authority?: Authority;
    institutions?: InstitutionMembership[];
    isLoading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'click:save', form: AuthorityRequest): void;
}>();

const { locale } = useI18n();

const form = ref<AuthorityRequest>({ ...DEFAULT_AUTHORITY_REQUEST });

const institutionOptions = computed(() => {
    return props.institutions?.map((membership) => ({
        label: membership.institution.name[locale.value],
        value: membership.institution.id,
    }));
});

/**
 * Handles the form submission by emitting the 'click:save' event with the form data.
 */
function handleFormSubmission(): void {
    emit('click:save', form.value);
}

watchEffect(() => {
    if (props.authority) {
        form.value = authorityToRequest(props.authority);
    }
});
</script>

<template>
    <form class="space-y-4" @submit.prevent="handleFormSubmission">
        <!-- Institution Selector -->
        <div v-if="institutions?.length">
            <InputLabel html-for="institution">
                {{ $t('components.authorities.form.institution') }}
            </InputLabel>
            <Select
                id="institution"
                v-model="form.institutionId"
                :options="institutionOptions"
                option-label="label"
                option-value="value"
                placeholder="Selecteer een institutie"
                show-clear
                class="w-full">
            </Select>
            <InputHint>
                Selecteer de institutie waaronder deze autoriteit wordt aangemaakt
            </InputHint>
        </div>

        <!-- Name -->
        <div>
            <InputLabel html-for="name">
                {{ $t('components.authorities.form.name') }} *
            </InputLabel>
            <InputText id="name" v-model="form.name" class="w-full" required />
        </div>

        <!-- Description -->
        <div>
            <InputLabel html-for="description">
                {{ $t('components.authorities.form.description') }}
            </InputLabel>
            <Textarea id="description" v-model="form.description" class="w-full" rows="4">
            </Textarea>
        </div>

        <!-- Submit Button -->
        <Button
            :label="$t('general.actions.save')"
            severity="primary"
            type="submit"
            :loading="isLoading">
            <template #icon>
                <FontAwesomeIcon :icon="faSave" />
            </template>
        </Button>
    </form>
</template>
