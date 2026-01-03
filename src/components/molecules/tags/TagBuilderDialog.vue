<script lang="ts" setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import { faSave, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { type Tag, type TagRequest } from '@/domain/tag';
import TagForm from './TagForm.vue';

const props = defineProps<{
    tag?: Tag;
    pending?: boolean;
}>();

const emit = defineEmits<{
    'click:save': [form: TagRequest];
}>();

const visible = defineModel<boolean>('visible');

const editing = computed<boolean>(() => {
    return props.tag !== undefined;
});

const onSaveClick = (form: TagRequest): void => {
    emit('click:save', form);
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
                <template v-if="!editing">Nieuwe Tag</template>
                <template v-else>Tag Bewerken</template>
            </h3>
        </template>
        <template #default>
            <TagForm :tag="tag" id="tag-form" @click:save="onSaveClick" />
        </template>

        <template #footer>
            <Button severity="contrast" class="text-sm" :disabled="pending" @click="onCancelClick">
                <FontAwesomeIcon :icon="faXmark" />
                Annuleren
            </Button>

            <Button type="submit" form="tag-form" class="text-sm" :loading="pending">
                <FontAwesomeIcon v-if="pending" :icon="faSpinner" spin />
                <FontAwesomeIcon v-else :icon="faSave" />
                {{ editing ? 'Opslaan' : 'Aanmaken' }}
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
