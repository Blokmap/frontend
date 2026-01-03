<script lang="ts" setup>
import TagActionMenu from '@/components/molecules/tags/TagActionMenu.vue';
import TagBuilderDialog from '@/components/molecules/tags/TagBuilderDialog.vue';
import TagTable from '@/components/molecules/tags/TagTable.vue';
import PageContent from '@/components/organisms/pages/PageContent.vue';
import PageTitle from '@/components/organisms/pages/PageTitle.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useCreateTag, useReadTags, useUpdateTag, useDeleteTag } from '@/composables/data/useTags';
import { router } from '@/config/router';
import PageHeaderButton from '../PageHeaderButton.vue';
import type { TagRequest } from '@/domain/tag';

const route = useRoute();

const { data: tags, isLoading } = useReadTags();

const isCreating = ref(false);

const { mutate: createTag, isPending: isPendingCreate } = useCreateTag({
    onSuccess: () => {
        isCreating.value = false;
    },
});

const { mutate: updateTag, isPending: isPendingUpdate } = useUpdateTag({
    onSuccess: () => {
        router.push({ name: 'admin.tags' });
    },
});

const { mutate: deleteTag, isPending: isPendingDelete } = useDeleteTag();

const tagId = computed(() => {
    const param = route.params.tagId;
    return param ? Number(param) : undefined;
});

const selectedTag = computed(() => {
    const id = tagId.value;
    return id && tags.value ? (tags.value.find((t) => t.id === id) ?? null) : null;
});

const showTagBuilderDialog = computed({
    get: () => !!tagId.value || isCreating.value,
    set: (value) => {
        if (!value) {
            isCreating.value = false;

            if (tagId.value) {
                router.push({ name: 'admin.tags' });
            }
        }
    },
});

const onSaveClick = (request: TagRequest): void => {
    if (selectedTag.value) {
        updateTag({ tagId: selectedTag.value.id, body: request });
    } else {
        createTag(request);
    }
};

const onCreateClick = (): void => {
    isCreating.value = true;
};

const onEditClick = (tagId: number): void => {
    router.push({ name: 'admin.tags', params: { tagId } });
};

const onDeleteClick = (tagId: number): void => {
    deleteTag(tagId);
};

const isPending = computed(() => {
    return isPendingCreate.value || isPendingUpdate.value;
});
</script>

<template>
    <PageContent>
        <PageTitle title="Tags">
            <template #actions>
                <PageHeaderButton severity="primary" label="Tag Toevoegen" @click="onCreateClick">
                    <FontAwesomeIcon :icon="faPlus" />
                </PageHeaderButton>
            </template>
        </PageTitle>

        <TagTable :tags="tags" :loading="isLoading">
            <template #actions="{ tag }">
                <TagActionMenu
                    :tag="tag"
                    :pending-actions="{
                        'click:delete': isPendingDelete,
                    }"
                    @click:edit="onEditClick"
                    @click:delete="onDeleteClick">
                </TagActionMenu>
            </template>
        </TagTable>

        <Teleport to="body">
            <TagBuilderDialog
                v-model:visible="showTagBuilderDialog"
                :tag="selectedTag ?? undefined"
                :pending="isPending"
                @click:save="onSaveClick">
            </TagBuilderDialog>
        </Teleport>
    </PageContent>
</template>
