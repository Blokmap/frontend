<script setup lang="ts">
import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputHint from '@/components/atoms/form/InputHint.vue';
import InputLabel from '@/components/atoms/form/InputLabel.vue';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { AuthorityRequest } from '@/domain/authority';

const form = defineModel<AuthorityRequest>({ required: true });

const AUTHORITY_SETTINGS = {
    MAX_NAME_LENGTH: 100,
    MAX_DESCRIPTION_LENGTH: 500,
};
</script>

<template>
    <div class="space-y-8">
        <Card class="card">
            <template #header>
                <div class="card__header">
                    <div class="header__icon">
                        <FontAwesomeIcon :icon="faEdit" />
                    </div>
                    <div class="header__title">
                        <h3 class="text-xl font-semibold text-gray-900">Groep informatie</h3>
                        <p class="text-sm text-gray-600">
                            Bewerk de naam en beschrijving van deze groep
                        </p>
                    </div>
                    <div class="header__actions">
                        <slot name="actions"></slot>
                    </div>
                </div>
            </template>
            <template #content>
                <div class="card__body">
                    <div>
                        <InputLabel htmlFor="name"> Groep naam * </InputLabel>
                        <InputText
                            id="name"
                            v-model="form.name"
                            class="w-full"
                            :maxlength="AUTHORITY_SETTINGS.MAX_NAME_LENGTH"
                            placeholder="Administratie">
                        </InputText>
                        <InputHint>
                            <div class="flex justify-between">
                                <span class="text-gray-500">
                                    Kies een herkenbare naam voor de groep
                                </span>
                                <span class="text-gray-500">
                                    {{ (form.name || '').length }}/{{
                                        AUTHORITY_SETTINGS.MAX_NAME_LENGTH
                                    }}
                                    karakters
                                </span>
                            </div>
                        </InputHint>
                    </div>

                    <div>
                        <InputLabel htmlFor="description"> Beschrijving </InputLabel>
                        <Textarea
                            id="description"
                            v-model="form.description"
                            class="w-full"
                            :maxlength="AUTHORITY_SETTINGS.MAX_DESCRIPTION_LENGTH"
                            rows="4"
                            placeholder="Een korte beschrijving van deze groep">
                        </Textarea>
                        <InputHint>
                            <div class="flex justify-between">
                                <span class="text-gray-500">
                                    Optionele beschrijving van de groep
                                </span>
                                <span class="text-gray-500">
                                    {{ (form.description || '').length }}/{{
                                        AUTHORITY_SETTINGS.MAX_DESCRIPTION_LENGTH
                                    }}
                                    karakters
                                </span>
                            </div>
                        </InputHint>
                    </div>
                </div>
            </template>
        </Card>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.card {
    .card__header {
        @apply flex flex-wrap items-center gap-3 p-4 pb-0;

        .header__icon {
            @apply bg-primary-50 text-primary-700 hidden h-13 w-13 shrink-0 items-center justify-center sm:flex;
            @apply rounded-full;
        }

        .header__title {
            @apply w-full space-y-1 sm:w-auto sm:flex-1;
        }

        .header__actions {
            @apply mr-auto flex w-full items-center gap-2 sm:ml-auto sm:w-auto;
        }
    }

    .card__body {
        @apply space-y-4;
    }
}
</style>
