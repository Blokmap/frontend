<script lang="ts" setup>
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import Textarea from 'primevue/textarea';
import EntityCard from '@/components/shared/molecules/EntityCard.vue';
import InputLabel from '@/components/shared/molecules/form/InputLabel.vue';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { authorityToBody, type Authority, type AuthorityBody } from '@/domain/authority';
import type { InstitutionMembership } from '@/domain/member';

const props = defineProps<{
    authority?: Authority | null;
    loading?: boolean;
    editable?: boolean;
    saving?: boolean;
    avatarUpdating?: boolean;
    avatarDeleting?: boolean;
    institutions?: InstitutionMembership[];
}>();

const emit = defineEmits<{
    'update:authority': [data: AuthorityBody];
    'update:avatar': [file: File];
    'delete:avatar': [];
}>();

const { locale } = useI18n();

const editMode = ref(false);
const avatarDialogVisible = ref(false);
const formData = ref<AuthorityBody>({
    name: '',
    description: null,
    institutionId: null,
});

const institutionOptions = computed(() => {
    return props.institutions?.map((membership) => ({
        label: membership.institution.name[locale.value],
        value: membership.institution.id,
    }));
});

watch(
    () => props.authority,
    (authority) => {
        if (authority && !editMode.value) {
            formData.value = authorityToBody(authority);
        }
    },
    { immediate: true },
);

function onEdit() {
    if (props.authority) {
        formData.value = authorityToBody(props.authority);
        editMode.value = true;
    }
}

function onSave() {
    emit('update:authority', formData.value);
    editMode.value = false;
}

function onCancel() {
    if (props.authority) {
        formData.value = authorityToBody(props.authority);
    }
    editMode.value = false;
}

function onUpdateAvatar(file: File) {
    emit('update:avatar', file);
    avatarDialogVisible.value = false;
}

function onDeleteAvatar() {
    emit('delete:avatar');
    avatarDialogVisible.value = false;
}
</script>

<template>
    <EntityCard
        :loading="loading"
        :editable="editable"
        :edit-mode="editMode"
        :saving="saving"
        :avatar-image="authority?.logo?.url"
        :avatar-icon="faBuilding"
        :avatar-editable="editable && !editMode"
        :avatar-updating="avatarUpdating"
        :avatar-deleting="avatarDeleting"
        avatar-title="Logo"
        avatar-subtitle="Wijzig het logo van deze groep"
        v-model:avatar-dialog-visible="avatarDialogVisible"
        @click:edit="onEdit"
        @click:save="onSave"
        @click:cancel="onCancel"
        @update:avatar="onUpdateAvatar"
        @delete:avatar="onDeleteAvatar">
        <template #content>
            <div v-if="!editMode" class="space-y-2">
                <h2 class="text-2xl font-bold text-slate-900">
                    {{ authority?.name || '-' }}
                </h2>
                <p v-if="authority?.description" class="text-sm text-slate-600">
                    {{ authority.description }}
                </p>
                <p v-if="authority?.institution" class="text-xs text-slate-500">
                    Onderdeel van: {{ authority.institution.name[locale] }}
                </p>
            </div>

            <div v-else class="space-y-4">
                <div>
                    <InputLabel html-for="name">Naam</InputLabel>
                    <InputText
                        id="name"
                        v-model="formData.name"
                        class="w-full"
                        placeholder="Naam van de groep" />
                </div>

                <div>
                    <InputLabel html-for="description">Beschrijving</InputLabel>
                    <Textarea
                        id="description"
                        v-model="formData.description"
                        class="w-full"
                        rows="3"
                        placeholder="Beschrijving van de groep">
                    </Textarea>
                </div>

                <div v-if="institutions?.length">
                    <InputLabel html-for="institution">Instelling</InputLabel>
                    <Select
                        id="institution"
                        v-model="formData.institutionId"
                        :options="institutionOptions"
                        option-label="label"
                        option-value="value"
                        class="w-full"
                        placeholder="Selecteer een instelling">
                    </Select>
                </div>
            </div>
        </template>
    </EntityCard>
</template>
