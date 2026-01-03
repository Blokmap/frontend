<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';
import InputHint from '@/components/atoms/form/InputHint.vue';
import Callout from '@/components/molecules/Callout.vue';
import AuthoritySelect from '@/components/molecules/authority/AuthoritySelect.vue';
import InstitutionSelect from '@/components/molecules/institution/InstitutionSelect.vue';
import { faSitemap } from '@fortawesome/free-solid-svg-icons';
import { computed, watchEffect } from 'vue';
import LocationBuilderCard from '../LocationBuilderCard.vue';
import type { Authority } from '@/domain/authority';
import type { Institution } from '@/domain/institution';
import type { LocationRequest } from '@/domain/location';

const props = withDefaults(
    defineProps<{
        institutionOptions?: Institution[];
        authorityOptions?: Authority[];
        disabled?: boolean;
    }>(),
    {
        disabled: false,
    },
);

const form = defineModel<Pick<LocationRequest, 'authorityId' | 'institutionId'>>('form', {
    required: true,
});

// If no institution is selected, reset the authority selection
watchEffect(() => {
    if (!form.value.institutionId) {
        form.value.authorityId = null;
    }
});

const isAuthorityDisabled = computed(() => {
    return props.disabled || !form.value.institutionId;
});
</script>

<template>
    <LocationBuilderCard :icon="faSitemap">
        <template #header>
            <h3 class="text-xl font-semibold text-gray-900">Organisatie en Groep</h3>
            <p class="text-slate-600">
                Bekijk of wijzig de organisatie of groep waartoe deze locatie behoort.
            </p>
        </template>
        <template #default>
            <Callout v-if="disabled" severity="error">
                Enkel administrators kunnen de organisatie en groep van een locatie wijzigen.
            </Callout>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <template v-if="institutionOptions">
                        <InstitutionSelect
                            v-model="form.institutionId"
                            :institutions="institutionOptions"
                            :disabled="disabled">
                        </InstitutionSelect>
                        <InputHint>
                            Selecteer de organisatie waaronder deze locatie wordt aangemaakt
                        </InputHint>
                    </template>
                    <template v-else>
                        <Skeleton height="42px" />
                        <Skeleton height="18px" class="mt-1" />
                    </template>
                </div>
                <div>
                    <template v-if="authorityOptions">
                        <AuthoritySelect
                            v-model="form.authorityId"
                            :authorities="authorityOptions"
                            :disabled="isAuthorityDisabled">
                        </AuthoritySelect>
                        <InputHint>
                            Selecteer de autoriteit waaronder deze locatie wordt aangemaakt
                        </InputHint>
                    </template>
                    <template v-else-if="form.institutionId">
                        <Skeleton height="42px" />
                        <Skeleton height="18px" class="mt-1" />
                    </template>
                </div>
            </div>
        </template>
    </LocationBuilderCard>
</template>
