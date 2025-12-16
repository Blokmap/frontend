<script lang="ts" setup>
import ActionMenu from '@/components/shared/atoms/menu/ActionMenu.vue';
import ActionMenuButton from '@/components/shared/atoms/menu/ActionMenuButton.vue';
import { faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { computed, ref, watch } from 'vue';
import { ProfileState, type Profile } from '@/domain/profile';
import ProfileStateSelect from './forms/ProfileStateSelect.vue';

type ProfileActionMenuEmits = {
    'select:state': [profileId: string, state: ProfileState];
    'click:locations': [profileId: string];
};

type ProfileAction = keyof ProfileActionMenuEmits;

type ProfileActionMenuProps = {
    profile: Profile;
    actions?: ProfileAction[];
    pendingActions?: Partial<Record<ProfileAction, boolean>>;
};

const props = withDefaults(defineProps<ProfileActionMenuProps>(), {
    actions: () => {
        return ['click:locations'];
    },
});

const emit = defineEmits<ProfileActionMenuEmits>();

const visible = ref<boolean>(false);

const onStateSelect = (state: ProfileState | null): void => {
    if (state === null) {
        return;
    }

    emit('select:state', props.profile.id, state);
};

const isPending = (action: ProfileAction): boolean => {
    return !!props.pendingActions?.[action];
};

const pending = computed<boolean>(() => {
    return Object.values(props.pendingActions ?? {}).some((isPending) => isPending);
});

watch(pending, (isPending, wasPending) => {
    if (wasPending && !isPending) {
        visible.value = false;
    }
});
</script>

<template>
    <ActionMenu :pending="pending" v-model:visible="visible">
        <template #trigger="{ toggle }">
            <slot name="trigger" :toggle="toggle"></slot>
        </template>

        <template #content>
            <ProfileStateSelect
                :state="profile.state"
                :clearable="false"
                :loading="isPending('select:state')"
                @update:state="onStateSelect">
            </ProfileStateSelect>
        </template>

        <template #navigation>
            <ActionMenuButton
                v-if="actions.includes('click:locations')"
                :icon="faMapLocationDot"
                label="Locaties bekijken"
                @click="emit('click:locations', profile.id)">
            </ActionMenuButton>
        </template>
    </ActionMenu>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
