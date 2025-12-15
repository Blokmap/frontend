import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useLocalStorage } from '@/composables/useLocalStorage';
import { DEFAULT_LOCATION_REQUEST, type LocationRequest } from '@/domain/location';
import type { ImageBody } from '@/domain/image';

export enum BuilderStep {
    Basics,
    Images,
    Settings,
}

export type BuilderSubstep = {
    label: string;
    isCompleted: boolean;
};

/**
 * Composable for managing location builder state and navigation
 */
export function useLocationBuilder() {
    const { t } = useI18n();

    const locationForm = useLocalStorage<LocationRequest>('location-form', {
        defaults: DEFAULT_LOCATION_REQUEST,
    });

    const imagesForm = ref<ImageBody[]>([]);
    const step = ref<BuilderStep>(BuilderStep.Basics);

    const steps = [
        {
            id: BuilderStep.Basics,
            label: t('pages.locations.submit.steps.basics.label'),
            desc: t('pages.locations.submit.steps.basics.desc'),
        },
        {
            id: BuilderStep.Images,
            label: t('pages.locations.submit.steps.images.label'),
            desc: t('pages.locations.submit.steps.images.desc'),
        },
        {
            id: BuilderStep.Settings,
            label: t('pages.locations.submit.steps.settings.label'),
            desc: t('pages.locations.submit.steps.settings.desc'),
        },
    ];

    const stepIndex = computed(() => steps.findIndex((s) => s.id === step.value));

    const progress = computed(() => Math.round(((stepIndex.value + 1) * 100) / steps.length));

    // Compute substeps based on current step and form data
    const substeps = computed<BuilderSubstep[]>(() => {
        const form = locationForm.value;

        switch (step.value) {
            case BuilderStep.Basics:
                return [
                    {
                        label: 'Naam en beschrijving',
                        isCompleted: !!(form.name && form.excerpt.nl && form.description.nl),
                    },
                    {
                        label: 'Locatie op kaart',
                        isCompleted: !!(
                            form.street &&
                            form.zip &&
                            form.city &&
                            form.latitude &&
                            form.longitude
                        ),
                    },
                ];

            case BuilderStep.Images:
                return [
                    {
                        label: 'Afbeeldingen toevoegen',
                        isCompleted: imagesForm.value.length > 0,
                    },
                    {
                        label: 'Hoofdafbeelding instellen',
                        isCompleted: imagesForm.value.length > 0,
                    },
                ];

            case BuilderStep.Settings:
                return [
                    {
                        label: 'Zitplaatsen configureren',
                        isCompleted: form.seatCount > 0,
                    },
                    {
                        label: 'Reservatie-instellingen',
                        isCompleted: true,
                    },
                ];

            default:
                return [];
        }
    });

    const canGoNext = computed(() => substeps.value.every((s) => s.isCompleted));
    const canGoPrevious = computed(() => stepIndex.value > 0);
    const isLastStep = computed(() => step.value === BuilderStep.Settings);

    function goNext() {
        if (canGoNext.value && stepIndex.value < steps.length - 1) {
            step.value = steps[stepIndex.value + 1].id;
        }
    }

    function goPrevious() {
        if (stepIndex.value > 0) {
            step.value = steps[stepIndex.value - 1].id;
        }
    }

    function goToStep(targetStep: BuilderStep) {
        step.value = targetStep;
    }

    return {
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
        goToStep,
    };
}
