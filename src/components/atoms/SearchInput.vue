<script setup lang="ts">
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';
import InputText from 'primevue/inputtext';
import { faSearch, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import InputLabel from '../molecules/form/InputLabel.vue';

withDefaults(
    defineProps<{
        label?: string;
        placeholder?: string;
        loading?: boolean;
    }>(),
    {
        label: 'Zoeken',
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
    <div class="search-field">
        <InputLabel html-for="search">
            {{ label }}
        </InputLabel>
        <IconField>
            <InputIcon v-if="loading">
                <FontAwesomeIcon :icon="faSpinner" spin />
            </InputIcon>
            <InputIcon v-else>
                <FontAwesomeIcon :icon="faSearch" />
            </InputIcon>
            <InputText
                id="search"
                class="w-full"
                v-model="search"
                :placeholder="placeholder"
                @input="onInput">
            </InputText>
        </IconField>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.search-field {
    @apply flex flex-col;
}
</style>
