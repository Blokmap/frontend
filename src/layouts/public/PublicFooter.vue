<script setup lang="ts">
import Logo from '@/components/shared/Logo.vue';
import { DOCS_URL } from '@/constants';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>

<template>
    <footer class="footer">
        <div class="footer__content">
            <div class="footer__section">
                <div class="w-fit">
                    <Logo />
                </div>
                <p class="footer__description">
                    Ontdek en reserveer de perfecte studeerplekken in België. Van stille
                    bibliotheken tot gezellige cafés.
                </p>
                <div class="footer__social">
                    <a href="#" aria-label="Facebook" class="footer__social-link">
                        <FontAwesomeIcon :icon="faFacebook" class="h-3 w-3" />
                    </a>
                    <a href="#" aria-label="Twitter" class="footer__social-link">
                        <FontAwesomeIcon :icon="faTwitter" class="h-3 w-3" />
                    </a>
                    <a href="#" aria-label="Instagram" class="footer__social-link">
                        <FontAwesomeIcon :icon="faInstagram" class="h-3 w-3" />
                    </a>
                </div>
            </div>

            <div class="footer__section">
                <h4 class="footer__title">Platform</h4>
                <ul class="space-y-1">
                    <li>
                        <RouterLink :to="{ name: 'locations' }" class="footer__link">
                            Locaties zoeken
                        </RouterLink>
                    </li>
                    <li>
                        <RouterLink :to="{ name: 'locations.submit' }" class="footer__link">
                            Locatie registreren
                        </RouterLink>
                    </li>
                    <li>
                        <a :href="DOCS_URL" target="_blank" rel="noopener" class="footer__link">
                            Hoe het werkt
                        </a>
                    </li>
                </ul>
            </div>

            <div class="footer__section">
                <h4 class="footer__title">Support</h4>
                <ul class="space-y-1">
                    <li>
                        <a :href="DOCS_URL" target="_blank" rel="noopener" class="footer__link">
                            Hulp centrum
                        </a>
                    </li>
                    <li><a href="#" class="footer__link">Veelgestelde vragen</a></li>
                    <li><a href="#" class="footer__link">Feedback</a></li>
                    <li><a href="#" class="footer__link">Contact</a></li>
                </ul>
            </div>

            <div class="footer__section">
                <h4 class="footer__title">Informatie</h4>
                <ul class="space-y-1">
                    <li><a href="#" class="footer__link">Privacybeleid</a></li>
                    <li><a href="#" class="footer__link">Gebruiksvoorwaarden</a></li>
                    <li><a href="#" class="footer__link">Cookiebeleid</a></li>
                </ul>
            </div>
        </div>

        <div class="footer__bottom">
            <div class="footer__bottom-content">
                <div class="text-surface-600 text-sm font-medium">
                    © {{ new Date().getFullYear() }} Blokmap. Alle rechten voorbehouden.
                </div>
                <div class="text-surface-500 text-xs">
                    Gemaakt met ❤️ in België • In samenwerking met UGent en Stad Gent
                </div>
            </div>
        </div>
    </footer>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.footer {
    @apply border-surface-200 mt-8 border-t-2 bg-white;

    .footer__content {
        @apply mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8;
        @apply md:grid-cols-2 lg:grid-cols-4;
    }

    .footer__section {
        @apply space-y-3;
    }

    .footer__title {
        @apply text-sm font-semibold tracking-wider uppercase;
        @apply text-primary-600;
    }

    .footer__description {
        @apply max-w-sm text-sm leading-relaxed;
        @apply text-surface-600;
    }

    .footer__link {
        @apply text-surface-600 block text-sm;
        @apply transition-colors duration-200;

        &:hover {
            @apply text-primary-600;
        }
    }

    .footer__social {
        @apply flex space-x-2 pt-2;
    }

    .footer__social-link {
        @apply flex h-8 w-8 items-center justify-center rounded-full;
        @apply bg-surface-100 border-surface-200 text-surface-600 border;
        @apply transition-all duration-200;

        &:hover {
            @apply bg-primary-500 border-primary-500 text-white;
        }
    }

    .footer__bottom {
        @apply border-surface-200 bg-surface-50 border-t;

        .footer__bottom-content {
            @apply mx-auto flex max-w-7xl flex-col items-center justify-between;
            @apply px-6 py-3 text-center;
            @apply md:flex-row md:text-left;
        }
    }
}

/* Mobile responsive adjustments */
@media (max-width: 768px) {
    .footer .footer__section:first-child {
        @apply text-center;

        .w-fit {
            @apply mx-auto;
        }

        .footer__description {
            @apply mx-auto;
        }

        .footer__social {
            @apply justify-center;
        }
    }
}
</style>
