<script lang="ts" setup>
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import InstitutionLogo from './InstitutionLogo.vue';
import type { InstitutionAuthorityMemberships } from '@/domain/member';

const props = defineProps<{
    membership: InstitutionAuthorityMemberships;
    disabled?: boolean;
    selected?: boolean;
}>();

const { locale } = useI18n();

const isAuthorityAccess = computed(() => {
    return !props.membership.role && props.membership.authorities.length > 0;
});

const isInstitutionAccess = computed(() => {
    return !!props.membership.role;
});

const tooltip = computed(() => {
    const authorities = props.membership.authorities;

    if (authorities.length > 3) {
        const string = authorities
            .slice(3)
            .map((a) => a.authority.name)
            .join(', ');

        return string;
    }

    return '';
});
</script>

<template>
    <div
        class="selector-item"
        :class="{
            'selector-item--disabled': disabled,
            'selector-item--selected': selected,
        }">
        <InstitutionLogo class="selector-item__logo" :slug="membership.institution.slug" />
        <div class="selector-item__info">
            <p class="selector-item__title">
                {{ membership.institution.name[locale] }}
            </p>
            <div v-if="isAuthorityAccess" class="selector-item__authorities">
                <span>Lid in </span>
                <span>
                    <template v-for="(authority, idx) in membership.authorities.slice(0, 3)">
                        <b>{{ authority.authority.name }}</b>
                        <span v-if="idx < Math.min(2, membership.authorities.length - 1)">, </span>
                    </template>
                    <span
                        v-if="membership.authorities.length > 3"
                        v-tooltip="tooltip"
                        class="selector-item__more">
                        +{{ membership.authorities.length - 3 }}
                    </span>
                </span>
            </div>
            <div v-else class="selector-item__role">
                <span v-if="isInstitutionAccess && membership.role">
                    Beheren als <b>{{ membership.role.name.toLowerCase() }}</b>
                </span>
                <span v-else> <b>Geen rol</b> in deze organisatie </span>
            </div>
        </div>

        <FontAwesomeIcon class="selector-item__icon" :icon="faChevronRight" />
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.selector-item {
    @apply flex cursor-pointer items-center gap-4 rounded-lg p-3 hover:bg-slate-50;

    .selector-item__logo {
        @apply h-12 w-12 flex-shrink-0 object-scale-down;
    }

    .selector-item__info {
        @apply flex-1 space-y-1;
    }

    .selector-item__title {
        @apply font-semibold;
    }

    .selector-item__authorities,
    .selector-item__role {
        @apply text-xs text-slate-500;
    }

    .selector-item__more {
        @apply text-primary-500 ml-1;
    }

    .selector-item__icon {
        @apply ml-auto text-slate-400;
    }

    &.selector-item--disabled {
        @apply pointer-events-none cursor-not-allowed opacity-50;
    }

    &.selector-item--selected:not(.selector-item--disabled) {
        @apply bg-slate-50;
    }
}
</style>
