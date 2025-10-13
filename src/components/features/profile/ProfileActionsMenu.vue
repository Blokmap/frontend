<script lang="ts" setup>
import Select, { type SelectChangeEvent } from 'primevue/select';
import ActionMenu from '@/components/shared/atoms/ActionMenu.vue';
import {
    faUser,
    faUserSlash,
    faMapLocationDot,
    faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import type { Profile, ProfileState } from '@/domain/profile';

const props = defineProps<{
    profile: Profile;
    isPending?: boolean;
}>();

const emit = defineEmits<{
    'change:status': [profileId: number, status: ProfileState];
}>();

const statusOptions = computed(() => {
    return [
        { label: 'Actief', value: 'active', icon: faUser },
        { label: 'Geblokkeerd', value: 'disabled', icon: faUserSlash },
    ];
});

const selectedOption = computed(() => {
    return statusOptions.value.find((opt) => opt.value === props.profile.state) || null;
});

const navigationActions = [
    {
        label: 'Locaties bekijken',
        icon: faMapLocationDot,
        to: { name: 'dashboard.profiles.locations', params: { profileId: props.profile.id } },
    },
    {
        label: 'Autoriteiten bekijken',
        icon: faUserShield,
        to: { name: 'dashboard.authorities.index', query: { profileId: props.profile.id } },
    },
];

const onStatusChange = async (event: SelectChangeEvent, hideMenu: () => void) => {
    const state = event.value as ProfileState;

    if (state && state !== props.profile.state) {
        hideMenu();
        emit('change:status', props.profile.id, state);
    }
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
            <div class="space-y-4">
                <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">
                        Status wijzigen
                    </label>
                    <Select
                        :model-value="props.profile.state"
                        :options="statusOptions"
                        :loading="isPending"
                        option-label="label"
                        option-value="value"
                        placeholder="Selecteer nieuwe status"
                        class="w-full min-w-[200px]"
                        @change="(event) => onStatusChange(event, hideMenu)">
                        <template #option="{ option }">
                            <div class="flex items-center gap-2">
                                <FontAwesomeIcon :icon="option.icon" />
                                <span>{{ option.label }}</span>
                            </div>
                        </template>
                        <template #value="{ value }">
                            <div v-if="value && selectedOption" class="flex items-center gap-2">
                                <FontAwesomeIcon :icon="selectedOption.icon" />
                                <span>{{ selectedOption.label }}</span>
                            </div>
                        </template>
                    </Select>
                </div>

                <div class="space-y-1 border-t border-slate-200 pt-2">
                    <RouterLink
                        v-for="action in navigationActions"
                        :key="action.label"
                        :to="action.to"
                        class="navigation-link"
                        @click="hideMenu">
                        <FontAwesomeIcon :icon="action.icon" class="text-slate-700" />
                        <span>{{ action.label }}</span>
                    </RouterLink>
                </div>
            </div>
        </template>
    </ActionMenu>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.navigation-link {
    @apply flex w-full items-center gap-3 px-2 py-1;
    @apply rounded-md text-sm text-slate-700 transition-colors hover:bg-slate-100;
}
</style>
