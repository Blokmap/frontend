<script lang="ts" setup>
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Select from 'primevue/select';
import EntityAvatar from '@/components/shared/molecules/avatar/EntityAvatar.vue';
import InputHint from '@/components/shared/molecules/form/InputHint.vue';
import InputLabel from '@/components/shared/molecules/form/InputLabel.vue';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useDebounceFn } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useFindProfiles } from '@/composables/data/useProfile';
import type { CreateMemberBody, Role } from '@/domain/member';
import type { FoundProfile } from '@/domain/profile';

const props = defineProps<{
    roles: Role[];
    isPending?: boolean;
}>();

const emit = defineEmits<{
    'click:submit': [form: CreateMemberBody];
}>();

const isVisible = defineModel<boolean>('isVisible', {
    default: false,
});

const selectedProfile = ref<FoundProfile | null>(null);

const form = ref<CreateMemberBody>({
    username: '',
    roleId: null,
});

const filters = ref({
    query: '',
    page: 1,
    limit: 10,
});

const { data: profiles, isFetching: isLoadingProfiles } = useFindProfiles(filters);

const profileOptions = computed<FoundProfile[]>(() => {
    return profiles.value?.data || [];
});

const roleOptions = computed<{ label: string; value: number }[]>(() => {
    return props.roles.map((role: Role) => ({
        label: role.name,
        value: role.id,
    }));
});

const debouncedSearch = useDebounceFn((event: { query: string }) => {
    filters.value.query = event.query || '';
    filters.value.page = 1;
}, 300);

function onSubmitForm(): void {
    if (selectedProfile.value) {
        form.value.username = selectedProfile.value.username;
    }

    emit('click:submit', form.value);
}
</script>

<template>
    <Dialog v-model:visible="isVisible" modal>
        <template #header>
            <div class="flex flex-col">
                <h3 class="text-lg font-semibold text-gray-900">Beheerder Toevoegen</h3>
            </div>
        </template>
        <template #default>
            <div class="space-y-4">
                <p class="text-slate-500">
                    Voeg een nieuwe beheerder met een rol toe aan deze locatie.
                </p>
                <form @submit.prevent="onSubmitForm">
                    <div class="grid grid-cols-1 gap-4">
                        <div>
                            <InputLabel htmlFor="username"> Gebruikersnaam </InputLabel>
                            <AutoComplete
                                id="username"
                                class="w-full"
                                v-model="selectedProfile"
                                :suggestions="profileOptions"
                                :loading="isLoadingProfiles"
                                option-label="username"
                                placeholder="Zoek een gebruiker..."
                                @complete="debouncedSearch"
                                force-selection
                                required>
                                <template #option="{ option }">
                                    <div class="flex items-center gap-3">
                                        <EntityAvatar class="h-10 w-10" :image="option.avatar?.url">
                                        </EntityAvatar>
                                        <div class="flex flex-col">
                                            <span class="text-sm font-medium">
                                                {{ option.username }}
                                            </span>
                                            <span
                                                v-if="option.firstName || option.lastName"
                                                class="text-xs text-slate-500">
                                                {{ option.firstName }} {{ option.lastName }}
                                            </span>
                                        </div>
                                    </div>
                                </template>
                                <template #empty>
                                    <span class="text-sm text-slate-500">
                                        Geen gebruikers gevonden.
                                    </span>
                                </template>
                            </AutoComplete>
                            <InputHint>
                                Zoek en selecteer een gebruiker om toe te voegen als beheerder.
                            </InputHint>
                        </div>
                        <div>
                            <InputLabel htmlFor="role"> Rol </InputLabel>

                            <Select
                                placeholder="Selecteer rol"
                                option-label="label"
                                option-value="value"
                                v-model="form.roleId"
                                :options="roleOptions">
                            </Select>

                            <InputHint>
                                Selecteer de rol die u wilt toewijzen aan deze gebruiker.
                            </InputHint>
                        </div>
                    </div>
                </form>
            </div>
        </template>
        <template #footer>
            <Button
                severity="primary"
                type="submit"
                :label="$t('general.actions.save')"
                :loading="isPending"
                @click="onSubmitForm">
                <template #icon>
                    <FontAwesomeIcon :icon="faSave" />
                </template>
            </Button>
        </template>
    </Dialog>
</template>
