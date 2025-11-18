<script setup lang="ts">
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import SubmissionDialog from '@/components/features/location/builder/LocationSubmissionDialog.vue';
import LocationImagesBuilder from '@/components/features/location/builder/builders/LocationImagesBuilder.vue';
import LocationInformationBuilder from '@/components/features/location/builder/builders/LocationInformationBuilder.vue';
import LocationSettingsBuilder from '@/components/features/location/builder/builders/LocationSettingsBuilder.vue';
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

const showSubmissionDialog = ref(false);

async function submitLocation() {
    showSubmissionDialog.value = true;
}
</script>

<template>
    <!-- Main content area -->
    <div class="mx-auto flex w-full max-w-[2048px] flex-col gap-4 md:flex-row md:gap-6">
        <!-- Sidebar -->
        <div class="sidebar">
            <h1 class="text-2xl font-bold">
                {{ steps[stepIndex].label }}
            </h1>

            <p class="text-sm text-slate-500">
                {{ steps[stepIndex].desc }}
            </p>

            <div class="hidden space-y-3 md:block">
                <div v-for="substep in substeps" :key="substep.label">
                    <Checkbox :model-value="substep.isCompleted" :disabled="true" :binary="true" />
                    <span
                        class="ms-3 text-sm"
                        :class="substep.isCompleted ? 'text-gray-900' : 'text-gray-500'">
                        {{ substep.label }}
                    </span>
                </div>
            </div>

            <div class="sidebar-progress">
                <div class="progressbar">
                    <div class="indicator" :style="{ width: progress + '%' }"></div>
                </div>
            </div>

            <div class="sidebar-navigation hidden w-full justify-between md:flex">
                <Button
                    :disabled="!canGoPrevious"
                    severity="secondary"
                    size="small"
                    @click="goPrevious">
                    <FontAwesomeIcon :icon="faArrowLeft" class="mr-2" />
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
                        <FontAwesomeIcon v-else :icon="faSpinner" class="mr-2" spin />
                        {{ $t('general.actions.complete') }}
                    </template>
                    <template v-else>
                        {{ $t('general.actions.next') }}
                        <FontAwesomeIcon :icon="faArrowRight" class="ml-2" />
                    </template>
                </Button>
            </div>
        </div>

        <!-- Builder content -->
        <div class="w-full md:w-5/7">
            <LocationInformationBuilder v-if="step === BuilderStep.Basics" v-model="locationForm">
            </LocationInformationBuilder>

            <LocationImagesBuilder v-if="step === BuilderStep.Images" v-model="imagesForm">
            </LocationImagesBuilder>

            <LocationSettingsBuilder
                v-if="step === BuilderStep.Settings"
                v-model:form="locationForm"
                :authorities="memberships">
            </LocationSettingsBuilder>
        </div>

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
            <div class="mobile-bottom-bar">
                <!-- Progress bar -->
                <div class="progressbar flex-1">
                    <div class="indicator" :style="{ width: progress + '%' }" />
                </div>

                <!-- Steps indicator -->
                <div class="flex items-center gap-2 text-xs text-slate-600">
                    <span>{{ stepIndex + 1 }}/{{ steps.length }}</span>
                    <span class="text-slate-400">•</span>
                    <span>
                        {{ substeps.filter((s) => s.isCompleted).length }}/{{ substeps.length }}
                    </span>
                </div>

                <!-- Navigation buttons -->
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

.sidebar {
    @apply w-full space-y-3 md:w-2/7 md:space-y-6;
    @apply md:sticky md:top-6 md:h-fit md:rounded-md;
}

.mobile-bottom-bar {
    @apply fixed right-0 bottom-0 left-0 z-40;
    @apply flex items-center gap-3 border-t border-slate-200 bg-white px-4 py-2.5 shadow-lg;
    @apply md:hidden;
}

.progressbar {
    @apply relative h-2 w-full rounded-xl bg-slate-300;

    .indicator {
        @apply bg-primary-500 absolute top-0 left-0 h-full rounded-xl;
        @apply transition-all duration-300;
    }
}
</style>
