<script lang="ts" setup>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import CardField from '@/components/shared/molecules/CardField.vue';
import CardValue from '@/components/shared/molecules/CardValue.vue';
import LanguageSelector from '@/components/shared/molecules/LanguageSelector.vue';
import InputLabel from '@/components/shared/molecules/form/InputLabel.vue';
import EditableCard from '@/components/shared/organisms/EditableCard.vue';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    institutionToBody,
    type Institution,
    type InstitutionBody,
    INSTITUTION_CATEGORIES,
} from '@/domain/institution';

const props = defineProps<{
    institution: Institution;
    isUpdating: boolean;
}>();

const emit = defineEmits<{
    save: [data: InstitutionBody];
}>();

const editMode = defineModel<boolean>('editMode', { default: false });

const { locale, t } = useI18n();

const lang = ref<string>(locale.value);
const form = ref<InstitutionBody>(institutionToBody(props.institution));

watchEffect(() => {
    form.value = institutionToBody(props.institution);
});

const categories = computed(() => {
    return INSTITUTION_CATEGORIES.map((c) => ({
        label: t(`domains.institutions.category.${c}`),
        value: c,
    }));
});

const categoryLabel = computed<string>(() => {
    return categories.value.find((c) => c.value === props.institution.category)?.label || 'N/A';
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
        <div class="card__field">
            <div class="card__label-row">
                <InputLabel uppercase>Naam</InputLabel>
                <LanguageSelector v-model="lang">
                    <template #button="{ toggle, currentFlag, currentLabel }">
                        <Button severity="contrast" size="small" @click="toggle">
                            <img :src="currentFlag" alt="flag" class="mr-2 h-4 w-4" />
                            {{ currentLabel }}
                        </Button>
                    </template>
                </LanguageSelector>
            </div>
            <InputText v-if="editMode" v-model="form.name[lang]" class="w-full"></InputText>
            <CardValue v-else>
                {{ institution.name[lang] || 'N/A' }}
            </CardValue>
        </div>
        <CardField label="Categorie">
            <Select
                v-if="editMode"
                v-model="form.category"
                :options="categories"
                option-label="label"
                option-value="value"
                class="w-full"></Select>
            <CardValue v-else>
                {{ categoryLabel }}
            </CardValue>
        </CardField>
    </EditableCard>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.card__field {
    @apply block min-w-0;
}

.card__label-row {
    @apply mb-2 flex items-end justify-between;
}

.card__label-row label {
    @apply mb-0;
}
</style>
