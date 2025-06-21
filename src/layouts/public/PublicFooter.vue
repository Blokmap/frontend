<template>
    <footer
        class="dark:bg-surface-900 dark:border-surface-800 border-t border-slate-200 bg-white text-slate-700 dark:text-slate-300">
        <div class="mx-auto grid grid-cols-1 gap-8 px-6 py-12 text-sm md:w-7/8 md:grid-cols-4">
            <!-- Brand -->
            <div>
                <h2 class="text-xl font-bold text-slate-900 dark:text-white">Blokmap</h2>
                <p class="mt-2 text-slate-600 dark:text-slate-400">
                    Ontdek de beste blokplekken in België. Rustig, bereikbaar en blok-klaar.
                </p>
            </div>

            <!-- Navigation -->
            <div>
                <h3 class="mb-2 font-semibold text-slate-800 dark:text-slate-200">Navigatie</h3>
                <ul class="space-y-1">
                    <li><a href="#" class="hover:underline">Home</a></li>
                    <li><a href="#" class="hover:underline">Kaart</a></li>
                    <li><a href="#" class="hover:underline">Over ons</a></li>
                    <li><a href="#" class="hover:underline">Contact</a></li>
                </ul>
            </div>

            <!-- Contact -->
            <div>
                <h3 class="mb-2 font-semibold text-slate-800 dark:text-slate-200">Contact</h3>
                <ul class="space-y-1">
                    <li>
                        Email:
                        <a href="mailto:info@blokmap.be" class="hover:underline">info@blokmap.be</a>
                    </li>
                    <li>Locatie: België</li>
                </ul>
            </div>

            <!-- Social -->
            <div>
                <h3 class="mb-2 font-semibold text-slate-800 dark:text-slate-200">Volg ons</h3>
                <div class="flex space-x-4">
                    <a href="#" aria-label="Instagram" class="hover:text-pink-500">
                        <i class="fab fa-instagram text-xl"></i>
                    </a>
                    <a href="#" aria-label="Facebook" class="hover:text-blue-600">
                        <i class="fab fa-facebook text-xl"></i>
                    </a>
                    <a
                        href="#"
                        aria-label="X / Twitter"
                        class="hover:text-black dark:hover:text-white">
                        <i class="fab fa-twitter text-xl"></i>
                    </a>
                </div>
            </div>
        </div>

        <div
            class="mt-4 border-t border-slate-200 py-4 text-center text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            © {{ new Date().getFullYear() }} Blokmap. Alle rechten voorbehouden.
        </div>
    </footer>
</template>

<script setup></script>
