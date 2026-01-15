<script lang="ts" setup>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputHint from '@/components/atoms/form/InputHint.vue';
import InputIcon from '@/components/atoms/form/InputIcon.vue';
import InputLabel from '@/components/atoms/form/InputLabel.vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useForm } from '@/composables/useForm';
import { tagToRequest, type Tag, type TagRequest } from '@/domain/tag';
import { tagRequestRules } from '@/domain/tag/helpers';
import { defaultTagRequest } from '@/domain/tag/tagConstants';
import { focusInvalidLocale } from '@/domain/translation';
import LanguageSelector from '../LanguageSelector.vue';

const props = defineProps<{
    tag?: Tag;
}>();

const emit = defineEmits<{
    'click:save': [TagRequest];
}>();

const { locale } = useI18n();

const { body, v$ } = useForm(defaultTagRequest(), tagRequestRules, {
    sync: () => props.tag,
    syncFn: tagToRequest,
});

const editingLocale = ref<string>(locale.value);

const onSaveClick = async (): Promise<void> => {
    const valid = await v$.value.$validate();

    if (!valid && v$.value.name.$error) {
        const nextLocale = focusInvalidLocale(v$.value.name);

        if (nextLocale) {
            editingLocale.value = nextLocale;
        }
    }

    if (valid) {
        emit('click:save', body.value);
    }
};
</script>

<template>
    <form class="max-w-[500px] space-y-5" @submit.prevent="onSaveClick">
        <fieldset>
            <legend class="flex w-full items-center justify-between gap-3">
                <span class="text-sm font-semibold text-gray-900">Naam</span>
                <LanguageSelector v-model="editingLocale">
                    <template #button="{ toggle, currentFlag, currentLabel }">
                        <Button severity="contrast" size="small" class="text-sm" @click="toggle">
                            <img :src="currentFlag" alt="flag" class="mr-2 h-4 w-4" />
                            <span class="text-sm">{{ currentLabel }}</span>
                        </Button>
                    </template>
                </LanguageSelector>
            </legend>
            <InputLabel :htmlFor="`tag-name-${editingLocale}`">
                Naam ({{ editingLocale.toUpperCase() }}) *
            </InputLabel>
            <InputText
                class="w-full"
                placeholder="Bijv. toegankelijk"
                v-model="body.name[editingLocale]"
                :id="`tag-name-${editingLocale}`"
                :invalid="v$.name[editingLocale].$error">
            </InputText>
            <InputHint :errors="v$.name.$errors" :locale="editingLocale">
                Deze naam wordt getoond in de geselecteerde taal.
            </InputHint>
        </fieldset>

        <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div class="space-y-1">
                <InputLabel htmlFor="tag-slug">Sleutel *</InputLabel>
                <InputText
                    id="tag-slug"
                    v-model="body.slug"
                    :invalid="v$.slug.$error"
                    class="w-full"
                    placeholder="bijv. toegankelijk">
                </InputText>
                <InputHint :errors="v$.slug.$errors">
                    Unieke sleutel voor API/filters (kleine letters, geen spaties).
                </InputHint>
            </div>

            <div class="space-y-1">
                <InputLabel htmlFor="tag-icon">Icoon</InputLabel>
                <InputIcon id="tag-icon" v-model="body.icon" class="w-full" placeholder="bijv. tag">
                </InputIcon>
                <InputHint>
                    Optioneel FontAwesome Regular icoon (valt terug op standaard icoon).
                </InputHint>
            </div>
        </div>
    </form>
</template>
