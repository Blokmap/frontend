<template>
    <IconField>
        <InputIcon v-if="loading">
            <FontAwesomeIcon :icon="faSpinner" spin />
        </InputIcon>
        <InputIcon v-else>
            <FontAwesomeIcon :icon="faSearch" />
        </InputIcon>
        <InputText v-model="search" :placeholder="placeholder" @input="onInput"> </InputText>
    </IconField>
</template>

<script setup lang="ts">
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

withDefaults(
    defineProps<{
        placeholder?: string;
        loading?: boolean;
    }>(),
    {
        placeholder: 'Zoeken...',
        loading: false,
    },
);

const search = defineModel<string>();

const emit = defineEmits<{
    (e: 'input', event: Event): void;
}>();

const onInput = (event: Event): void => {
    emit('input', event);
};
</script>
