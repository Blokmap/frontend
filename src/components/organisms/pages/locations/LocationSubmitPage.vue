<script setup lang="ts">
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import SubmissionDialog from '@/components/molecules/location/builder/LocationSubmissionDialog.vue';
import LocationAddressBuilder from '@/components/molecules/location/builder/builders/LocationAddressBuilder.vue';
import LocationImagesBuilder from '@/components/molecules/location/builder/builders/LocationImagesBuilder.vue';
import LocationInformationBuilder from '@/components/molecules/location/builder/builders/LocationInformationBuilder.vue';
import LocationSettingsBuilder from '@/components/molecules/location/builder/builders/LocationSettingsBuilder.vue';
import { faArrowLeft, faArrowRight, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref } from 'vue';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useReadProfileAuthorityMemberships } from '@/composables/data/useMembers';
import { BuilderStep, useLocationBuilder } from '@/composables/useLocationBuilder';

const { profileId } = useAuthProfile();
const { data: memberships } = useReadProfileAuthorityMemberships(profileId);

const {
    locationForm,
    imagesForm,
    step,
    substeps,
    stepIndex,
    progress,
    steps,
    canGoNext,
    canGoPrevious,
    isLastStep,
    goNext,
    goPrevious,
} = useLocationBuilder();

const showSubmissionDialog = ref<boolean>(false);

async function submitLocation() {
    showSubmissionDialog.value = true;
}
</script>

<template>
    <div class="submit-page">
        <!-- Sidebar -->
        <Transition name="slide-in-left" appear>
            <aside class="submit-page__sidebar">
                <h1 class="submit-page__title">
                    {{ steps[stepIndex].label }}
                </h1>

                <p class="submit-page__description">
                    {{ steps[stepIndex].desc }}
                </p>

                <div class="submit-page__substeps">
                    <div
                        v-for="substep in substeps"
                        :key="substep.label"
                        class="submit-page__substep">
                        <Checkbox
                            :model-value="substep.isCompleted"
                            :disabled="true"
                            :binary="true">
                        </Checkbox>
                        <span
                            class="submit-page__substep-label"
                            :class="{
                                'submit-page__substep-label--completed': substep.isCompleted,
                            }">
                            {{ substep.label }}
                        </span>
                    </div>
                </div>

                <div class="submit-page__progress">
                    <div class="submit-page__progress-bar">
                        <div
                            class="submit-page__progress-indicator"
                            :style="{ width: progress + '%' }"></div>
                    </div>
                </div>

                <div class="submit-page__navigation">
                    <Button
                        :disabled="!canGoPrevious"
                        severity="contrast"
                        size="small"
                        @click="goPrevious">
                        <FontAwesomeIcon :icon="faArrowLeft" />
                        {{ $t('general.actions.previous') }}
                    </Button>

                    <Button
                        :disabled="!canGoNext || showSubmissionDialog"
                        size="small"
                        @click="isLastStep ? submitLocation() : goNext()">
                        <template v-if="isLastStep">
                            <FontAwesomeIcon
                                v-if="!showSubmissionDialog"
                                :icon="faCheck"
                                class="mr-2" />
                            <FontAwesomeIcon v-else :icon="faSpinner" spin />
                            {{ $t('general.actions.complete') }}
                        </template>
                        <template v-else>
                            {{ $t('general.actions.next') }}
                            <FontAwesomeIcon :icon="faArrowRight" />
                        </template>
                    </Button>
                </div>
            </aside>
        </Transition>

        <main class="submit-page__content">
            <Transition name="fade-slide-up" is="div" mode="out-in" appear>
                <!-- Builder content -->
                <div v-if="step === BuilderStep.Basics" :key="BuilderStep.Basics" class="space-y-8">
                    <LocationInformationBuilder v-model="locationForm">
                    </LocationInformationBuilder>

                    <LocationAddressBuilder v-model="locationForm"> </LocationAddressBuilder>
                </div>

                <LocationImagesBuilder
                    v-else-if="step === BuilderStep.Images"
                    v-model="imagesForm"
                    :key="BuilderStep.Images">
                </LocationImagesBuilder>

                <LocationSettingsBuilder
                    v-else-if="step === BuilderStep.Settings"
                    v-model:form="locationForm"
                    :key="BuilderStep.Settings"
                    :authorities="memberships">
                </LocationSettingsBuilder>
            </Transition>
        </main>

        <!-- Submission Dialog -->
        <Teleport to="body">
            <SubmissionDialog
                v-model:visible="showSubmissionDialog"
                :can-submit="isLastStep && canGoNext"
                :location="locationForm"
                :images="imagesForm">
            </SubmissionDialog>
        </Teleport>

        <!-- Mobile sticky bottom bar -->
        <Teleport to="body">
            <div class="submit-page__mobile-bar">
                <div class="submit-page__progress-bar submit-page__progress-bar--mobile">
                    <div
                        class="submit-page__progress-indicator"
                        :style="{ width: progress + '%' }" />
                </div>

                <div class="submit-page__mobile-steps">
                    <span>{{ stepIndex + 1 }}/{{ steps.length }}</span>
                    <span class="submit-page__mobile-separator">•</span>
                    <span>
                        {{ substeps.filter((s) => s.isCompleted).length }}/{{ substeps.length }}
                    </span>
                </div>

                <Button
                    :disabled="!canGoPrevious"
                    severity="secondary"
                    rounded
                    size="small"
                    @click="goPrevious">
                    <FontAwesomeIcon :icon="faArrowLeft" />
                </Button>

                <Button
                    :disabled="!canGoNext || showSubmissionDialog"
                    rounded
                    size="small"
                    @click="isLastStep ? submitLocation() : goNext()">
                    <FontAwesomeIcon v-if="isLastStep && !showSubmissionDialog" :icon="faCheck" />
                    <FontAwesomeIcon v-else-if="showSubmissionDialog" :icon="faSpinner" spin />
                    <FontAwesomeIcon v-else :icon="faArrowRight" />
                </Button>
            </div>
        </Teleport>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.submit-page {
    @apply mx-auto my-6 flex w-full max-w-[2048px] flex-col gap-4 md:flex-row md:gap-12;
}

