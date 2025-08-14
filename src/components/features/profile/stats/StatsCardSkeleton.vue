<script setup lang="ts">
import Card from 'primevue/card';
import Skeleton from 'primevue/skeleton';
</script>

<template>
    <Card class="text-center">
        <template #content>
            <div class="flex flex-col items-center gap-2">
                <Skeleton size="24px" shape="circle" />
                <Skeleton height="32px" width="32px" class="mx-auto" />
                <Skeleton height="20px" width="100px" class="mx-auto" />
            </div>
        </template>
    </Card>
</template>
