<script lang="ts" setup>
import Button from 'primevue/button';
import FloatLabel from 'primevue/floatlabel';
import InputText from 'primevue/inputtext';
import Select from 'primevue/select';
import LanguageSelector from '@/components/shared/molecules/LanguageSelector.vue';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { computed, ref, watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';
import {
    DEFAULT_INSTITUTION_REQUEST,
    INSTITUTION_CATEGORIES,
    institutionToRequest,
} from '@/domain/institution';
import type { Institution, InstitutionRequest } from '@/domain/institution';

const props = defineProps<{
    institution?: Institution;
    isLoading?: boolean;
}>();

const emit = defineEmits<{
    (e: 'click:save', form: InstitutionRequest): void;
}>();

const { t, locale } = useI18n();

const form = ref<InstitutionRequest>({ ...DEFAULT_INSTITUTION_REQUEST });

const currentLanguage = ref(locale.value);

watchEffect(() => {
    if (props.institution) {
        form.value = institutionToRequest(props.institution);
    }
});

const categoryOptions = computed(() =>
    INSTITUTION_CATEGORIES.map((category) => ({
        label: t(`domains.institutions.category.${category}`),
        value: category,
    })),
);

const selectedCategory = computed(() => {
    return categoryOptions.value.find((opt) => opt.value === form.value.category);
});

/**
 * Handles the form submission by emitting the 'click:save' event with the form data.
 */
function handleFormSubmission(): void {
    emit('click:save', form.value);
}
</script>

<template>
    <form class="space-y-4" @submit.prevent="handleFormSubmission">
        <!-- Name Translations and Type -->
        <div class="space-y-4">
            <div class="flex items-center justify-between">
                <h3 class="text-lg font-semibold">{{ $t('components.institutionForm.name') }}</h3>
                <LanguageSelector v-model="currentLanguage">
                    <template #button="{ toggle, currentFlag, currentLabel }">
                        <Button severity="contrast" size="small" @click="toggle">
                            <img :src="currentFlag" alt="flag" class="mr-2 h-4 w-4" />
                            <span class="text-sm">{{ currentLabel }}</span>
                        </Button>
                    </template>
                </LanguageSelector>
            </div>

            <FloatLabel variant="on">
                <label :for="`name-${currentLanguage}`">
                    {{ $t('components.institutionForm.name') }} ({{
                        currentLanguage.toUpperCase()
                    }})
                </label>
                <InputText
                    :id="`name-${currentLanguage}`"
                    v-model="form.name[currentLanguage]"
                    class="w-full"
                    required>
                </InputText>
            </FloatLabel>
        </div>

        <!-- Slug -->
        <FloatLabel variant="on">
            <label for="slug">{{ $t('components.institutionForm.slug') }}</label>
            <InputText
                id="slug"
                v-model="form.slug"
                class="w-full"
                :placeholder="DEFAULT_INSTITUTION_REQUEST.slug"
                required />
        </FloatLabel>

        <!-- Category -->
        <FloatLabel variant="on">
            <Select
                id="category"
                v-model="form.category"
                :options="categoryOptions"
                option-label="label"
                option-value="value"
                class="w-full"
                required>
                <template #value>
                    <span v-if="selectedCategory">{{ selectedCategory.label }}</span>
                </template>
            </Select>
            <label for="category">{{ $t('components.institutionForm.category') }}</label>
        </FloatLabel>

        <!-- Contact Information -->
        <div class="space-y-3">
            <h3 class="text-lg font-semibold">
                {{ $t('components.institutionForm.contactInformation') }}
            </h3>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
                <FloatLabel variant="on">
                    <label for="email">{{ $t('components.institutionForm.email') }}</label>
                    <InputText
                        id="email"
                        v-model="form.email"
                        type="email"
                        class="w-full"
                        :placeholder="DEFAULT_INSTITUTION_REQUEST.email ?? ''" />
                </FloatLabel>

                <FloatLabel variant="on">
                    <label for="phone">{{ $t('components.institutionForm.phone') }}</label>
                    <InputText
                        id="phone"
                        v-model="form.phoneNumber"
                        type="tel"
                        class="w-full"
                        :placeholder="DEFAULT_INSTITUTION_REQUEST.phoneNumber ?? ''" />
                </FloatLabel>
            </div>
        </div>

        <!-- Address Information -->
        <div class="space-y-3">
            <h3 class="text-lg font-semibold">{{ $t('components.institutionForm.address') }}</h3>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FloatLabel variant="on" class="md:col-span-2">
                    <label for="street">{{ $t('components.institutionForm.street') }}</label>
                    <InputText
                        id="street"
                        v-model="form.street"
                        class="w-full"
                        :placeholder="DEFAULT_INSTITUTION_REQUEST.street ?? ''" />
                </FloatLabel>

                <FloatLabel variant="on">
                    <label for="number">{{ $t('components.institutionForm.number') }}</label>
                    <InputText
                        id="number"
                        v-model="form.number"
                        class="w-full"
                        :placeholder="DEFAULT_INSTITUTION_REQUEST.number ?? ''" />
                </FloatLabel>
            </div>

            <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
                <FloatLabel variant="on">
                    <label for="zip">{{ $t('components.institutionForm.zip') }}</label>
                    <InputText
                        id="zip"
                        v-model="form.zip"
                        class="w-full"
                        :placeholder="DEFAULT_INSTITUTION_REQUEST.zip ?? ''" />
                </FloatLabel>

                <FloatLabel variant="on">
                    <label for="city">{{ $t('components.institutionForm.city') }}</label>
                    <InputText
                        id="city"
                        v-model="form.city"
                        class="w-full"
                        :placeholder="DEFAULT_INSTITUTION_REQUEST.city ?? ''" />
                </FloatLabel>

                <FloatLabel variant="on">
                    <label for="province">{{ $t('components.institutionForm.province') }}</label>
                    <InputText
                        id="province"
                        v-model="form.province"
                        class="w-full"
                        :placeholder="DEFAULT_INSTITUTION_REQUEST.province ?? ''" />
                </FloatLabel>
            </div>

            <FloatLabel variant="on">
                <label for="country">{{ $t('components.institutionForm.country') }}</label>
                <InputText
                    id="country"
                    v-model="form.country"
                    class="w-full"
                    :placeholder="DEFAULT_INSTITUTION_REQUEST.country ?? ''" />
            </FloatLabel>
        </div>

        <!-- Submit Button -->
        <Button
            class="mt-4 w-full"
            :label="
                institution
                    ? $t('components.institutionForm.updateButton')
                    : $t('components.institutionForm.createButton')
            "
            severity="primary"
            type="submit"
            :loading="isLoading">
            <template #icon>
                <FontAwesomeIcon :icon="faSave" />
            </template>
        </Button>
    </form>
</template>