.submit-page__sidebar {
    @apply w-full space-y-3 md:w-2/7 md:space-y-6;
    @apply md:sticky md:top-6 md:h-fit md:rounded-md;
}

.submit-page__title {
    @apply text-3xl font-black;
}

.submit-page__description {
    @apply text-slate-600;
}

.submit-page__substeps {
    @apply hidden space-y-3 md:block;
}

.submit-page__substep {
    @apply flex items-center;
}

.submit-page__substep-label {
    @apply ms-3 text-sm text-slate-500;

    &.submit-page__substep-label--completed {
        @apply text-slate-700;
    }
}

.submit-page__progress {
    @apply w-full;
}

.submit-page__progress-bar {
    @apply relative h-2 w-full rounded-xl bg-slate-300;

    &--mobile {
        @apply flex-1;
    }
}

.submit-page__progress-indicator {
    @apply bg-primary-500 absolute top-0 left-0 h-full rounded-xl;
    @apply transition-all duration-300;
}

.submit-page__navigation {
    @apply hidden w-full justify-between md:flex;
}

.submit-page__content {
    @apply w-full md:w-5/7;
}

.submit-page__mobile-bar {
    @apply fixed right-0 bottom-0 left-0 z-40;
    @apply flex items-center gap-3 border-t border-slate-200 bg-white px-4 py-2.5 shadow-lg;
    @apply md:hidden;
}

.submit-page__mobile-steps {
    @apply flex items-center gap-2 text-xs text-slate-600;
}

.submit-page__mobile-separator {
    @apply text-slate-400;
}
</style>
