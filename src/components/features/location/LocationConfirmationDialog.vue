<script lang="ts" setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import Textarea from 'primevue/textarea';
import { ref, watch } from 'vue';
import type { Location } from '@/domain/location';

const props = defineProps<{
    location: Location | null;
}>();

const emit = defineEmits<{
    'click:confirm': [reason: string];
    'click:cancel': [];
}>();

const visible = defineModel<boolean>('visible', {
    default: false,
});

const isLoading = ref(false);
const reason = ref('');

watch(
    () => visible.value,
    (newVisible) => {
        if (newVisible) {
            reason.value = '';
            isLoading.value = false;
        }
    },
);

async function onConfirm() {
    emit('click:confirm', reason.value);
}

function onCancel() {
    emit('click:cancel');
}
</script>

<template>
    <Dialog
        v-model:visible="visible"
        modal
        :closable="!isLoading"
        :dismissable-mask="!isLoading"
        class="mx-4 w-full max-w-lg"
        content-class="rounded-lg">
        <template #header>
            <div class="flex items-center gap-3">
                <h3 class="text-lg font-semibold text-gray-900">Locatie afkeuren</h3>
            </div>
        </template>

        <div class="space-y-4">
            <p class="text-gray-600">
                Weet je zeker dat je <strong>"{{ props.location?.name }}"</strong> wilt afkeuren?
                Als je een reden opgeeft wordt deze getoond aan de gebruiker die de locatie heeft
                ingediend.
            </p>

            <slot>
                <div class="space-y-2">
                    <label for="rejection-reason" class="block text-sm font-medium text-gray-700">
                        Reden voor afkeuring (optioneel)
                    </label>
                    <Textarea
                        id="rejection-reason"
                        v-model="reason"
                        placeholder="Voer een reden in waarom deze locatie wordt afgekeurd..."
                        :disabled="isLoading"
                        rows="4"
                        class="w-full">
                    </Textarea>
                </div>
            </slot>
        </div>

        <template #footer>
            <div class="flex justify-end gap-3">
                <Button
                    label="Annuleren"
                    severity="contrast"
                    :disabled="isLoading"
                    @click="onCancel"
                    outlined>
                </Button>
                <Button label="Afkeuren" severity="danger" :loading="isLoading" @click="onConfirm">
                </Button>
            </div>
        </template>
    </Dialog>
</template>
