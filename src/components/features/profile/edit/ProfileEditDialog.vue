<script lang="ts" setup>
import { useUpdateProfile } from '@/composables/data/useProfile';
import { useToast } from '@/composables/useToast';
import { type Profile, type ProfileRequest } from '@/domain/profile';
import { faClose, faSave, faUserXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useQueryClient } from '@tanstack/vue-query';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Divider from 'primevue/divider';
import InputSwitch from 'primevue/inputswitch';
import InputText from 'primevue/inputtext';
import { ref } from 'vue';

const props = defineProps<{ profile: Profile }>();
const visible = defineModel<boolean>('visible', { default: false });

const messages = useToast();
const client = useQueryClient();

const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile({
    onSuccess: () => {
        visible.value = false;
        messages.add({
            severity: 'success',
            summary: 'Profiel bijgewerkt',
            detail: 'Je profielgegevens zijn succesvol bijgewerkt.',
        });
    },
    onError: (error) => {
        messages.add({
            severity: 'error',
            summary: 'Fout bij bijwerken',
            detail: 'Er is een fout opgetreden bij het bijwerken van je profiel.',
        });
    },
});

const profileData = ref<ProfileRequest>({
    firstName: props.profile.firstName,
    lastName: props.profile.lastName,
    username: props.profile.username,
});

const settings = ref({
    emailNotifications: false,
    weeklyDigest: true,
    showOnlineStatus: true,
});

function handleSave(): void {
    updateProfile({
        profileId: props.profile.id,
        profileData: profileData.value,
    });
}

function handleDeactivate(): void {
    // TODO: Implement profile deactivation
    messages.add({
        severity: 'warn',
        summary: 'Niet geïmplementeerd',
        detail: 'Account deactiveren is nog niet geïmplementeerd.',
    });
}

function handleCancel(): void {
    visible.value = false;
}
</script>

<template>
    <Dialog v-model:visible="visible" class="w-[500px]" :draggable="false" modal>
        <template #container>
            <div class="space-y-4 overflow-y-auto p-6">
                <!-- Header -->
                <div class="mb-2 flex items-center justify-between">
                    <h2 class="text-xl font-medium">Profiel bewerken</h2>
                    <Button severity="contrast" @click="visible = false" outlined rounded>
                        <template #icon>
                            <FontAwesomeIcon :icon="faClose" />
                        </template>
                    </Button>
                </div>
                <p class="text-slate-700">Bewerk je profielgegevens en instellingen hieronder.</p>

                <!-- Personal Information -->
                <div class="grid grid-cols-2 gap-3">
                    <div class="space-y-2">
                        <label for="firstName" class="block text-sm font-medium text-gray-700">
                            Voornaam
                        </label>
                        <InputText
                            id="firstName"
                            v-model="profileData.firstName"
                            class="w-full"
                            placeholder="Voornaam"
                            :disabled="isUpdating" />
                    </div>
                    <div class="space-y-2">
                        <label for="lastName" class="block text-sm font-medium text-gray-700">
                            Achternaam
                        </label>
                        <InputText
                            id="lastName"
                            v-model="profileData.lastName"
                            class="w-full"
                            placeholder="Achternaam"
                            :disabled="isUpdating">
                        </InputText>
                    </div>
                </div>

                <div class="space-y-2">
                    <label for="username" class="block text-sm font-medium text-gray-700">
                        Gebruikersnaam
                    </label>
                    <InputText
                        id="username"
                        v-model="profileData.username"
                        class="w-full"
                        placeholder="Gebruikersnaam (optioneel)"
                        :disabled="isUpdating">
                    </InputText>
                </div>

                <!-- Settings -->
                <h3 class="text-lg font-medium text-gray-900">Voorkeuren</h3>

                <div class="space-y-4">
                    <div
                        class="flex cursor-pointer items-center justify-between"
                        @click="settings.emailNotifications = !settings.emailNotifications">
                        <div class="flex-1">
                            <label class="block cursor-pointer text-sm font-medium text-gray-700">
                                E-mails versturen
                            </label>
                            <p class="text-xs text-gray-500">
                                Ontvang updates en meldingen per e-mail
                            </p>
                        </div>
                        <InputSwitch v-model="settings.emailNotifications" />
                    </div>

                    <div
                        class="flex cursor-pointer items-center justify-between"
                        @click="settings.showOnlineStatus = !settings.showOnlineStatus">
                        <div class="flex-1">
                            <label class="block cursor-pointer text-sm font-medium text-gray-700">
                                Openbaar profiel
                            </label>
                            <p class="text-xs text-gray-500">Anderen kunnen je profiel bekijken</p>
                        </div>
                        <InputSwitch v-model="settings.showOnlineStatus" />
                    </div>

                    <div
                        class="flex cursor-pointer items-center justify-between"
                        @click="settings.weeklyDigest = !settings.weeklyDigest">
                        <div class="flex-1">
                            <label class="block cursor-pointer text-sm font-medium text-gray-700">
                                Gebruik statistieken
                            </label>
                            <p class="text-xs text-gray-500">
                                Help ons de app te verbeteren met anonieme data
                            </p>
                        </div>
                        <InputSwitch v-model="settings.weeklyDigest" />
                    </div>
                </div>

                <!-- Actions -->
                <Button
                    class="mt-1 w-full"
                    @click="handleSave"
                    :loading="isUpdating"
                    :disabled="!profileData.firstName || !profileData.lastName || isUpdating">
                    <template #icon>
                        <FontAwesomeIcon :icon="faSave" />
                    </template>
                    Wijzigingen opslaan
                </Button>

                <!-- Danger Zone -->
                <div
                    class="pointer-events-none flex cursor-not-allowed items-center justify-between opacity-50">
                    <div>
                        <p class="text-sm font-medium text-gray-700">Account beheer</p>
                        <p class="text-xs text-gray-500">Permanent je account deactiveren</p>
                    </div>
                    <Button
                        size="small"
                        severity="danger"
                        class="text-xs"
                        text
                        @click="handleDeactivate"
                        :disabled="isUpdating">
                        Deactiveren
                    </Button>
                </div>
            </div>
        </template>
    </Dialog>
</template>
