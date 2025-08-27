<script setup lang="ts">
import { DOCS_URL } from '../../../constants';
import Logo from '@/components/shared/Logo.vue';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>

<template>
    <div class="footer-content">
        <div class="footer-section">
            <div class="w-fit">
                <Logo />
            </div>
            <p class="footer-description">
                Ontdek en reserveer de perfecte studeerplekken in België. Van stille bibliotheken
                tot gezellige cafés.
            </p>
            <div class="footer-social">
                <a href="#" aria-label="Facebook" class="footer-social-link">
                    <FontAwesomeIcon :icon="faFacebook" class="h-3 w-3" />
                </a>
                <a href="#" aria-label="Twitter" class="footer-social-link">
                    <FontAwesomeIcon :icon="faTwitter" class="h-3 w-3" />
                </a>
                <a href="#" aria-label="Instagram" class="footer-social-link">
                    <FontAwesomeIcon :icon="faInstagram" class="h-3 w-3" />
                </a>
            </div>
        </div>

        <div class="footer-section">
            <h4 class="footer-title">Ontdek Blokmap</h4>
            <ul class="space-y-1">
                <li>
                    <RouterLink :to="{ name: 'locations' }" class="footer-link">
                        Locaties zoeken
                    </RouterLink>
                </li>
                <li>
                    <RouterLink :to="{ name: 'locations.submit' }" class="footer-link">
                        Locatie registreren
                    </RouterLink>
                </li>
                <li>
                    <a :href="DOCS_URL" target="_blank" rel="noopener" class="footer-link">
                        Hoe het werkt
                    </a>
                </li>
            </ul>
        </div>

        <div class="footer-section">
            <h4 class="footer-title">In samenwerking met</h4>

            <div class="flex flex-wrap items-center gap-4">
                <a
                    href="https://stad.gent"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="footer-partner-link">
                    <img src="@/assets/img/partners/stadgent.svg" alt="Stad Gent" />
                </a>
                <a
                    href="https://www.gentsestudentenraad.be"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="footer-partner-link">
                    <img src="@/assets/img/partners/gsr.svg" alt="GSR" />
                </a>
                <a
                    href="https://www.ugent.be"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="footer-partner-link ugent">
                    <img src="@/assets/img/partners/ugent.svg" alt="Universiteit Gent" />
                </a>
            </div>
        </div>
    </div>

    <div class="footer-bottom">
        <div class="footer-bottom-content">
            <div class="text-surface-500 text-xs">
                © {{ new Date().getFullYear() }} Blokmap. Alle rechten voorbehouden.
            </div>
            <div class="flex space-x-4 text-xs">
                <a
                    href="#"
                    class="text-surface-500 hover:text-primary-600 transition-colors duration-200">
                    Privacybeleid
                </a>
                <a
                    href="#"
                    class="text-surface-500 hover:text-primary-600 transition-colors duration-200">
                    Algemene Voorwaarden
                </a>
            </div>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.footer-content {
    @apply mx-auto flex justify-between gap-24 py-6;

    .footer-section {
        @apply w-fit space-y-3;

        &:not(:first-child) {
            @apply pt-3;
        }

        .footer-title {
            @apply text-sm font-semibold tracking-wider uppercase;
            @apply text-primary-600;
        }

        .footer-description {
            @apply max-w-sm text-sm leading-relaxed;
            @apply text-surface-600;
        }

        .footer-link {
            @apply text-surface-600 block text-sm;
            @apply transition-colors duration-200;

            &:hover {
                @apply text-primary-600;
            }
        }
    }

    .footer-social {
        @apply flex space-x-2;

        .footer-social-link {
            @apply flex h-8 w-8 items-center justify-center rounded-full;
            @apply bg-primary-100 text-primary-600;
        }
    }

    .footer-partner-link {
        @apply block w-fit transform grayscale-20 transition-all duration-200;
        @apply hover:scale-105 hover:grayscale-0;

        img {
            @apply h-9 transition-all duration-200;
        }

        &.ugent img {
            @apply h-10;
        }
    }
}

.footer-bottom {
    @apply border-t-2 border-slate-200 py-6;

    .footer-bottom-content {
        @apply mx-auto flex flex-col items-center justify-between rounded-b-lg;
        @apply md:flex-row md:text-left;
    }
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
    .footer .footer-section:first-child {
        @apply text-center;

        .w-fit {
            @apply mx-auto;
        }

        .footer-description {
            @apply mx-auto;
        }

        .footer-social {
            @apply justify-center;
        }
    }
}
</style>
