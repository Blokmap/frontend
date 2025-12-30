<script lang="ts" setup>
import InputText from 'primevue/inputtext';
import CardField from '@/components/molecules/CardField.vue';
import CardValue from '@/components/molecules/CardValue.vue';
import EditableCard from '@/components/organisms/EditableCard.vue';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { ref, watchEffect } from 'vue';
import {
    institutionToRequest,
    type Institution,
    type InstitutionRequest,
} from '@/domain/institution';

const props = defineProps<{
    institution: Institution;
    isUpdating: boolean;
}>();

const emit = defineEmits<{
    save: [data: InstitutionRequest];
}>();

const editMode = defineModel<boolean>('editMode', { default: false });

const form = ref<InstitutionRequest>(institutionToRequest(props.institution));

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
