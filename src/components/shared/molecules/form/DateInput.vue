<script setup lang="ts">
import DatePicker from 'primevue/datepicker';
import InputText from 'primevue/inputtext';
import { computed, onMounted, onUnmounted, useTemplateRef } from 'vue';
import { useI18n } from 'vue-i18n';
import { useFloatingPosition } from '@/composables/useFloatingPosition';

defineProps<{
    minDate?: Date;
    maxDate?: Date;
}>();

const isVisible = defineModel<boolean>('is-visible', {
    default: false,
});

const date = defineModel<Date>('date', {
    default: new Date(),
    required: true,
});

const containerRef = useTemplateRef('container');
const overlayRef = useTemplateRef('overlay');

const { locale } = useI18n();
const { positionStyles } = useFloatingPosition(containerRef, overlayRef, isVisible);

const formattedDate = computed(() => {
    return date.value.toLocaleDateString(locale.value, {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
});

function hideOverlay(): void {
    isVisible.value = false;
}

function toggleOverlay(): void {
    isVisible.value = !isVisible.value;
}

function handleClickOutside(event: Event): void {
    const container = containerRef.value;

    if (container && !container.contains(event.target as Node)) {
        hideOverlay();
    }
}

function handleDateSelect(newDate: any): void {
    if (newDate && newDate instanceof Date) {
        date.value = newDate;
        hideOverlay();
    }
}

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
    <!-- Trigger -->
    <div ref="container">
        <slot name="toggle" :toggle="toggleOverlay" :isOpen="isVisible">
            <InputText class="w-full" @click="toggleOverlay" :model-value="formattedDate" readonly>
            </InputText>
        </slot>
    </div>

    <!-- Overlay -->
    <Teleport to="body">
        <Transition name="slide-down">
            <div v-if="isVisible" ref="overlay" :style="positionStyles" @click.stop>
                <DatePicker
                    v-model="date"
                    :locale="locale"
                    :min-date="minDate"
                    :max-date="maxDate"
                    @update:model-value="handleDateSelect"
                    inline>
                    <template #footer>
                        <slot name="footer" :close="hideOverlay"></slot>
                    </template>
                </DatePicker>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.slide-down-enter-active,
.slide-down-leave-active {
    @apply transition-all duration-200;
}

.slide-down-enter-from,
.slide-down-leave-to {
    @apply -translate-y-2 opacity-0;
}
</style>
