<script lang="ts" setup>
import Calendar from '@/components/shared/Calendar.vue';
import { useAuthProfile } from '@/composables/data/useAuth';
import { useProfileReservations } from '@/composables/data/useReservations';
import { computed } from 'vue';

const profile = useAuthProfile();
const profileId = computed(() => profile.data.value?.id ?? null);
const reservations = useProfileReservations(profileId);
</script>

<template>
    <Calendar> </Calendar>
</template>
