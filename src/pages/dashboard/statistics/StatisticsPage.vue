<script setup lang="ts">
import DashboardLoading from '@/layouts/dashboard/DashboardLoading.vue';

// TODO: Add statistics loading logic
const isLoading = false;
</script>

<template>
    <!-- Loading State -->
    <DashboardLoading v-if="isLoading" />

    <!-- Content -->
    <div v-else class="container mx-auto py-8">
        <div class="mb-8">
            <h1 class="mb-4 text-3xl font-bold text-gray-900">Statistieken</h1>
            <p class="text-gray-600">Overzicht van platform statistieken en analyses.</p>
        </div>

        <div class="rounded-lg bg-white p-6 shadow">
            <p class="text-gray-500">
                Deze pagina toont verschillende statistieken over het platform, zoals:
            </p>
            <ul class="mt-4 space-y-2 text-gray-600">
                <li>• Totaal aantal gebruikers</li>
                <li>• Aantal locaties</li>
                <li>• Reservatiesstatistieken</li>
                <li>• Gebruiksanalyses</li>
            </ul>
        </div>
    </div>
</template>
