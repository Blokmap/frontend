<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="prose prose-slate mx-auto max-w-4xl px-4 py-8">
        <h1>De pagina werd niet gevonden...</h1>
        <p>We helpen je graag weer op weg:</p>
        <ul>
            <li>
                <RouterLink :to="{ name: 'locations' }">Bekijk alle locaties</RouterLink>
            </li>
            <li>
                <RouterLink :to="{ name: 'locations.submit' }">Dien een locatie in</RouterLink>
            </li>
        </ul>
    </div>
</template>
