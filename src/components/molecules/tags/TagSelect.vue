<script setup lang="ts">
import MultiSelect from 'primevue/multiselect';
import Skeleton from 'primevue/skeleton';
import Tag from '@/components/molecules/tags/Tag.vue';
import { computed } from 'vue';
import type { Tag as TagType } from '@/domain/tag';

defineProps<{
    tags?: TagType[];
    loading?: boolean;
}>();

const selectedTags = defineModel<TagType[]>({
    default: [],
});

const truncatedSelectedTags = computed<TagType[]>(() => {
    return selectedTags.value.slice(0, 4);
});

const remainingSelectedTags = computed<number>(() => {
    return Math.max(0, selectedTags.value.length - 4);
});

const onDeleteTag = (tag: TagType): void => {
    selectedTags.value = selectedTags.value.filter((sel) => sel !== tag);
};
</script>

<template>
    <Skeleton v-if="loading" class="h-5 w-full"></Skeleton>
    <MultiSelect
        v-else
        class="w-full"
        input-id="tags"
        placeholder="Selecteer tags"
        v-model="selectedTags"
        :options="tags || []">
        <template #value="{ value }">
            <div v-if="value && value.length" class="flex items-center gap-2">
                <Tag
                    :tag="tag"
                    v-for="tag in truncatedSelectedTags"
                    @click:delete="onDeleteTag"
                    clearable>
                </Tag>
            </div>
            <span v-if="remainingSelectedTags > 0" class="text-sm text-slate-600">
                + {{ remainingSelectedTags }}
            </span>
        </template>
        <template #option="{ option }">
            <Tag :tag="option"></Tag>
        </template>
    </MultiSelect>
</template>
