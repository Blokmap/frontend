<script lang="ts" setup>
import InputText from 'primevue/inputtext';
import CardField from '@/components/shared/molecules/CardField.vue';
import CardValue from '@/components/shared/molecules/CardValue.vue';
import EditableCard from '@/components/shared/organisms/EditableCard.vue';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
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

const fields = [
    { key: 'street', label: 'Straat' },
    { key: 'number', label: 'Nummer' },
    { key: 'zip', label: 'Postcode' },
    { key: 'city', label: 'Stad' },
    { key: 'province', label: 'Provincie' },
] as const;

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
        title="Adres"
        :icon="faMapMarkerAlt"
        :is-updating="isUpdating"
        class="lg:col-span-2"
        @save="onSaveClick"
        @cancel="onCancelClick">
        <div v-if="!editMode" class="card__grid">
            <CardField v-for="field in fields" :key="field.key" :label="field.label">
                <CardValue>
                    {{ institution[field.key] || 'N/A' }}
                </CardValue>
            </CardField>
        </div>
        <template v-else>
            <CardField v-for="field in fields" :key="field.key" :label="field.label">
                <InputText v-model="form[field.key]" class="w-full"></InputText>
            </CardField>
        </template>
    </EditableCard>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.card__grid {
    @apply grid gap-4 md:grid-cols-2 lg:grid-cols-3;
}
</style>
