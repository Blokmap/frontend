<script lang="ts" setup>
import { useAuthRegister } from '@/composables/data/useAuth';
import { useInstitutions } from '@/composables/data/useInstitutions';
import { useMessages } from '@/composables/useMessages';

const { showMessage } = useMessages();

const { data: institutions, isLoading: isLoadingInstitutions } = useInstitutions();

const {
    mutate: register,
    isPending: registerIsLoading,
    error: registerError,
} = useAuthRegister({
    onError: (error) => {
        showMessage({
            severity: 'error',
            summary: 'Er is een fout opgetreden',
            detail: error.response?.data,
        });
    },
    onSuccess: () => {
        showMessage({
            severity: 'success',
            summary: 'Registratie Succesvol',
            detail: 'Je bent succesvol geregistreerd. Controleer je e-mail voor verdere instructies.',
        });
    },
});
</script>

<template></template>
