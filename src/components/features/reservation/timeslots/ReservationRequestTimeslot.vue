<script setup lang="ts">
import Button from 'primevue/button';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { timeToString } from '@/utils/time';
import type { ReservationRequest } from '@/domain/reservation';
import type { Time } from '@/utils/time';

defineProps<{
    startTime: Time;
    endTime: Time;
    request: ReservationRequest;
    isSaving?: boolean;
}>();

defineEmits<{
    delete: [request: ReservationRequest];
}>();
</script>

<template>
    <div class="reservation-request-card">
        <Button
            rounded
            class="delete-btn"
            size="small"
            severity="contrast"
            :disabled="isSaving"
            @click.stop="$emit('delete', request)"
            text>
            <template #icon>
                <FontAwesomeIcon :icon="faTrash" class="h-3 w-3" />
            </template>
        </Button>
        <div class="time-display">
            <span class="time-text">
                {{ timeToString(startTime) }}-{{ timeToString(endTime) }}
            </span>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.reservation-request-card {
    @apply bg-secondary-100 relative h-full p-2;
    @apply border-secondary-400 border-l-3 border-dashed;
    @apply flex items-center justify-center;
    @apply transition-all duration-150;
    @apply pointer-events-auto;

    .time-display {
        @apply text-secondary-700;
        @apply flex items-center justify-center;
    }

    .delete-btn {
        @apply !absolute top-1 right-1 z-10;
        @apply text-secondary-500;
        @apply opacity-0 hover:opacity-100;
        @apply transition-opacity duration-150;
    }

    &:hover .delete-btn {
        @apply opacity-100;
    }
}

.time-display {
    @apply hidden items-center justify-center text-center md:flex;

    .time-text {
        @apply text-xs font-medium;
    }
}
</style>
