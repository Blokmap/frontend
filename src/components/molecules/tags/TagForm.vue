<script lang="ts" setup>
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import useVuelidate from '@vuelidate/core';
import { watchImmediate } from '@vueuse/core';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { tagToRequest, type Tag, type TagRequest } from '@/domain/tag';
import { tagRequestRules } from '@/domain/tag/helpers';
import { defaultTagRequest } from '@/domain/tag/tagConstants';
import { focusInvalidLocale } from '@/domain/translation';
import LanguageSelector from '../LanguageSelector.vue';
import InputHint from '../form/InputHint.vue';
import InputLabel from '../form/InputLabel.vue';

const props = defineProps<{
    tag?: Tag;
}>();

const emit = defineEmits<{
    'click:save': [TagRequest];
}>();

const { locale } = useI18n();

const editingLocale = ref<string>(locale.value);
const form = ref<TagRequest>(defaultTagRequest());

const v$ = useVuelidate(tagRequestRules, form);

watchImmediate(
    () => props.tag,
    (tag) => {
        form.value = tag ? tagToRequest(tag) : defaultTagRequest();
    },
);

const onSaveClick = async (): Promise<void> => {
    const valid = await v$.value.$validate();

    if (!valid && v$.value.name.$error) {
        const nextLocale = focusInvalidLocale(v$.value.name);

        if (nextLocale) {
            editingLocale.value = nextLocale;
        }
    }

    if (valid) {
        emit('click:save', form.value);
    }
};
</script>

<template>
    <form class="form" @submit.prevent="onSaveClick">
        <fieldset class="form__fieldset">
            <legend class="form__legend">
                <span class="form__section-title">Naam</span>
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
                v-model="form.name[editingLocale]"
                :id="`tag-name-${editingLocale}`"
                :invalid="v$.name[editingLocale].$error">
            </InputText>
            <InputHint :errors="v$.name.$errors" :locale="editingLocale">
                Deze naam wordt getoond in de geselecteerde taal.
            </InputHint>
        </fieldset>

        <div class="form__grid">
            <div class="space-y-1">
                <InputLabel htmlFor="tag-slug">Sleutel *</InputLabel>
                <InputText
                    id="tag-slug"
                    v-model="form.slug"
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
                <InputText id="tag-icon" v-model="form.icon" class="w-full" placeholder="bijv. tag">
                </InputText>
                <InputHint>
                    Optioneel FontAwesome Regular icoon (valt terug op standaard icoon).
                </InputHint>
            </div>
        </div>
    </form>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.form {
    @apply max-w-[500px] space-y-5;

    .form__legend {
        @apply flex w-full items-center justify-between gap-3;
    }

    .form__section-title {
        @apply text-sm font-semibold text-gray-900;
    }

    .form__grid {
        @apply grid grid-cols-1 gap-4 md:grid-cols-2;
    }
}
</style>
