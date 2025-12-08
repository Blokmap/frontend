<script lang="ts" setup>
import Dialog from 'primevue/dialog';
import RoleForm from '@/components/features/auth/forms/RoleForm.vue';
import { computed } from 'vue';
import type { PermissionType } from '@/domain/auth';
import type { CreateRoleBody, Role } from '@/domain/member';

const props = withDefaults(
    defineProps<{
        role?: Role;
        type: PermissionType;
        isPending?: boolean;
    }>(),
    {
        isPending: false,
    },
);

const emit = defineEmits<{
    'click:submit': [form: CreateRoleBody];
}>();

const isVisible = defineModel<boolean>('isVisible', {
    default: false,
});

/**
 * Determine if we're editing an existing role.
 */
const isEditing = computed(() => !!props.role);

/**
 * Get dialog title based on mode.
 */
const dialogTitle = computed(() => {
    return isEditing.value ? 'Rol Bewerken' : 'Rol Toevoegen';
});

/**
 * Get dialog description based on mode.
 */
const dialogDescription = computed(() => {
    return isEditing.value
        ? 'Bewerk de naam, kleur en permissies van deze rol.'
        : 'Voeg een nieuwe rol toe met specifieke permissies.';
});

/**
 * Handle submitting the form.
 */
function onSubmitForm(form: CreateRoleBody): void {
    emit('click:submit', form);
}
</script>

<template>
    <Dialog v-model:visible="isVisible" modal :dismissable-mask="!isPending" :closable="!isPending">
        <template #header>
            <div class="flex flex-col">
                <h3 class="text-lg font-semibold text-gray-900">{{ dialogTitle }}</h3>
            </div>
        </template>
        <template #default>
            <div class="space-y-4">
                <p class="text-slate-500">
                    {{ dialogDescription }}
                </p>
                <RoleForm
                    :role="role"
                    :type="type"
                    :is-loading="isPending"
                    @click:save="onSubmitForm">
                </RoleForm>
            </div>
        </template>
    </Dialog>
</template>
