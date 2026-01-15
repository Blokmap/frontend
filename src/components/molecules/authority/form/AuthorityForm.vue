<script lang="ts" setup>
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputHint from '@/components/atoms/form/InputHint.vue';
import InputLabel from '@/components/atoms/form/InputLabel.vue';
import { computed } from 'vue';
import { type Form } from '@/composables/useForm';
import { type AuthorityRequest } from '@/domain/authority';

const props = defineProps<{
    form: Form<AuthorityRequest>;
}>();

const form = computed(() => {
    return props.form.body.value;
});

const v$ = computed(() => {
    return props.form.v$.value;
});

const emit = defineEmits<{
    submit: [];
}>();
</script>

<template>
    <form class="space-y-5" @submit.prevent="emit('submit')">
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
