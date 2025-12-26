<script setup lang="ts">
import ErrorPage from '@/components/organisms/ErrorPage.vue';
</script>

<template>
    <ErrorPage
        code="405"
        title="Geen toegang"
        description="Je hebt geen toegang tot deze pagina. Mogelijk heb je niet de juiste rechten of ben je geen lid van deze resource.">
    </ErrorPage>
</template>
