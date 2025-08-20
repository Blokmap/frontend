<script setup lang="ts">
import Logo from '@/components/shared/Logo.vue';
import { DOCS_URL } from '@/constants';
import { faFacebook, faInstagram, faTwitter } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
</script>

<template>
    <footer class="footer">
        <div class="footer-content">
            <div class="footer-section">
                <div class="w-fit">
                    <Logo />
                </div>
                <p class="footer-description">
                    Ontdek en reserveer de perfecte studeerplekken in België. Van stille
                    bibliotheken tot gezellige cafés.
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
                <h4 class="footer-title">Platform</h4>
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
                <h4 class="footer-title">Informatie</h4>
                <ul class="space-y-1">
                    <li><a href="#" class="footer-link">Privacybeleid</a></li>
                    <li><a href="#" class="footer-link">Algemene Voorwaarden</a></li>
                </ul>
            </div>
        </div>

        <div class="footer-bottom">
            <div class="footer-bottom-content">
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
    @apply border-surface-200 mt-8 rounded-b-md border-t-2 bg-white;

    .footer-content {
        @apply mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 py-8;
        @apply md:grid-cols-1 lg:grid-cols-3;

        .footer-section {
            @apply space-y-3;

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
    }

    .footer-social {
        @apply flex space-x-2 pt-2;

        .footer-social-link {
            @apply flex h-8 w-8 items-center justify-center rounded-full;
            @apply bg-surface-100 border-surface-200 text-surface-600 border;
            @apply transition-all duration-200;

            &:hover {
                @apply bg-primary-500 border-primary-500 text-white;
            }
        }
    }

    .footer-bottom {
        @apply border-surface-200 bg-surface-50 rounded-b-lg border-t;

        .footer-bottom-content {
            @apply mx-auto flex max-w-7xl flex-col items-center justify-between rounded-b-lg;
            @apply px-6 py-3 text-center;
            @apply md:flex-row md:text-left;
        }
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
