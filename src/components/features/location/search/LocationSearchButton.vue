<script setup lang="ts">
import ImageStack from '@/components/shared/molecules/ImageStack.vue';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useReadRecentProfileLocations } from '@/composables/data/useLocations';
import { getLocationImages, type Image } from '@/domain/image';

defineEmits<{
    (e: 'click:search'): void;
}>();

const { data: profile } = useAuthProfile();

const { data: recentLocations } = useReadRecentProfileLocations(
    computed(() => profile.value?.id ?? null),
    computed(() => ({ maxCount: 3 })),
);

const recentLocationImages = computed<Image[] | undefined>(() =>
    getLocationImages(recentLocations.value),
);
</script>

<template>
    <button @click="$emit('click:search')" class="location-search">
        <ImageStack
            v-if="recentLocationImages"
            class="location-search__images"
            :images="recentLocationImages" />
        <div class="location-search__content">
            <span class="location-search__text">Zoek bloklocaties...</span>
            <div class="location-search__icon-wrapper">
                <FontAwesomeIcon :icon="faMagnifyingGlass" class="location-search__icon" />
            </div>
        </div>
    </button>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.location-search {
    @apply relative w-full py-1 pr-2 pl-4 md:min-w-[320px];
    @apply flex items-center gap-3;
    @apply cursor-pointer rounded-full bg-white;
    @apply shadow-lg hover:shadow-xl;
    @apply transition-all duration-200 ease-out;
}

.location-search__content {
    @apply flex min-w-0 flex-1 items-center gap-3;
}

.location-search__icon-wrapper {
    @apply flex items-center justify-center rounded-full;
    @apply bg-secondary h-7 w-7 flex-shrink-0;
    @apply transition-colors duration-150;

    .location-search:hover & {
        @apply bg-secondary-600;
    }
}

.location-search__icon {
    @apply h-3.5 w-3.5 text-white;
}

.location-search__text {
    @apply flex-1 text-sm font-medium text-slate-800;
}

.location-search__images {
    @apply h-9 w-9 flex-shrink-0;
}

.location-search__filter {
    @apply flex h-7 w-7 items-center justify-center rounded-full;
    @apply bg-slate-100 transition-colors duration-150;

    .location-search:hover & {
        @apply bg-slate-200;
    }
}

.location-search__filter-icon {
    @apply h-3.5 w-3.5 text-slate-600;
}
</style>
