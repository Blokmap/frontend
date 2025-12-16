<script lang="ts" setup>
import SlideCarousel from '@/components/shared/molecules/image/SlideCarousel.vue';
import { useI18n } from 'vue-i18n';
import type { Location } from '@/domain/location';

defineProps<{
    location: Location;
}>();

const { locale } = useI18n();
</script>

<template>
    <div class="flex items-center gap-3">
        <SlideCarousel
            class="carousel"
            :items="location.images ?? []"
            :show-navigation-buttons="false"
            @click.stop>
            <template #default="{ item }">
                <img :src="item.url" alt="Location Image" class="carousel__image" />
            </template>
        </SlideCarousel>
        <div class="space-y-2">
            <p class="font-bold">{{ location.name }}</p>
            <p class="truncate text-sm text-slate-500">
                {{ location.excerpt[locale] }}
            </p>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.carousel {
    @apply w-30;

    .carousel__image {
        @apply rounded-lg;
    }
}
</style>
