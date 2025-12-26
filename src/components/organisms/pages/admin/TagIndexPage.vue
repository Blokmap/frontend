<script lang="ts" setup>
import TagBuilderDialog from '@/components/molecules/tags/TagBuilderDialog.vue';
import TagTable from '@/components/molecules/tags/TagTable.vue';
import PageContent from '@/components/organisms/pages/PageContent.vue';
import PageTitle from '@/components/organisms/pages/PageTitle.vue';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';
import { useReadTags } from '@/composables/data/useTags';
import PageHeaderButton from '../PageHeaderButton.vue';
import type { Tag } from '@/domain/tag';

const { data: tags, isLoading } = useReadTags();

const selectedTag = ref<Tag | null>(null);
const showTagBuilderDialog = ref<boolean>(false);

const onCreateClick = (): void => {
    selectedTag.value = null;
    showTagBuilderDialog.value = true;
};
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

        <TagTable :tags="tags" :loading="isLoading"> </TagTable>

        <Teleport to="body">
            <TagBuilderDialog v-model:visible="showTagBuilderDialog" />
        </Teleport>
    </PageContent>
</template>
