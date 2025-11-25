<script lang="ts" setup>
import Button from 'primevue/button';
import Skeleton from 'primevue/skeleton';
import { faArrowsUpDown, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, useTemplateRef } from 'vue';
import { useFloatingPosition } from '@/composables/useFloatingPosition';
import InstitutionSelectorItem from './InstitutionSelectorItem.vue';
import type { InstitutionAuthorityMemberships } from '@/domain/member';

defineProps<{
    institutions?: InstitutionAuthorityMemberships[];
}>();

const selected = defineModel<InstitutionAuthorityMemberships | null>('institution');

const toggleRef = useTemplateRef('toggle');
const overlayRef = useTemplateRef('overlay');

const isVisible = ref<boolean>(false);

const { positionStyles: position } = useFloatingPosition(toggleRef, overlayRef, isVisible, true);

function isAccess(institution: InstitutionAuthorityMemberships): boolean {
    return !!institution.role || institution.authorities.length > 0;
}

function onInstitutionSelect(institution: InstitutionAuthorityMemberships) {
    selected.value = institution;
    isVisible.value = false;
}
</script>

<template>
    <div class="selector">
        <template v-if="!institutions">
            <Skeleton class="selector__skeleton" />
        </template>
        <template v-else>
            <div
                class="selector__toggle"
                :class="{ 'selector__toggle--active': !!selected }"
                @click="isVisible = !isVisible"
                ref="toggle">
                <InstitutionSelectorItem
                    v-if="selected"
                    class="w-full"
                    :membership="selected"
                    :disabled="!isAccess(selected)">
                </InstitutionSelectorItem>
                <div v-else class="selector__toggle-text">
                    Selecteer een organisatie
                    <FontAwesomeIcon class="selector__toggle-icon" :icon="faArrowsUpDown" />
                </div>
            </div>
        </template>
        <Teleport to="body">
            <Transition name="slide-down">
                <div class="selector__overlay" ref="overlay" :style="position" v-if="isVisible">
                    <h2 class="selector__overlay-title">Organisaties waar je lid van bent</h2>
                    <template v-if="!institutions?.length">
                        <p class="selector__overlay--empty">
                            Je bent nog geen lid van een organisatie. Maak een organisatie aan voor
                            je bedrijf of instelling om bloklocaties te beheren.
                        </p>
                        <Button class="w-full">
                            Nieuwe organisatie aanmaken
                            <FontAwesomeIcon :icon="faPlus" />
                        </Button>
                    </template>
                    <template v-else>
                        <template
                            v-for="membership in institutions"
                            :key="membership.institution.id">
                            <InstitutionSelectorItem
                                :membership="membership"
                                :disabled="!isAccess(membership)"
                                :selected="selected?.institution.id === membership.institution.id"
                                @click="onInstitutionSelect(membership)">
                            </InstitutionSelectorItem>
                        </template>
                    </template>
                </div>
            </Transition>
        </Teleport>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.selector__skeleton {
    @apply !h-[72px] w-full rounded-xl bg-slate-200/50;
}

.selector__toggle {
    @apply flex min-h-[72px] items-center justify-center;
    @apply cursor-pointer rounded-lg border-2 border-dashed border-slate-200;

    .selector__toggle-text {
        @apply mx-4 flex w-full items-center justify-between;
        @apply text-center;
    }

    .selector__toggle-icon {
        @apply text-sm text-slate-600;
    }

    &.selector__toggle--active {
        @apply border-solid;
    }
}

.selector__overlay {
    @apply w-full space-y-4 p-5;
    @apply rounded-xl bg-white shadow-md;

    .selector__overlay-title {
        @apply text-lg font-bold;
    }

    .selector__overlay--empty {
        @apply text-slate-600;
    }
}
</style>
