<script lang="ts" setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import { faClose, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';
import type { Profile } from '@/domain/profile';

defineProps<{
    loading?: boolean;
    profiles?: Profile[];
}>();

const emit = defineEmits<{
    search: [query: string];
    'select:profile': [profile: Profile];
}>();

const visible = defineModel<boolean>('visible', { default: false });

const searchQuery = ref('');

function handleSearch(): void {
    if (searchQuery.value.trim()) {
        emit('search', searchQuery.value.trim());
    }
}

function handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
        handleSearch();
    }
}

function handleSelectProfile(profile: Profile): void {
    emit('select:profile', profile);
}
</script>

<template>
    <Dialog v-model:visible="visible" class="w-full max-w-6xl" :draggable="false" modal>
        <template #container>
            <div class="flex h-[700px] flex-col overflow-hidden">
                <!-- Header -->
                <div class="flex-shrink-0 space-y-4 border-b border-slate-200 p-6">
                    <div class="flex items-center justify-between">
                        <h2 class="text-xl font-semibold text-slate-900">Gebruiker toevoegen</h2>
                        <Button severity="contrast" text rounded @click="visible = false">
                            <template #icon>
                                <FontAwesomeIcon :icon="faClose" />
                            </template>
                        </Button>
                    </div>

                    <p class="text-sm text-slate-600">
                        Zoek naar gebruikers om toe te voegen. Gebruik de zoekfunctie om specifieke
                        profielen te vinden.
                    </p>

                    <!-- Search Input -->
                    <div class="flex gap-3">
                        <IconField class="flex-1">
                            <InputIcon>
                                <FontAwesomeIcon :icon="faMagnifyingGlass" class="text-slate-400" />
                            </InputIcon>
                            <InputText
                                v-model="searchQuery"
                                class="w-full"
                                placeholder="Zoek op naam, gebruikersnaam of e-mailadres..."
                                :disabled="loading"
                                @keypress="handleKeyPress">
                            </InputText>
                        </IconField>

                        <Button
                            severity="primary"
                            :loading="loading"
                            :disabled="!searchQuery.trim() || loading"
                            @click="handleSearch">
                            <template #icon>
                                <FontAwesomeIcon :icon="faMagnifyingGlass" />
                            </template>
                        </Button>
                    </div>
                </div>

                <!-- Table Content Slot -->
                <div class="flex-1 overflow-y-auto p-6">
                    <slot name="table" :profiles="profiles" :on-select="handleSelectProfile">
                    </slot>
                </div>
            </div>
        </template>
    </Dialog>
</template>
