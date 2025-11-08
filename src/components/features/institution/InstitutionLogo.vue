<script lang="ts" setup>
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, watchEffect } from 'vue';

const props = defineProps<{
    slug: string;
}>();

const logoUrl = ref<string | null>(null);
const logoError = ref(false);

// Dynamically import the logo based on the slug
watchEffect(async () => {
    if (!props.slug) {
        logoError.value = true;
        return;
    }

    try {
        const logo = await import(`@/assets/img/logos/institutions/${props.slug}.svg`);
        logoUrl.value = logo.default;
        logoError.value = false;
    } catch {
        logoError.value = true;
        logoUrl.value = null;
    }
});
</script>

<template>
    <div class="institution-logo">
        <img
            v-if="!logoError && logoUrl"
            :src="logoUrl"
            :alt="`${slug} logo`"
            class="h-full w-full object-contain" />
        <FontAwesomeIcon v-else :icon="faBuilding" class="placeholder-icon" />
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.institution-logo {
    @apply flex items-center justify-center overflow-hidden;
    @apply h-full w-full;

    .placeholder-icon {
        @apply text-slate-400;
        width: clamp(1rem, 40%, 4rem);
        height: clamp(1rem, 40%, 4rem);
        font-size: clamp(1rem, 40%, 4rem);
    }
}
</style>
