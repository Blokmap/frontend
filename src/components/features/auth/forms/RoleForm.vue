<script lang="ts" setup>
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import ColorPicker from 'primevue/colorpicker';
import InputText from 'primevue/inputtext';
import InputHint from '@/components/shared/molecules/form/InputHint.vue';
import InputLabel from '@/components/shared/molecules/form/InputLabel.vue';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, watchEffect } from 'vue';
import { PERMISSIONS, type CreateRoleBody, type PermissionType, type Role } from '@/domain/member';

const props = withDefaults(
    defineProps<{
        role?: Role;
        type: PermissionType;
        isLoading?: boolean;
    }>(),
    {
        isLoading: false,
    },
);

const emit = defineEmits<{
    'click:save': [form: CreateRoleBody];
}>();

const form = ref<CreateRoleBody>({
    name: '',
    permissions: 0,
    colour: '#1f4161',
});

/**
 * Ensure color always has # prefix
 */
function ensureHashPrefix(color: string): string {
    if (!color) return '#78a0c5';
    return color.startsWith('#') ? color : `#${color}`;
}

/**
 * Handle color picker change
 */
function onColorChange(value: string): void {
    form.value.colour = ensureHashPrefix(value);
}

/**
 * Get available permissions for the role type.
 */
const availablePermissions = computed(() => {
    const permMap = PERMISSIONS[props.type];
    return Object.entries(permMap).map(([label, value]) => ({
        label,
        value,
    }));
});

/**
 * Check if a permission is selected.
 */
function isPermissionSelected(permValue: number): boolean {
    return (form.value.permissions & permValue) === permValue;
}

/**
 * Toggle a permission on or off.
 */
function togglePermission(permValue: number): void {
    if (isPermissionSelected(permValue)) {
        form.value.permissions &= ~permValue;
    } else {
        form.value.permissions |= permValue;
    }
}

/**
 * Handle form submission.
 */
function handleFormSubmission(): void {
    emit('click:save', form.value);
}

/**
 * Watch for role changes and update form.
 */
watchEffect(() => {
    if (props.role) {
        form.value = {
            name: props.role.name,
            permissions: props.role.permissions,
            colour: props.role.colour,
        };
    }
});
</script>

<template>
    <form class="space-y-4" @submit.prevent="handleFormSubmission">
        <!-- Name -->
        <div>
            <InputLabel htmlFor="name"> {{ $t('components.roles.form.name') }} * </InputLabel>
            <InputText id="name" v-model="form.name" class="w-full" required />
            <InputHint>
                {{ $t('components.roles.form.nameHint') }}
            </InputHint>
        </div>

        <!-- Color -->
        <div>
            <InputLabel htmlFor="colour"> {{ $t('components.roles.form.colour') }} * </InputLabel>
            <div class="flex items-center gap-3">
                <ColorPicker
                    id="colour"
                    :model-value="form.colour.replace('#', '')"
                    @update:model-value="onColorChange"
                    format="hex">
                </ColorPicker>
                <InputText
                    v-model="form.colour"
                    class="flex-1"
                    required
                    pattern="^#[0-9A-Fa-f]{6}$">
                </InputText>
            </div>
            <InputHint>
                {{ $t('components.roles.form.colourHint') }}
            </InputHint>
        </div>

        <!-- Permissions -->
        <div>
            <InputLabel htmlFor="permissions">
                {{ $t('components.roles.form.permissions') }}
            </InputLabel>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div
                    v-for="perm in availablePermissions"
                    :key="perm.value"
                    class="flex items-start gap-2"
                    @click="togglePermission(perm.value)">
                    <Checkbox
                        class="mt-0.5"
                        :model-value="isPermissionSelected(perm.value)"
                        :binary="true"
                        @click.stop
                        @update:model-value="togglePermission(perm.value)">
                    </Checkbox>
                    <div class="flex flex-col gap-1">
                        <label class="cursor-pointer text-sm font-medium text-gray-900">
                            {{ $t(`permissions.${type}.${perm.label}.name`) }}
                        </label>
                        <span class="text-xs text-gray-500">
                            {{ $t(`permissions.${type}.${perm.label}.description`) }}
                        </span>
                    </div>
                </div>
            </div>
            <InputHint>
                {{ $t('components.roles.form.permissionsHint') }}
            </InputHint>
        </div>

        <!-- Submit Button -->
        <Button
            :label="$t('general.actions.save')"
            severity="primary"
            type="submit"
            :loading="isLoading">
            <template #icon>
                <FontAwesomeIcon :icon="faSave" />
            </template>
        </Button>
    </form>
</template>
