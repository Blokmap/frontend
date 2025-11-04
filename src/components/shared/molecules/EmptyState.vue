<script lang="ts" setup>
import { faInbox } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core';

withDefaults(
    defineProps<{
        icon?: IconDefinition;
        title?: string;
        message?: string;
    }>(),
    {
        icon: () => faInbox,
    },
);
</script>

<template>
    <div class="rounded-lg border border-slate-200 bg-white px-6 py-12 text-center">
        <div class="mx-auto flex max-w-md flex-col items-center gap-3">
            <FontAwesomeIcon :icon="icon" class="text-4xl text-slate-400" />
            <div class="space-y-1">
                <slot name="title" v-if="$slots.title || title">
                    <h3 class="text-base font-medium text-slate-900">{{ title }}</h3>
                </slot>
                <slot name="message" v-if="$slots.message || message">
                    <p class="text-sm text-slate-500">{{ message }}</p>
                </slot>
            </div>
            <slot name="actions"></slot>
        </div>
    </div>
</template>
