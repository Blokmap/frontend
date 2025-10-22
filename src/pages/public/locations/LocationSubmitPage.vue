<script setup lang="ts">
import Button from 'primevue/button';
import Checkbox from 'primevue/checkbox';
import SubmissionDialog from '@/components/features/location/builder/LocationSubmissionDialog.vue';
import LocationImagesBuilder from '@/components/features/location/builder/builders/LocationImagesBuilder.vue';
import LocationInformationBuilder from '@/components/features/location/builder/builders/LocationInformationBuilder.vue';
import LocationSettingsBuilder from '@/components/features/location/builder/builders/LocationSettingsBuilder.vue';
import { faArrowLeft, faArrowRight, faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocalStorage } from '@/composables/useLocalStorage';
import { DEFAULT_LOCATION_REQUEST, type LocationRequest } from '@/domain/location';
import type { BuilderStep, BuilderSubstep } from '@/components/features/location/builder';
import type { ImageRequest } from '@/domain/image';

const { t } = useI18n();

const imagesForm = ref<ImageRequest[]>([]);

const locationForm = useLocalStorage<LocationRequest>('location-form', {
    defaults: DEFAULT_LOCATION_REQUEST,
});

const showSubmissionDialog = ref(false);
const step = ref<BuilderStep>('basics');
const substeps = ref<BuilderSubstep[]>([]);

const steps: { id: BuilderStep; label: string; desc: string }[] = [
    {
        id: 'basics',
        label: t('pages.locations.submit.steps.basics.label'),
        desc: t('pages.locations.submit.steps.basics.desc'),
    },
    {
        id: 'images',
        label: t('pages.locations.submit.steps.images.label'),
        desc: t('pages.locations.submit.steps.images.desc'),
    },
    {
        id: 'settings',
        label: t('pages.locations.submit.steps.settings.label'),
        desc: t('pages.locations.submit.steps.settings.desc'),
    },
];

const stepIndex = computed<number>(() => steps.findIndex((curr) => curr.id === step.value));
const progress = computed<number>(() => Math.round(((stepIndex.value + 1) * 100) / steps.length));

const canGoNext = computed<boolean>(() => substeps.value.every((substep) => substep.isCompleted));
const canGoPrevious = computed<boolean>(() => stepIndex.value > 0);
const isLastStep = computed<boolean>(() => step.value === 'settings');
const isCreating = computed<boolean>(() => showSubmissionDialog.value);

/**
 * Go to the next step in the wizard
 * @return void
 */
function goNext(): void {
    if (canGoNext.value && stepIndex.value < steps.length - 1) {
        const nextStep = steps[stepIndex.value + 1].id;
        step.value = nextStep;
    }
}

/**
 * Go to the previous step in the wizard
 * @return void
 */
function goPrevious(): void {
    if (stepIndex.value > 0) {
        const prevStep = steps[stepIndex.value - 1].id;
        step.value = prevStep;
    }
}

/**
 * Submit the location form, images and openings to the API
 * @return Promise<void>
 */
async function submitLocation(): Promise<void> {
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
                    :disabled="!canGoNext || isCreating"
                    size="small"
                    @click="isLastStep ? submitLocation() : goNext()">
                    <template v-if="isLastStep">
                        <FontAwesomeIcon v-if="!isCreating" :icon="faCheck" class="mr-2" />
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
            <LocationInformationBuilder
                v-if="step === 'basics'"
                v-model="locationForm"
                v-model:substeps="substeps">
            </LocationInformationBuilder>

            <LocationImagesBuilder
                v-if="step === 'images'"
                v-model="imagesForm"
                v-model:substeps="substeps">
            </LocationImagesBuilder>

            <LocationSettingsBuilder
                v-if="step === 'settings'"
                v-model:form="locationForm"
                v-model:substeps="substeps">
            </LocationSettingsBuilder>
        </div>
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
                :disabled="!canGoNext || isCreating"
                rounded
                size="small"
                @click="isLastStep ? submitLocation() : goNext()">
                <FontAwesomeIcon v-if="isLastStep && !isCreating" :icon="faCheck" />
                <FontAwesomeIcon v-else-if="isCreating" :icon="faSpinner" spin />
                <FontAwesomeIcon v-else :icon="faArrowRight" />
            </Button>
        </div>
    </Teleport>
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
