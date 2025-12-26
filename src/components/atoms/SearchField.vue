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

const search = defineModel<string>({
    default: '',
});

const emit = defineEmits<{
    input: [event: InputEvent];
}>();

const onInput = (event: InputEvent): void => {
    emit('input', event);
};
</script>

<template>
    <IconField>
        <InputIcon v-if="loading">
            <FontAwesomeIcon :icon="faSpinner" spin />
        </InputIcon>
        <InputIcon v-else>
            <FontAwesomeIcon :icon="faSearch" />
        </InputIcon>
        <InputText class="w-full" v-model="search" :placeholder="placeholder" @input="onInput" />
    </IconField>
</template>
