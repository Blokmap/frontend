<script lang="ts" setup>
import { faChevronRight, faCog, faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import type { Authority } from '@/domain/authority';
import type { Institution } from '@/domain/institution';

defineProps<{
    institution?: Institution | null;
    authority?: Authority | null;
    editable?: boolean;
}>();

const emit = defineEmits<{
    'click:edit': [];
}>();

const { locale } = useI18n();
</script>

<template v-if="institution">
    <div class="hierarchy">
        <div class="hierarchy__breadcrumb">
            <RouterLink
                :to="{ name: 'manage.locations' }"
                class="hierarchy__dashboard hierarchy__link">
                <FontAwesomeIcon :icon="faHome" />
            </RouterLink>
            <FontAwesomeIcon class="hierarchy__separator" :icon="faChevronRight" />
            <RouterLink
                :to="{
                    name: 'manage.institution.overview',
                    params: { institutionId: institution?.id },
                }"
                class="hierarchy__institution hierarchy__link">
                {{ institution?.name[locale] }}
            </RouterLink>
            <template v-if="authority">
                <FontAwesomeIcon class="hierarchy__separator" :icon="faChevronRight" />
                <RouterLink
                    :to="{
                        name: 'manage.authority.overview',
                        params: { authorityId: authority.id },
                    }"
                    class="hierarchy__authority hierarchy__link">
                    {{ authority?.name }}
                </RouterLink>
            </template>
        </div>
        <button v-if="editable" class="hierarchy__edit" @click="emit('click:edit')">
            <FontAwesomeIcon :icon="faCog" />
        </button>
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
        @apply truncate font-bold text-slate-900;
    }

    .hierarchy__authority {
        @apply truncate font-medium text-slate-600;
    }

    .hierarchy__link {
        @apply hover:text-primary-600 transition-colors duration-150 hover:underline;
    }

    .hierarchy__edit {
        @apply flex-shrink-0 text-slate-500 transition-colors hover:text-slate-700;
    }
}
</style>
