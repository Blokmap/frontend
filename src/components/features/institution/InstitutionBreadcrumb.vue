<script lang="ts" setup>
import Skeleton from 'primevue/skeleton';
import { faChevronRight, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import type { Authority } from '@/domain/authority';
import type { Institution } from '@/domain/institution';

defineProps<{
    institution?: Institution | null;
    authority?: Authority | null;
    loading?: boolean;
}>();

const { locale } = useI18n();
</script>

<template v-if="institution || loading">
    <div class="hierarchy">
        <div class="hierarchy__breadcrumb">
            <template v-if="loading">
                <Skeleton width="1rem" height="1rem" />
                <Skeleton width="0.75rem" height="0.75rem" />
                <Skeleton width="6rem" height="1rem" />
                <template v-if="authority">
                    <Skeleton width="0.75rem" height="0.75rem" />
                    <Skeleton width="5rem" height="1rem" />
                </template>
            </template>
            <template v-else>
                <RouterLink
                    :to="{ name: 'manage.locations' }"
                    class="hierarchy__dashboard hierarchy__link">
                    <FontAwesomeIcon :icon="faHome" />
                </RouterLink>
                <template v-if="institution">
                    <FontAwesomeIcon class="hierarchy__separator" :icon="faChevronRight" />
                    <RouterLink
                        :to="{
                            name: 'manage.institution.info',
                            params: { institutionId: institution.id },
                        }"
                        class="hierarchy__institution hierarchy__link">
                        {{ institution.name[locale] }}
                    </RouterLink>
                </template>
                <template v-if="authority">
                    <FontAwesomeIcon class="hierarchy__separator" :icon="faChevronRight" />
                    <RouterLink
                        :to="{
                            name: 'manage.authority.info',
                            params: { authorityId: authority.id },
                        }"
                        class="hierarchy__authority hierarchy__link">
                        {{ authority.name }}
                    </RouterLink>
                </template>
            </template>
        </div>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.hierarchy {
    @apply flex items-center gap-2.5;
    @apply text-sm transition-all duration-200;

    .hierarchy__breadcrumb {
        @apply flex flex-1 items-center gap-2 overflow-hidden;
    }

    .hierarchy__separator {
        @apply flex-shrink-0 text-sm text-slate-400;
    }

    .hierarchy__dashboard {
        @apply flex-shrink-0 text-slate-600;
    }

    .hierarchy__institution {
        @apply truncate font-bold text-slate-700;
    }

    .hierarchy__authority {
        @apply truncate font-medium text-slate-600;
    }

    .hierarchy__link {
        @apply transition-colors duration-150 hover:text-slate-800 hover:underline;
    }
}
</style>
