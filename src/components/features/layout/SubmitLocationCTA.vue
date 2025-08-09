<script setup lang="ts">
import { faMapMarkerAlt, faPlus, faUsers } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Button from 'primevue/button';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const props = withDefaults(
    defineProps<{
        variant?: 'default' | 'light';
    }>(),
    {
        variant: 'light',
    },
);

const router = useRouter();

const isLight = computed(() => props.variant === 'light');

function handleSubmitLocation() {
    // TODO: Navigate to submit location page when implemented
    console.log('Navigate to submit location');
}
</script>

<template>
    <section
        class="relative overflow-hidden rounded-2xl px-8 py-12"
        :class="isLight ? 'cta-light' : 'cta-default'">
        <!-- Background Pattern -->
        <div class="absolute inset-0" :class="isLight ? 'opacity-20' : 'opacity-10'">
            <div
                class="absolute -top-4 -right-4 h-32 w-32 rounded-full"
                :class="isLight ? 'bg-primary-300' : 'bg-white'"></div>
            <div
                class="absolute -bottom-8 -left-8 h-24 w-24 rounded-full"
                :class="isLight ? 'bg-secondary-300' : 'bg-white'"></div>
            <div
                class="absolute top-1/2 right-1/5 h-16 w-16 rounded-full"
                :class="isLight ? 'bg-primary-400' : 'bg-white'"></div>
        </div>

        <!-- Content -->
        <div class="relative z-10 mx-auto max-w-4xl text-center">
            <!-- Icon -->
            <div class="flex justify-center">
                <div
                    class="cta-main-icon"
                    :class="isLight ? 'cta-main-icon-light' : 'cta-main-icon-default'">
                    <FontAwesomeIcon :icon="faMapMarkerAlt" class="text-2xl" />
                </div>
            </div>

            <!-- Heading -->
            <h2
                class="my-6 text-3xl font-bold md:text-4xl"
                :class="isLight ? 'text-gray-900' : 'text-white'">
                Ken jij de perfecte
                <span :class="isLight ? 'cta-highlight-light' : 'cta-highlight'">blokspot</span>?
            </h2>

            <!-- Description -->
            <p class="mb-8 text-lg md:text-xl" :class="isLight ? 'text-gray-700' : 'text-white/90'">
                Help andere mensen door jouw favoriete locatie toe te voegen aan Blokmap.
                <br />
                Van bibliotheken tot coworkingspaces - elke bijdrage maakt het verschil!
            </p>

            <!-- Features -->
            <div class="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                <div class="cta-feature">
                    <div
                        class="cta-feature-icon"
                        :class="isLight ? 'cta-feature-icon-light' : 'cta-feature-icon-default'">
                        <FontAwesomeIcon :icon="faPlus" class="text-lg" />
                    </div>
                    <h3
                        class="mb-2 font-semibold"
                        :class="isLight ? 'text-gray-900' : 'text-white'">
                        Eenvoudig Toevoegen
                    </h3>
                    <p class="text-sm" :class="isLight ? 'text-gray-600' : 'text-white/80'">
                        Voeg in enkele stappen jouw locatie toe
                    </p>
                </div>

                <div class="cta-feature">
                    <div
                        class="cta-feature-icon"
                        :class="isLight ? 'cta-feature-icon-light' : 'cta-feature-icon-default'">
                        <FontAwesomeIcon :icon="faUsers" class="text-lg" />
                    </div>
                    <h3
                        class="mb-2 font-semibold"
                        :class="isLight ? 'text-gray-900' : 'text-white'">
                        Deel met Anderen
                    </h3>
                    <p class="text-sm" :class="isLight ? 'text-gray-600' : 'text-white/80'">
                        Help anderen jouw favoriete plekken te ontdekken
                    </p>
                </div>

                <div class="cta-feature">
                    <div
                        class="cta-feature-icon"
                        :class="isLight ? 'cta-feature-icon-light' : 'cta-feature-icon-default'">
                        <FontAwesomeIcon :icon="faMapMarkerAlt" class="text-lg" />
                    </div>
                    <h3
                        class="mb-2 font-semibold"
                        :class="isLight ? 'text-gray-900' : 'text-white'">
                        Vergroot de Kaart
                    </h3>
                    <p class="text-sm" :class="isLight ? 'text-gray-600' : 'text-white/80'">
                        Maak Blokmap nog completer
                    </p>
                </div>
            </div>

            <!-- CTA Button -->
            <Button
                @click="handleSubmitLocation"
                :class="isLight ? 'cta-button-light' : 'cta-button'">
                <FontAwesomeIcon :icon="faPlus" class="mr-2" />
                Locatie Toevoegen
            </Button>
        </div>
    </section>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

/* Background variants */
.cta-default {
    @apply from-primary-500 to-secondary-500 bg-gradient-to-br text-white;
}

.cta-light {
    @apply border-2 border-gray-200 bg-gradient-to-br from-slate-50 to-slate-100;
}

/* Main icon variants */
.cta-main-icon {
    @apply flex h-16 w-16 items-center justify-center rounded-full backdrop-blur-sm;
}

.cta-main-icon-default {
    @apply bg-white/20;
}

.cta-main-icon-light {
    @apply bg-primary-100 text-primary-600;
}

/* Highlight text variants */
.cta-highlight {
    @apply bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent;
    @apply font-extrabold;
}

.cta-highlight-light {
    @apply bg-gradient-conic bg-clip-text text-transparent;
    @apply font-extrabold;
}

/* Feature styles */
.cta-feature {
    @apply flex flex-col items-center;
}

.cta-feature-icon {
    @apply mb-3 flex h-12 w-12 items-center justify-center rounded-full;
}

.cta-feature-icon-default {
    @apply bg-white/20;
}

.cta-feature-icon-light {
    @apply bg-primary-100 text-primary-600;
}

/* Button variants */
.cta-button {
    @apply text-primary-600 bg-white font-semibold shadow-xl;
    @apply rounded-xl px-8 py-4 text-lg;
    @apply border-2 border-transparent hover:border-white/20;
}

.cta-button-light {
    @apply bg-primary-600 font-semibold text-white shadow-lg;
    @apply rounded-xl px-8 py-4 text-lg;
}
</style>
