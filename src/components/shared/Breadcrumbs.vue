<script lang="ts" setup>
import { storeToRefs } from 'pinia';
import { useBreadcrumbStore } from '@/composables/store/useBreadcrumbs';

const { breadcrumbs } = storeToRefs(useBreadcrumbStore());
</script>

<template>
    <nav class="breadcrumbs">
        <ul>
            <li v-for="(breadcrumb, index) in breadcrumbs" :key="index">
                <RouterLink :to="breadcrumb.to ?? {}">
                    {{ breadcrumb.label }}
                </RouterLink>
            </li>
        </ul>
    </nav>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.breadcrumbs {
    ul {
        @apply flex items-center gap-2 text-sm;

        li {
            &:not(:last-child)::after {
                @apply ml-2 text-gray-400 content-['/'];
            }

            a {
                @apply hover:text-primary-600 text-gray-600;
            }
        }

        li:last-child a {
            @apply font-medium text-gray-900;
        }
    }
}
</style>
