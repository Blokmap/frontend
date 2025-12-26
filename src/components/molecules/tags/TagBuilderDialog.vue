<script lang="ts" setup>
import Dialog from 'primevue/dialog';
import { computed, ref, watch } from 'vue';
import { DEFAULT_TAG_REQUEST } from '@/domain/tag/tagConstants';
import type { Tag, TagRequest } from '@/domain/tag';

const props = defineProps<{
    tag?: Tag;
    pending?: boolean;
}>();

const emit = defineEmits<{
    'click:save': [form: TagRequest];
}>();

const form = ref<TagRequest>(DEFAULT_TAG_REQUEST);

// Sync the form with the tag prop.
watch(
    () => props.tag,
    (tag: Tag | undefined) => {
        if (tag === undefined) {
            return;
        }

        form.value = {
            name: tag.name,
            icon: tag.icon?.iconName,
            key: tag.key,
        };
    },
);

const visible = defineModel<boolean>('visible');

// Hide dialog when toggling visible.
watch(
    () => props.pending,
    (prev, next) => {
        if (prev === true && next === false) {
            visible.value = false;
        }
    },
);

const isEditing = computed<boolean>(() => {
    return props.tag !== undefined;
});

const onSaveClick = (): void => {
    emit('click:save', form.value);
};
</script>

<template>
    <Dialog v-model:visible="visible" :closable="!pending" modal>
        <template #header>
            <div class="flex flex-col">
                <h3 class="text-lg font-semibold text-gray-900">
                    <template v-if="isEditing">Nieuwe Tag</template>
                    <template v-else>Tag Bewerken</template>
                </h3>
            </div>
        </template>
        <template #default>
            <form class="space-y-4" @submit.prevent="onSaveClick">
                <!-- <TagComponent :tag="form" /> -->
            </form>
        </template>
    </Dialog>
</template>
