<script lang="ts" setup>
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import CardField from '@/components/shared/molecules/CardField.vue';
import CardValue from '@/components/shared/molecules/CardValue.vue';
import EditableCard from '@/components/shared/organisms/EditableCard.vue';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { ref, watchEffect } from 'vue';
import { authorityToRequest, type Authority, type AuthorityBody } from '@/domain/authority';

const props = defineProps<{
    authority: Authority;
    isUpdating: boolean;
}>();

const emit = defineEmits<{
    save: [data: AuthorityBody];
}>();

const editMode = defineModel<boolean>('editMode', { default: false });

const form = ref<AuthorityBody>(authorityToRequest(props.authority));

watchEffect(() => {
    form.value = authorityToRequest(props.authority);
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
        title="Basisinformatie"
        :icon="faBuilding"
        :is-updating="isUpdating"
        @save="onSaveClick"
        @cancel="onCancelClick">
        <CardField label="Naam">
            <InputText v-if="editMode" v-model="form.name" class="w-full"></InputText>
            <CardValue v-else>
                {{ authority.name || 'N/A' }}
            </CardValue>
        </CardField>
        <CardField label="Beschrijving">
            <Textarea v-if="editMode" v-model="form.description" class="w-full" rows="4"></Textarea>
            <CardValue v-else>
                {{ authority.description || 'N/A' }}
            </CardValue>
        </CardField>
    </EditableCard>
</template>
