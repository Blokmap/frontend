<script lang="ts" setup>
import ActionMenu from '@/components/atoms/menu/ActionMenu.vue';
import ActionMenuButton from '@/components/atoms/menu/ActionMenuButton.vue';
import ConfirmDialog from '@/components/molecules/ConfirmDialog.vue';
import { faTrashCan, faEdit } from '@fortawesome/free-solid-svg-icons';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import type { Tag } from '@/domain/tag';

type TagActionMenuEmits = {
    'click:delete': [id: number];
    'click:edit': [id: number];
};

type TagAction = keyof TagActionMenuEmits;

type TagActionMenuProps = {
    tag: Tag;
    actions?: TagAction[];
    pendingActions?: Partial<Record<TagAction, boolean>>;
};

const props = withDefaults(defineProps<TagActionMenuProps>(), {
    actions: () => {
        return ['click:edit', 'click:delete'];
    },
});

const emit = defineEmits<TagActionMenuEmits>();

const { locale } = useI18n();

const visible = ref<boolean>(false);
const showDeleteDialog = ref<boolean>(false);

const onConfirmDeletion = (): void => {
    emit('click:delete', props.tag.id);
};

const onCancelDeletion = (): void => {
    showDeleteDialog.value = false;
};

const onDeleteClick = (): void => {
    showDeleteDialog.value = true;
};

const onEditClick = (): void => {
    emit('click:edit', props.tag.id);
};

const actionPending = (action: TagAction): boolean => {
    return props.pendingActions?.[action] ?? false;
};

const pending = computed<boolean>(() => {
    return Object.values(props.pendingActions ?? {}).some((isPending) => isPending);
});

watch(pending, (isPending, wasPending) => {
    if (wasPending && !isPending) {
        visible.value = false;
        showDeleteDialog.value = false;
    }
});
</script>

<template>
    <ActionMenu :pending="pending" v-model:visible="visible">
        <template #trigger="{ toggle }">
            <slot name="trigger" :toggle="toggle">
                <!-- Default trigger is provided by ActionMenu -->
            </slot>
        </template>

        <template #navigation>
            <ActionMenuButton
                v-if="actions.includes('click:edit')"
                label="Bewerken"
                :icon="faEdit"
                :loading="actionPending('click:edit')"
                @click="onEditClick">
            </ActionMenuButton>

            <ActionMenuButton
                v-if="actions.includes('click:delete')"
                label="Verwijderen"
                :icon="faTrashCan"
                :loading="actionPending('click:delete')"
                @click="onDeleteClick"
                destructive>
            </ActionMenuButton>
        </template>
    </ActionMenu>

    <Teleport to="body">
        <ConfirmDialog
            v-model:visible="showDeleteDialog"
            title="Tag verwijderen"
            confirm-label="Verwijderen"
            :loading="pending"
            @click:confirm="onConfirmDeletion"
            @click:cancel="onCancelDeletion"
            destructive>
            <template #content>
                <p class="text-gray-600">
                    Weet je zeker dat je <strong>"{{ tag.name[locale] }}"</strong> wilt verwijderen?
                    Deze actie kan niet ongedaan worden gemaakt.
                </p>
            </template>
        </ConfirmDialog>
    </Teleport>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
