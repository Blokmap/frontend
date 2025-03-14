<script lang="ts" setup>
import { ref } from 'vue';
import { PrimeIcons } from '@primevue/core';
import InputGroup from 'primevue/inputgroup';
import InputGroupAddon from 'primevue/inputgroupaddon';
import InputText from 'primevue/inputtext';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const search = ref<string>('');
</script>

<template>
    <InputGroup id="search">
        <InputText id="input" v-model="search" :placeholder="t('pages.blokmap.search.placeholder')">
        </InputText>
        <InputGroupAddon id="addon">
            <i :class="PrimeIcons.SEARCH"></i>
        </InputGroupAddon>
    </InputGroup>
</template>

<style lang="scss" scoped>
#search {
    border-radius: var(--border-radius-lg);
    max-width: 100vw;
    width: 400px;

    #input {
        padding: 0.75rem 1rem;
        width: 100%;
    }
}
</style>
