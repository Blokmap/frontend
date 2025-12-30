<script lang="ts" setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import LanguageSelector from '@/components/molecules/LanguageSelector.vue';
import InputLabel from '@/components/molecules/form/InputLabel.vue';
import { faSave, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { watchImmediate } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { tagToRequest, type Tag, type TagRequest } from '@/domain/tag';
import { defaultTagRequest } from '@/domain/tag/tagConstants';
import InputHint from '../form/InputHint.vue';

const props = defineProps<{
    tag?: Tag;
    pending?: boolean;
}>();

const emit = defineEmits<{
    'click:save': [form: TagRequest];
}>();

const visible = defineModel<boolean>('visible');

const { locale } = useI18n();

const currentLanguage = ref<string>(locale.value);

const isEditing = computed<boolean>(() => {
    return props.tag !== undefined;
});

const form = ref<TagRequest>(defaultTagRequest());

// Sync tag prop to form
watchImmediate([visible, () => props.tag] as const, ([isVisible, tag]) => {
    if (!isVisible) {
        return;
    }

    form.value = tag ? tagToRequest(tag) : defaultTagRequest();
});

const onSaveClick = (): void => {
    emit('click:save', form.value);
};

const onCancelClick = (): void => {
    if (props.pending) {
        return;
    }

    visible.value = false;
};
</script>

<template>
    <Dialog
        v-model:visible="visible"
        :closable="!pending"
        :dismissable-mask="!pending"
        modal
        class="tag-builder-dialog">
        <template #header>
            <h3 class="tag-builder-dialog__title">
                <template v-if="!isEditing">Nieuwe Tag</template>
                <template v-else>Tag Bewerken</template>
            </h3>
        </template>
        <template #default>
            <form class="tag-builder-dialog__form" @submit.prevent="onSaveClick">
                <fieldset class="tag-builder-dialog__fieldset">
                    <legend class="tag-builder-dialog__legend">
                        <span class="tag-builder-dialog__section-title">Naam</span>
                        <LanguageSelector v-model="currentLanguage">
                            <template #button="{ toggle, currentFlag, currentLabel }">
                                <Button
                                    severity="contrast"
                                    size="small"
                                    class="text-sm"
                                    @click="toggle">
                                    <img :src="currentFlag" alt="flag" class="mr-2 h-4 w-4" />
                                    <span class="text-sm">{{ currentLabel }}</span>
                                </Button>
                            </template>
                        </LanguageSelector>
                    </legend>

                    <InputLabel :htmlFor="`tag-name-${currentLanguage}`">
                        Naam ({{ currentLanguage.toUpperCase() }}) *
                    </InputLabel>
                    <InputText
                        :id="`tag-name-${currentLanguage}`"
                        v-model="form.name[currentLanguage]"
                        class="w-full"
                        placeholder="Bijv. toegankelijk"
                        required>
                    </InputText>
                    <InputHint> Deze naam wordt getoond in de geselecteerde taal. </InputHint>
                </fieldset>

                <div class="tag-builder-dialog__grid">
                    <div class="space-y-1">
                        <InputLabel htmlFor="tag-key">Key *</InputLabel>
                        <InputText
                            id="tag-key"
                            v-model="form.key"
                            class="w-full"
                            placeholder="bijv. toegankelijk"
                            required>
                        </InputText>
                        <InputHint>
                            Unieke sleutel voor API/filters (kleine letters, geen spaties).
                        </InputHint>
                    </div>

                    <div class="space-y-1">
                        <InputLabel htmlFor="tag-icon">Icon</InputLabel>
                        <InputText
                            id="tag-icon"
                            v-model="form.icon"
                            class="w-full"
                            placeholder="bijv. tag">
                        </InputText>
                        <InputHint>
                            Optioneel FontAwesome Regular icoon (valt terug op standaard icoon).
                        </InputHint>
                    </div>
                </div>
            </form>
        </template>

        <template #footer>
            <div class="tag-builder-dialog__footer">
                <Button
                    severity="contrast"
                    class="text-sm"
                    :disabled="pending"
                    @click="onCancelClick">
                    <FontAwesomeIcon :icon="faXmark" class="mr-2" />
                    Annuleren
                </Button>

                <Button class="text-sm" :loading="pending" @click="onSaveClick">
                    <FontAwesomeIcon :icon="faSave" class="mr-2" />
                    {{ isEditing ? 'Opslaan' : 'Aanmaken' }}
                </Button>
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.tag-builder-dialog {
    .tag-builder-dialog__title {
        @apply text-lg font-semibold text-gray-900;
    }

    .tag-builder-dialog__form {
        @apply max-w-[500px] space-y-5;
    }

    .tag-builder-dialog__fieldset {
        @apply space-y-3;
    }

    .tag-builder-dialog__legend {
        @apply flex w-full items-center justify-between gap-3;
    }

    .tag-builder-dialog__section-title {
        @apply text-sm font-semibold text-gray-900;
    }

    .tag-builder-dialog__grid {
        @apply grid grid-cols-1 gap-4 md:grid-cols-2;
    }

    .tag-builder-dialog__footer {
        @apply flex w-full items-center justify-end gap-2;
    }
}
</style>
