<script lang="ts" setup>
import { PrimeIcons } from '@primevue/core';
import { RouterLink } from 'vue-router';
</script>

<template>
    <div id="footer">
        <div class="grid justify-content-between">
            <div class="col-12 sm:col-4">
                <h2>Over Blokmap</h2>
                <p>
                    Blokmap visualiseert studieplekken in Vlaanderen op een interactieve kaart. Voor
                    en door studenten!
                </p>
                <p>
                    Powered by ❤️ and ☕ at the
                    <a class="styled" href="https://gentsestudentenraad.be">
                        Student Council of Ghent
                    </a>
                </p>
                <p>Endorsed by <a class="styled" href="https://ugent.be">Ghent University</a></p>
            </div>
            <div class="col-12 sm:col-3">
                <h2>Nuttige Links</h2>
                <div class="flex flex-column gap-3">
                    <div class="flex align-items-center gap-3">
                        <i class="text-primary" :class="PrimeIcons.MAP" />
                        <RouterLink class="styled" :to="{ name: 'home' }">
                            Zoek locaties op de kaart
                        </RouterLink>
                    </div>
                    <div class="flex align-items-center gap-3">
                        <i class="text-primary" :class="PrimeIcons.PLUS_CIRCLE" />
                        <RouterLink class="styled" to="/locations/create">
                            Registreer een bloklocatie
                        </RouterLink>
                    </div>
                    <div class="flex align-items-center gap-3">
                        <i class="text-primary" :class="PrimeIcons.EXCLAMATION_CIRCLE" />
                        <RouterLink class="styled" to="/locations/report">
                            Meld een bloklocatie
                        </RouterLink>
                    </div>
                </div>
            </div>
            <div class="col-12 sm:col-3 text-500">
                <h2>Contact</h2>
                <div class="flex flex-column gap-3">
                    <div class="flex align-items-center gap-3">
                        <i :class="PrimeIcons.ENVELOPE" />
                        <!-- Prevent spam bots from indexing this email address -->
                        <!-- Use the @ icon instead of the actual symbol -->
                        <span class="flex align-items-center">
                            blokmap <i :class="PrimeIcons.AT" /> gentsestudentenraad.be
                        </span>
                    </div>
                    <div class="flex align-items-center gap-3">
                        <i :class="PrimeIcons.GITHUB" />
                        <a class="styled" href="https://github.com/blokmap">
                            Help mee aan de ontwikkeling
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="css" scoped>
#footer {
    h2 {
        font-family: serif;
        font-size: 24px;
        margin: 0 0 2rem 0;
    }

    p:not(:last-of-type) {
        margin-bottom: 1rem;
    }
}
</style>
