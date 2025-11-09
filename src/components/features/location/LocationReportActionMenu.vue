<script lang="ts" setup>
import ActionMenu from '@/components/shared/atoms/menu/ActionMenu.vue';
import ActionMenuButton from '@/components/shared/atoms/menu/ActionMenuButton.vue';
import ConfirmDialog from '@/components/shared/molecules/ConfirmDialog.vue';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { ref, watch } from 'vue';
import type { LocationReport } from '@/domain/report';

const props = withDefaults(
    defineProps<{
        report: LocationReport;
        isPending?: boolean;
    }>(),
    {
        isPending: false,
    },
);

const emit = defineEmits<{
    'click:delete': [locationId: number, reportId: number];
}>();

const showDeleteDialog = ref(false);

function onDeleteClick(): void {
    showDeleteDialog.value = true;
}

function onConfirmDeletion(): void {
    emit('click:delete', props.report.location.id, props.report.id);
}

function onCancelDeletion(): void {
    showDeleteDialog.value = false;
}

watch(
    () => props.isPending,
    (isPending, wasPending) => {
        if (wasPending && !isPending && showDeleteDialog.value) {
            showDeleteDialog.value = false;
        }
    },
);
</script>

<template>
    <ActionMenu :is-pending="isPending">
        <template #navigation>
            <ActionMenuButton
                label="Verwijderen"
                :icon="faTrashCan"
                @click="onDeleteClick"
                destructive>
            </ActionMenuButton>
        </template>
    </ActionMenu>

    <Teleport to="body">
        <ConfirmDialog
            v-model:visible="showDeleteDialog"
            title="Melding verwijderen"
            confirm-label="Verwijderen"
            :loading="isPending"
            @click:confirm="onConfirmDeletion"
            @click:cancel="onCancelDeletion"
            destructive>
            <template #content>
                <p class="text-gray-600">
                    Weet je zeker dat je deze melding voor
                    <strong>"{{ report.location.name }}"</strong> wilt verwijderen?
                </p>
            </template>
        </ConfirmDialog>
    </Teleport>
</template>
