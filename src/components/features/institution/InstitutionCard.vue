<script lang="ts" setup>
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import EntityCard from '@/components/shared/molecules/EntityCard.vue';
import LanguageSelector from '@/components/shared/molecules/LanguageSelector.vue';
import InputLabel from '@/components/shared/molecules/form/InputLabel.vue';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    institutionToBody,
    INSTITUTION_CATEGORIES,
    type Institution,
    type InstitutionBody,
} from '@/domain/institution';

const props = defineProps<{
    institution?: Institution | null;
    loading?: boolean;
    editable?: boolean;
    saving?: boolean;
    avatarUpdating?: boolean;
    avatarDeleting?: boolean;
}>();

const emit = defineEmits<{
    'update:institution': [data: InstitutionBody];
    'update:avatar': [file: File];
    'delete:avatar': [];
}>();

const { locale, t } = useI18n();

const editMode = ref(false);
const avatarDialogVisible = ref(false);
const currentLanguage = ref(locale.value);
const formData = ref<InstitutionBody>({
    category: 'Education' as any,
    name: { nl: '', en: '', fr: '' },
    slug: '',
    aclType: 'Blacklist',
    city: null,
    zip: null,
    country: null,
    number: null,
    street: null,
    province: null,
    email: null,
    phoneNumber: null,
});

const categoryOptions = computed(() => {
    return INSTITUTION_CATEGORIES.map((category) => ({
        label: t(`domains.institutions.category.${category}`),
        value: category,
    }));
});

const aclTypeOptions = computed(() => [
    { label: 'Blacklist', value: 'Blacklist' },
    { label: 'Whitelist', value: 'Whitelist' },
]);

watch(
    () => props.institution,
    (institution) => {
        if (institution && !editMode.value) {
            formData.value = institutionToBody(institution);
        }
    },
    { immediate: true },
);

function onEdit() {
    if (props.institution) {
        formData.value = institutionToBody(props.institution);
        currentLanguage.value = locale.value;
        editMode.value = true;
    }
}

function onSave() {
    emit('update:institution', formData.value);
    editMode.value = false;
}

function onCancel() {
    if (props.institution) {
        formData.value = institutionToBody(props.institution);
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
        :avatar-image="institution?.logo?.url"
        :avatar-icon="faBuilding"
        :avatar-editable="editable && !editMode"
        :avatar-updating="avatarUpdating"
        :avatar-deleting="avatarDeleting"
        avatar-title="Logo"
        avatar-subtitle="Wijzig het logo van deze instelling"
        v-model:avatar-dialog-visible="avatarDialogVisible"
        @click:edit="onEdit"
        @click:save="onSave"
        @click:cancel="onCancel"
        @update:avatar="onUpdateAvatar"
        @delete:avatar="onDeleteAvatar">
        <template #content>
            <div v-if="!editMode" class="space-y-2">
                <h2 class="text-2xl font-bold text-slate-900">
                    {{ institution?.name[locale] || '-' }}
                </h2>
                <p class="text-sm text-slate-600">{{ institution?.slug }}</p>
                <div v-if="institution?.email || institution?.phone" class="text-sm text-slate-600">
                    <p v-if="institution.email">{{ institution.email }}</p>
                    <p v-if="institution.phone">{{ institution.phone }}</p>
                </div>
                <p
                    v-if="
                        institution?.street ||
                        institution?.city ||
                        institution?.zip ||
                        institution?.country
                    "
                    class="text-xs text-slate-500">
                    <span v-if="institution.street"
                        >{{ institution.street }} {{ institution.number }}</span
                    >
                    <span v-if="institution.zip || institution.city">
                        <br />{{ institution.zip }} {{ institution.city }}
                    </span>
                    <span v-if="institution.province || institution.country">
                        <br />{{ institution.province }}{{ institution.country }}
                    </span>
                </p>
            </div>

            <div v-else class="space-y-4">
                <div class="flex items-center gap-2">
                    <div class="flex-1">
                        <InputLabel html-for="name">Naam</InputLabel>
                        <InputText
                            id="name"
                            v-model="formData.name[currentLanguage]"
                            class="w-full"
                            placeholder="Naam van de instelling" />
                    </div>
                    <LanguageSelector v-model="currentLanguage" />
                </div>

                <div>
                    <InputLabel html-for="slug">Slug</InputLabel>
                    <InputText
                        id="slug"
                        v-model="formData.slug"
                        class="w-full"
                        placeholder="slug-van-instelling" />
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel html-for="category">Categorie</InputLabel>
                        <Select
                            id="category"
                            v-model="formData.category"
                            :options="categoryOptions"
                            option-label="label"
                            option-value="value"
                            class="w-full"
                            placeholder="Selecteer categorie" />
                    </div>

                    <div>
                        <InputLabel html-for="aclType">ACL Type</InputLabel>
                        <Select
                            id="aclType"
                            v-model="formData.aclType"
                            :options="aclTypeOptions"
                            option-label="label"
                            option-value="value"
                            class="w-full" />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel html-for="email">E-mail</InputLabel>
                        <InputText
                            id="email"
                            v-model="formData.email"
                            class="w-full"
                            type="email"
                            placeholder="contact@instelling.nl" />
                    </div>

                    <div>
                        <InputLabel html-for="phone">Telefoon</InputLabel>
                        <InputText
                            id="phone"
                            v-model="formData.phoneNumber"
                            class="w-full"
                            type="tel"
                            placeholder="+32 123 456 789" />
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-4">
                    <div class="col-span-2">
                        <InputLabel html-for="street">Straat</InputLabel>
                        <InputText
                            id="street"
                            v-model="formData.street"
                            class="w-full"
                            placeholder="Straatnaam" />
                    </div>

                    <div>
                        <InputLabel html-for="number">Nummer</InputLabel>
                        <InputText
                            id="number"
                            v-model="formData.number"
                            class="w-full"
                            placeholder="123" />
                    </div>
                </div>

                <div class="grid grid-cols-3 gap-4">
                    <div>
                        <InputLabel html-for="zip">Postcode</InputLabel>
                        <InputText
                            id="zip"
                            v-model="formData.zip"
                            class="w-full"
                            placeholder="1000" />
                    </div>

                    <div class="col-span-2">
                        <InputLabel html-for="city">Stad</InputLabel>
                        <InputText
                            id="city"
                            v-model="formData.city"
                            class="w-full"
                            placeholder="Brussel" />
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <InputLabel html-for="province">Provincie</InputLabel>
                        <InputText
                            id="province"
                            v-model="formData.province"
                            class="w-full"
                            placeholder="Vlaams-Brabant" />
                    </div>

                    <div>
                        <InputLabel html-for="country">Land</InputLabel>
                        <InputText
                            id="country"
                            v-model="formData.country"
                            class="w-full"
                            placeholder="België" />
                    </div>
                </div>
            </div>
        </template>
    </EntityCard>
</template>
