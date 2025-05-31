<script lang="ts" setup>
import { onMounted, useTemplateRef } from 'vue';
import { PrimeIcons } from '@primevue/core';
import { useI18n } from 'vue-i18n';
import { InputGroup, InputGroupAddon, InputText } from 'primevue';
import G from 'gsap';

const { t } = useI18n();

const dropdownRef = useTemplateRef('dropdown');
const searchRef = useTemplateRef('search');

const showMainMenu = defineModel('showMenu');
const searchText = defineModel('search', {
    default: '',
});

onMounted(() => {
    G.set(dropdownRef.value, { y: -20, opacity: 0 });
});

const focusSearchInput = () => {
    (searchRef as any).value.$el.focus();
};

const showDropdown = () => {
    G.to(dropdownRef.value, { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' });
};

const hideDropdown = () => {
    G.to(dropdownRef.value, {
        y: -20,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
    });
};
</script>

<template>
    <div>
        <InputGroup id="search" class="relative">
            <InputGroupAddon class="cursor-pointer" @click="showMainMenu = !showMainMenu">
                <i :class="PrimeIcons.BARS"></i>
            </InputGroupAddon>
            <InputText
                id="input"
                ref="search"
                v-model="searchText"
                @click="showDropdown"
                @focus="showDropdown"
                @blur="hideDropdown"
                :placeholder="t('components.search.placeholder')">
            </InputText>
            <InputGroupAddon class="cursor-pointer" @click="focusSearchInput" id="addon">
                <i :class="PrimeIcons.SEARCH"></i>
            </InputGroupAddon>
        </InputGroup>
        <div ref="dropdown" class="bg-white border-round-sm shadow-1 p-3">
            <template v-if="searchText"> Zoekresultaten voor: {{ searchText }} </template>
            <template v-else>
                <span class="text-400">Geen zoekresultaten</span>
            </template>
        </div>
    </div>
</template>

<style lang="scss">
#search {
    border-radius: var(--border-radius-lg);
    width: 100%;

    #input {
        padding: 0.75rem 1rem;
        width: 100%;
    }

    #addon {
        padding: 0.5rem;
    }
}
</style>
