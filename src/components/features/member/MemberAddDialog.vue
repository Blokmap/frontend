<script lang="ts" setup>
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import InputHint from '@/components/shared/molecules/form/InputHint.vue';
import InputLabel from '@/components/shared/molecules/form/InputLabel.vue';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref } from 'vue';
import type { CreateMemberBody, Role } from '@/domain/member';

const props = defineProps<{
    roles: Role[];
    isPending?: boolean;
}>();

const emit = defineEmits<{
    'click:submit': [form: CreateMemberBody];
}>();

const isVisible = defineModel<boolean>('isVisible', {
    default: false,
});

const form = ref<CreateMemberBody>({
    username: '',
    roleId: null,
});

const roleOptions = computed(() => {
    return props.roles.map((role: Role) => ({
        label: role.name,
        value: role.id,
    }));
});

/**
 * Handle submitting the form.
 */
function onSubmitForm(): void {
    emit('click:submit', form.value);
}
</script>

<template>
    <Dialog v-model:visible="isVisible" modal>
        <template #header>
            <div class="flex flex-col">
                <h3 class="text-lg font-semibold text-gray-900">Beheerder Toevoegen</h3>
            </div>
        </template>
        <template #default>
            <div class="space-y-4">
                <p class="text-slate-500">
                    Voeg een nieuwe beheerder met een rol toe aan deze locatie.
                </p>
                <form @submit.prevent="onSubmitForm">
                    <div class="grid grid-cols-1 gap-4">
                        <div>
                            <InputLabel for="username"> Gebruikersnaam </InputLabel>
                            <InputText
                                id="username"
                                placeholder="Bv. tibo_ulens"
                                v-model="form.username"
                                required>
                            </InputText>
                            <InputHint>
                                De gebruikersnaam is te vinden op de
                                <RouterLink :to="{ name: 'profile' }"> profielpagina </RouterLink>
                                van de gebruiker.
                            </InputHint>
                        </div>
                        <div>
                            <InputLabel for="role"> Rol </InputLabel>

                            <Select
                                placeholder="Selecteer rol"
                                option-label="label"
                                option-value="value"
                                v-model="form.roleId"
                                :options="roleOptions">
                            </Select>

                            <InputHint>
                                Selecteer de rol die u wilt toewijzen aan deze gebruiker.
                            </InputHint>
                        </div>
                    </div>
                </form>
            </div>
        </template>
        <template #footer>
            <Button
                severity="primary"
                type="submit"
                :label="$t('general.actions.save')"
                :loading="isPending"
                @click="onSubmitForm">
                <template #icon>
                    <FontAwesomeIcon :icon="faSave" />
                </template>
            </Button>
        </template>
    </Dialog>
</template>
