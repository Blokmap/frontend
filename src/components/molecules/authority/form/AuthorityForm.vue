<script lang="ts" setup>
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputHint from '@/components/atoms/form/InputHint.vue';
import InputLabel from '@/components/atoms/form/InputLabel.vue';
import { useForm } from '@/composables/useForm';
import {
    authorityRequestRules,
    authorityToRequest,
    defaultAuthorityRequest,
    type Authority,
    type AuthorityRequest,
} from '@/domain/authority';

const props = defineProps<{
    authority?: Authority;
}>();

const emit = defineEmits<{
    'click:save': [AuthorityRequest];
}>();

const { form, v$ } = useForm(defaultAuthorityRequest(), authorityRequestRules, {
    sync: () => props.authority,
    syncFn: authorityToRequest,
});

const onSaveClick = async (): Promise<void> => {
    const valid = await v$.value.$validate();

    if (valid) {
        emit('click:save', form.value);
    }
};
</script>

<template>
    <form class="space-y-5" @submit.prevent="onSaveClick">
        <div class="space-y-1">
            <InputLabel htmlFor="authority-name">Naam *</InputLabel>
            <InputText
                id="authority-name"
                v-model="form.name"
                :invalid="v$.name.$error"
                class="w-full"
                placeholder="Bijv. Gemeente Amsterdam">
            </InputText>
            <InputHint :errors="v$.name.$errors"> De naam van de groep. </InputHint>
        </div>

        <div class="space-y-1">
            <InputLabel htmlFor="authority-description">Beschrijving</InputLabel>
            <Textarea
                id="authority-description"
                v-model="form.description"
                :invalid="v$.description.$error"
                class="w-full"
                rows="4"
                placeholder="Beschrijving van de groep...">
            </Textarea>
            <InputHint :errors="v$.description.$errors">
                Een optionele beschrijving van de groep (max 1000 karakters).
            </InputHint>
        </div>
    </form>
</template>
