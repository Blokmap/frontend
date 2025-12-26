<script lang="ts" setup>
import AutoComplete from 'primevue/autocomplete';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import EntityAvatar from '@/components/molecules/avatar/EntityAvatar.vue';
import InputHint from '@/components/molecules/form/InputHint.vue';
import InputLabel from '@/components/molecules/form/InputLabel.vue';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useDebounceFn } from '@vueuse/core';
import { computed, ref } from 'vue';
import { useFindProfiles } from '@/composables/data/useProfile';
import { type ProfileFindFilter, type FoundProfile } from '@/domain/profile';

defineProps<{
    pending?: boolean;
}>();

const isVisible = defineModel<boolean>('visible', {
    default: false,
});

const emit = defineEmits<{
    'click:submit': [username: string];
}>();

function onSubmitForm(): void {
    if (!selectedProfile.value) {
        return;
    }

    emit('click:submit', selectedProfile.value.username);
}

const selectedProfile = ref<FoundProfile | null>(null);

const filters = ref<ProfileFindFilter>({
    query: null,
});

const debouncedSearch = useDebounceFn((event: { query: string }) => {
    filters.value.query = event.query;
}, 300);

const { data: profiles, isFetching: isLoadingProfiles } = useFindProfiles(filters);

const profileOptions = computed<FoundProfile[]>(() => {
    return profiles.value?.data || [];
});
</script>

<template>
    <Dialog v-model:visible="isVisible" class="max-w-[500px]" modal>
        <template #header>
            <div class="flex flex-col">
                <h3 class="text-lg font-semibold text-gray-900">Lid Toevoegen</h3>
            </div>
        </template>
        <template #default>
            <div class="space-y-4">
                <p class="text-slate-500">
                    Voeg een nieuw lid toe aan deze locatie. De gebruiker kan dan reserveren op
                    locaties binnen deze organisatie.
                </p>
                <form @submit.prevent="onSubmitForm">
                    <div>
                        <InputLabel html-for="username"> Gebruikersnaam </InputLabel>
                        <AutoComplete
                            id="username"
                            class="w-full"
                            option-label="username"
                            placeholder="Zoek een gebruiker..."
                            v-model="selectedProfile"
                            :suggestions="profileOptions"
                            :loading="isLoadingProfiles"
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
                </form>
            </div>
        </template>
        <template #footer>
            <Button
                severity="primary"
                type="submit"
                :label="$t('general.actions.save')"
                :loading="pending"
                @click="onSubmitForm">
                <template #icon>
                    <FontAwesomeIcon :icon="faSave" />
                </template>
            </Button>
        </template>
    </Dialog>
</template>
