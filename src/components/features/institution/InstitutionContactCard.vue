<script lang="ts" setup>
import InputText from 'primevue/inputtext';
import CardField from '@/components/shared/molecules/CardField.vue';
import CardValue from '@/components/shared/molecules/CardValue.vue';
import EditableCard from '@/components/shared/organisms/EditableCard.vue';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { ref, watchEffect } from 'vue';
import { institutionToRequest, type Institution, type InstitutionBody } from '@/domain/institution';

const props = defineProps<{
    institution: Institution;
    isUpdating: boolean;
}>();

const emit = defineEmits<{
    save: [data: InstitutionBody];
}>();

const editMode = defineModel<boolean>('editMode', { default: false });

const form = ref<InstitutionBody>(institutionToRequest(props.institution));

watchEffect(() => {
    form.value = institutionToRequest(props.institution);
});

function onSaveClick() {
    emit('save', form.value);
}

function onCancelClick() {
    editMode.value = false;
}
</script>

<template>
    <EditableCard
        v-model:edit-mode="editMode"
        title="Contactgegevens"
        :icon="faPhone"
        :is-updating="isUpdating"
        @save="onSaveClick"
        @cancel="onCancelClick">
        <CardField label="E-mail">
            <InputText v-if="editMode" v-model="form.email" type="email" class="w-full"></InputText>
            <CardValue v-else>
                {{ institution.email || 'N/A' }}
            </CardValue>
        </CardField>
        <CardField label="Telefoon">
            <InputText
                v-if="editMode"
                v-model="form.phoneNumber"
                type="tel"
                class="w-full"></InputText>
            <CardValue v-else>
                {{ institution.phone || 'N/A' }}
            </CardValue>
        </CardField>
    </EditableCard>
</template>
