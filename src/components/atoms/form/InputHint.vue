<script lang="ts" setup>
import { computed } from 'vue';
import type { ErrorObject } from '@vuelidate/core';

const props = defineProps<{
    value?: string;
    errors?: ErrorObject[];
    locale?: string;
}>();

const invalid = computed<boolean>(() => {
    return !!props.errors && props.errors.length > 0;
});

const errors = computed<ErrorObject[] | undefined>(() => {
    if (props.errors) {
        return props.errors.filter((error: ErrorObject) => {
            return !props.locale || props.locale === error.$property;
        });
    }
});
</script>

<template>
    <div class="mt-1 space-y-1" v-if="invalid || $slots.default || value">
        <ul v-if="invalid && errors" class="space-y-1 text-xs" role="alert" aria-live="polite">
            <li v-for="error in errors" class="text-blushed-brick-500" :key="error.$uid">
                {{ error.$message }}
                <template v-if="locale">in {{ $t('locales.' + locale) }}</template>
            </li>
        </ul>
        <small v-else class="block text-slate-500">
            <slot v-if="$slots.default || value">
                {{ value }}
            </slot>
        </small>
    </div>
</template>
