<script lang="ts" setup>
import Select, { type SelectChangeEvent } from 'primevue/select';
import ActionMenu from '@/components/shared/atoms/ActionMenu.vue';
import NavigationLink from '@/components/shared/atoms/NavigationLink.vue';
import { faTrash, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import type { Membership, Role } from '@/domain/auth';

const props = defineProps<{
    member: Membership;
    availableRoles: Role[];
    isPending?: boolean;
}>();

const emit = defineEmits<{
    'change:role': [profileId: string, roleName: string];
    remove: [profileId: string];
}>();

const roleOptions = computed(() => {
    return props.availableRoles.map((role) => ({
        label: role.name,
        value: role.name,
        colour: role.colour,
    }));
});

const selectedRole = computed(() => {
    return roleOptions.value.find((opt) => opt.value === props.member.role.name) || null;
});

const onRoleChange = async (event: SelectChangeEvent, hideMenu: () => void) => {
    const roleName = event.value as string;

    if (roleName && roleName !== props.member.role.name) {
        hideMenu();
        emit('change:role', props.member.profile.id, roleName);
    }
};

const onRemoveMember = (hideMenu: () => void) => {
    hideMenu();
    emit('remove', props.member.profile.id);
};
</script>

<template>
    <ActionMenu :is-pending="isPending">
        <template #trigger="{ toggle }">
            <slot name="trigger" :toggle="toggle">
                <!-- Default trigger is provided by ActionMenu -->
            </slot>
        </template>

        <template #content="{ hideMenu }">
            <div>
                <label class="mb-1 block text-sm font-medium text-gray-700"> Rol wijzigen </label>
                <Select
                    :model-value="member.role.name"
                    :options="roleOptions"
                    :loading="isPending"
                    option-label="label"
                    option-value="value"
                    placeholder="Selecteer rol"
                    class="w-full min-w-[200px]"
                    @change="(event) => onRoleChange(event, hideMenu)">
                    <template #option="{ option }">
                        <div class="flex items-center gap-2 text-sm">
                            <span
                                class="inline-block h-3 w-3 rounded-full"
                                :style="{ backgroundColor: option.colour }"></span>
                            <span>{{ option.label }}</span>
                        </div>
                    </template>
                    <template #value="{ value }">
                        <div v-if="value && selectedRole" class="flex items-center gap-2 text-sm">
                            <span
                                class="inline-block h-3 w-3 rounded-full"
                                :style="{ backgroundColor: selectedRole.colour }"></span>
                            <span>{{ selectedRole.label }}</span>
                        </div>
                    </template>
                </Select>
            </div>
        </template>

        <template #navigation="{ hideMenu }">
            <NavigationLink
                :icon="faUserEdit"
                label="Profiel bekijken"
                :to="{
                    name: 'dashboard.profiles.detail.overview',
                    params: { profileId: member.profile.id },
                }"
                @click="hideMenu">
            </NavigationLink>
            <NavigationLink
                :icon="faTrash"
                label="Verwijderen"
                destructive
                @click="onRemoveMember(hideMenu)">
            </NavigationLink>
        </template>
    </ActionMenu>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
