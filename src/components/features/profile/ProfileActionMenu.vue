<script lang="ts" setup>
import ActionMenu from '@/components/shared/atoms/menu/ActionMenu.vue';
import ActionMenuButton from '@/components/shared/atoms/menu/ActionMenuButton.vue';
import ActionMenuSelect from '@/components/shared/atoms/menu/ActionMenuSelect.vue';
import {
    faUser,
    faUserSlash,
    faMapLocationDot,
    faUserShield,
} from '@fortawesome/free-solid-svg-icons';
import { computed } from 'vue';
import { ProfileState, type Profile } from '@/domain/profile';

const props = withDefaults(
    defineProps<{
        profile: Profile;
        pending?: boolean;
        showStateSelect?: boolean;
        showLocations?: boolean;
        showAuthorities?: boolean;
    }>(),
    {
        showStateSelect: true,
        showLocations: true,
        showAuthorities: true,
    },
);

const emit = defineEmits<{
    'select:state': [profielId: string, status: ProfileState];
}>();

const statusOptions = computed(() => {
    return [
        { label: 'Actief', value: ProfileState.Active, icon: faUser },
        { label: 'Geblokkeerd', value: ProfileState.Disabled, icon: faUserSlash },
    ];
});

/**
 * Handle state selection change.
 *
 * @param state - The selected profile state
 */
function onStateSelect(state: ProfileState): void {
    emit('select:state', props.profile.id, state);
}
</script>

<template>
    <ActionMenu :pending="pending">
        <template #trigger="{ toggle }">
            <slot name="trigger" :toggle="toggle" />
        </template>

        <template #content>
            <ActionMenuSelect
                v-if="showStateSelect"
                :value="props.profile.state"
                :options="statusOptions"
                :loading="pending"
                label="Status wijzigen"
                placeholder="Selecteer nieuwe status"
                @change="onStateSelect" />
        </template>

        <template #navigation>
            <ActionMenuButton
                v-if="showLocations"
                :icon="faMapLocationDot"
                label="Locaties bekijken"
                :to="{
                    name: 'dashboard.profiles.detail.locations',
                    params: { profileId: props.profile.id },
                }" />
            <ActionMenuButton
                v-if="showAuthorities"
                :icon="faUserShield"
                label="Autoriteiten bekijken"
                :to="{
                    name: 'dashboard.profiles.detail.authorities',
                    params: { profileId: props.profile.id },
                }" />
        </template>
    </ActionMenu>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
