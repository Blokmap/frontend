<script setup lang="ts">
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import InputHint from '@/components/atoms/form/InputHint.vue';
import InputLabel from '@/components/atoms/form/InputLabel.vue';
import LanguageSelector from '@/components/molecules/LanguageSelector.vue';
import EditorInput from '@/components/molecules/editor/EditorInput.vue';
import LocationBuilderCard from '@/components/molecules/location/builder/LocationBuilderCard.vue';
import TagSelect from '@/components/molecules/tags/TagSelect.vue';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useReadTags } from '@/composables/data/useTags';
import { getOutputDataLength } from '@/domain/editor/editorHelpers';
import { LOCATION_SETTINGS } from '@/domain/location';
import { type Tag as TagType } from '@/domain/tag';
import type { LocationRequest } from '@/domain/location';

const form = defineModel<LocationRequest>({ required: true });

const selectedTags = defineModel<TagType[]>('tags', {
    default: [],
});

const { locale } = useI18n();

const { data: tags, isLoading: isLoadingTags } = useReadTags();

const currentLanguage = ref<string>(locale.value);
</script>

<template>
    <div class="space-y-8">
        <LocationBuilderCard :icon="faEdit">
            <template #header>
                <h3 class="text-xl font-semibold text-gray-900">Naam en beschrijving</h3>
                <p class="text-sm text-gray-600">Voer de basisgegevens van uw locatie in</p>
            </template>
            <template #actions>
                <slot name="actions"></slot>
            </template>
            <template #default>
                <div>
                    <InputLabel> Bewerk in taal </InputLabel>
                    <LanguageSelector v-model="currentLanguage">
                        <template #button="{ toggle, currentFlag, currentLabel }">
                            <Button severity="contrast" size="small" @click="toggle">
                                <img :src="currentFlag" alt="flag" class="h-4 w-4" />
                                <span class="text-sm">{{ currentLabel }}</span>
                            </Button>
                        </template>
                    </LanguageSelector>
                </div>

                <div>
                    <InputLabel htmlFor="name"> Locatie naam * </InputLabel>
                    <InputText id="name" v-model="form.name" class="w-full" placeholder="De Krook">
                    </InputText>
                    <InputHint> Kies een herkenbare naam voor de locatie </InputHint>
                </div>

                <!-- Short description (current language) -->
                <div>
                    <InputLabel :htmlFor="`excerpt-${currentLanguage}`">
                        Korte omschrijving ({{ currentLanguage }})
                    </InputLabel>
                    <InputText
                        :id="`excerpt-${currentLanguage}`"
                        :maxlength="LOCATION_SETTINGS.MAX_EXCERPT_LENGTH"
                        v-model="form.excerpt![currentLanguage]"
                        class="w-full"
                        placeholder="Stadsbibliotheek met zicht op het water">
                    </InputText>
                    <InputHint>
                        <div class="flex justify-between">
                            <span class="text-gray-500">
                                Omschrijf de locatie in maximaal 6 beschrijvende woorden
                            </span>
                            <span class="text-gray-500">
                                {{ (form.excerpt?.[currentLanguage] || '').length }}/{{
                                    LOCATION_SETTINGS.MAX_EXCERPT_LENGTH
                                }}
                                karakters
                            </span>
                        </div>
                    </InputHint>
                </div>

                <!-- Tags -->
                <div>
                    <InputLabel html-for="tags"> Tags </InputLabel>
                    <TagSelect v-model="selectedTags" :tags="tags" :loading="isLoadingTags" />
                    <InputHint>
                        Met tags kan je voorzieningen oplijsten die de locatie aanbiedt.
                    </InputHint>
                </div>

                <!-- Detailed Description -->
                <div>
                    <InputLabel :htmlFor="`description-${currentLanguage}`">
                        Uitgebreide Beschrijving ({{ currentLanguage }})
                    </InputLabel>
                    <EditorInput
                        :id="`description-${currentLanguage}`"
                        :max-length="LOCATION_SETTINGS.MAX_DESCRIPTION_LENGTH"
                        v-model="form.description![currentLanguage]">
                    </EditorInput>
                    <InputHint>
                        {{ getOutputDataLength(form.description?.[currentLanguage] || '') }}/{{
                            LOCATION_SETTINGS.MAX_DESCRIPTION_LENGTH
                        }}
                        karakters
                    </InputHint>
                </div>
            </template>
        </LocationBuilderCard>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';
</style>
