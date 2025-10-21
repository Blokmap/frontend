<script lang="ts" setup>
import { useI18n } from 'vue-i18n';
import { ReservationState } from '@/domain/reservation';

defineProps<{
    state: ReservationState;
}>();

const { t } = useI18n();
</script>

<template>
    <div class="flex items-center gap-2">
        <!-- Present State -->
        <template v-if="state === ReservationState.Present">
            <div class="status-dot bg-primary-500" />
            <span class="status-text text-primary-500">
                {{ t('app.status.present') }}
            </span>
        </template>

        <!-- Absent State -->
        <template v-if="state === ReservationState.Absent">
            <div class="status-dot bg-red-500" />
            <span class="status-text text-red-500">
                {{ t('app.status.absent') }}
            </span>
        </template>

        <!-- Cancelled State -->
        <template v-if="state === ReservationState.Cancelled">
            <div class="status-dot bg-gray-500" />
            <span class="status-text text-gray-500">
                {{ t('app.status.cancelled') }}
            </span>
        </template>

        <!-- Created State-->
        <template v-if="state === ReservationState.Created">
            <div class="status-dot bg-secondary-500" />
            <span class="status-text text-secondary-500">
                {{ t('app.status.created') }}
            </span>
        </template>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.status-dot {
    @apply h-2 w-2 shrink-0 rounded-full;
}

.status-text {
    @apply text-xs font-medium;
}
</style>
