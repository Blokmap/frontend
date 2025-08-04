<script lang="ts" setup>
import { useAuthProfile } from '@/composables/data/useAuth';
import { useProfileReservations } from '@/composables/data/useReservations';
import { endOfWeek, startOfWeek } from '@/utils/date';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const profile = useAuthProfile();
const reservations = useProfileReservations(profile.profileId);

const dateInWeek = computed(() => {
    const dateParam = route.params.dateInWeek?.toString();
    return dateParam ? new Date(dateParam) : new Date();
});

const weekStart = computed(() => startOfWeek(dateInWeek.value));
const weekEnd = computed(() => endOfWeek(dateInWeek.value));
</script>

<template>
    <div v-if="reservations.data.value">
        <h2>Reservations for week of {{ weekStart }} - {{ weekEnd }}</h2>
        {{ reservations.data.value[0] }}
    </div>
</template>
