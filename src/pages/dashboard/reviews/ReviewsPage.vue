<script setup lang="ts">
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';

// TODO: Add reviews loading logic
const isLoading = false;
</script>

<template>
    <!-- Loading State -->
    <DashboardLoading v-if="isLoading" />

    <!-- Content -->
    <div v-else class="container mx-auto py-8">
        <div class="mb-8">
            <h1 class="mb-4 text-3xl font-bold text-gray-900">Reviews</h1>
            <p class="text-gray-600">Beheer en moderatie van gebruikersbeoordelingen.</p>
        </div>

        <div class="rounded-lg bg-white p-6 shadow">
            <p class="text-gray-500">
                Deze pagina toont het reviewbeheer, met functionaliteit voor:
            </p>
            <ul class="mt-4 space-y-2 text-gray-600">
                <li>• Overzicht van alle reviews</li>
                <li>• Reviews modereren en goedkeuren</li>
                <li>• Rapporteerde reviews behandelen</li>
                <li>• Reviewstatistieken bekijken</li>
            </ul>
        </div>
    </div>
</template>
