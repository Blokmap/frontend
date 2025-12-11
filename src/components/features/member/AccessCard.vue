<script lang="ts" setup>
import Card from 'primevue/card';
</script>

<template>
    <Card>
        <template #content>
            <div class="flex flex-col gap-3">
                <div v-if="$slots.header">
                    <slot name="header"></slot>
                </div>

                <div class="grid grid-cols-2 gap-3">
                    <slot></slot>
                </div>
            </div>
        </template>
    </Card>
</template>
