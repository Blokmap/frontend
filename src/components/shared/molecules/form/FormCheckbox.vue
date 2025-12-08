<script setup lang="ts">
import Checkbox from 'primevue/checkbox';

const model = defineModel<boolean>({ required: true });

defineProps<{
    label: string;
    description: string;
    inputId: string;
}>();
</script>

<template>
    <div class="checkbox" @click="model = !model">
        <div class="flex gap-3">
            <Checkbox v-model="model" :input-id="inputId" @click.stop binary />
            <label :for="inputId" @click.stop> {{ label }} </label>
        </div>
        <p>
            {{ description }}
        </p>
    </div>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.checkbox {
    @apply w-full cursor-pointer space-y-2 rounded-lg bg-slate-50 p-3;
    @apply border-1 border-slate-200;

    label {
        @apply cursor-pointer text-sm font-medium;
    }

    p {
        @apply text-xs text-slate-500;
    }
}
</style>
