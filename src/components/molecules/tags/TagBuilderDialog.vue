<script lang="ts" setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { faSave, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { watchImmediate } from '@vueuse/core';
import { computed, ref } from 'vue';
import { tagToRequest, type Tag, type TagRequest } from '@/domain/tag';
import { defaultTagRequest } from '@/domain/tag/tagConstants';
import TagForm from './TagForm.vue';

const props = defineProps<{
    tag?: Tag;
    pending?: boolean;
}>();

const emit = defineEmits<{
    'click:save': [form: TagRequest];
}>();

const visible = defineModel<boolean>('visible');

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
            <TagForm :tag="tag" @click:save="onSaveClick" />
        </template>

        <template #footer>
            <Button severity="contrast" class="text-sm" :disabled="pending" @click="onCancelClick">
                <FontAwesomeIcon :icon="faXmark" class="mr-2" />
                Annuleren
            </Button>

            <Button class="text-sm" :loading="pending" @click="onSaveClick">
                <FontAwesomeIcon :icon="faSave" class="mr-2" />
                {{ isEditing ? 'Opslaan' : 'Aanmaken' }}
            </Button>
        </template>
    </Dialog>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.tag-builder-dialog {
    .tag-builder-dialog__title {
        @apply text-lg font-semibold text-gray-900;
    }
}
</style>
