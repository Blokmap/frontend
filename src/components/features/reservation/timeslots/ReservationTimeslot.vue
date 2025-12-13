<script setup lang="ts">
import Button from 'primevue/button';
import { faSlash, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { RESERVATION_STATE_ICONS, ReservationState, type Reservation } from '@/domain/reservation';
import { timeToString } from '@/utils/time';
import type { Time } from '@/utils/time';

defineProps<{
    startTime: Time;
    endTime: Time;
    reservation: Reservation;
    pendingDeletion?: boolean;
    saving?: boolean;
}>();

defineEmits<{
    delete: [reservation: Reservation];
}>();
</script>

<template>
    <div class="reservation-card" :class="{ deleted: pendingDeletion, saving }">
        <FontAwesomeIcon
            v-if="!pendingDeletion"
            :icon="RESERVATION_STATE_ICONS[reservation.state]"
            class="state-icon"
            :spin="reservation.state === ReservationState.Pending">
        </FontAwesomeIcon>
        <Button
            rounded
            class="delete-btn"
            size="small"
            severity="contrast"
            :disabled="saving"
            @click.stop="$emit('delete', reservation)"
            text>
            <template #icon>
                <FontAwesomeIcon :icon="faTrash" class="h-3 w-3" />
            </template>
        </Button>
        <FontAwesomeIcon :icon="faSlash" class="delete-cross" v-if="pendingDeletion">
        </FontAwesomeIcon>
        <div class="time-display">
            <span class="time-text">
                {{ timeToString(startTime) }}-{{ timeToString(endTime) }}
            </span>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.reservation-card {
    @apply bg-secondary-100 relative h-full p-2;
    @apply border-secondary-500 rounded-xl border-l-3;
    @apply flex items-center justify-center;
    @apply transition-all duration-150;
    @apply pointer-events-auto;

    .time-display {
        @apply text-secondary-800;
        @apply flex items-center justify-center;
    }

    .state-icon {
        @apply !absolute top-3 left-3 z-10;
        @apply text-secondary-600 text-sm;
        @apply transition-opacity duration-150;
    }

    .delete-btn {
        @apply !absolute top-1 right-1 z-20;
        @apply text-secondary-600;
        @apply opacity-0;
        @apply transition-opacity duration-150;
    }

    .delete-cross {
        @apply absolute top-1/2 left-1/2;
        @apply -translate-x-1/2 -translate-y-1/2;
        @apply text-4xl text-red-700;
    }

    &:hover {
        .delete-btn {
            @apply opacity-100;
        }

        .state-icon {
            @apply opacity-0;
        }
    }

    &.deleted {
        @apply border-red-700 bg-red-100;

        .time-display {
            @apply text-red-700;
        }

        .delete-btn {
            @apply text-red-700;
        }
    }

    &.saving {
        @apply cursor-wait;
    }
}

.time-display {
    @apply flex items-center justify-center text-center;

    .time-text {
        @apply text-xs font-medium;
    }
}
</style>
