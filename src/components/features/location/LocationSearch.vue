<script lang="ts" setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
</script>

<template>
    <IconField>
        <InputIcon>
            <FontAwesomeIcon :icon="faMagnifyingGlass" />
        </InputIcon>
        <InputText
            class="w-full"
            pt:root:class="bg-slate-100 border-0 shadow-none"
            placeholder="Search for locations">
        </InputText>
    </IconField>
</template>
