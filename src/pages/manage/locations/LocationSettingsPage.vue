<script lang="ts" setup>
import LocationHierarchyBuilder from '@/components/features/location/builder/builders/LocationHierarchyBuilder.vue';
import LocationSettingsBuilder from '@/components/features/location/builder/builders/LocationSettingsBuilder.vue';
import ManageBreadcrumb, {
    type BreadcrumbItem,
} from '@/components/shared/molecules/Breadcrumb.vue';
import SaveBar from '@/components/shared/molecules/SaveBar.vue';
import PageContent from '@/pages/PageContent.vue';
import PageTitle from '@/pages/PageTitle.vue';
import { computed, ref } from 'vue';
import { useReadInstitutionAuthorities } from '@/composables/data/useAuthorities';
import { useReadInstitutions } from '@/composables/data/useInstitutions';
import { useUpdateLocation } from '@/composables/data/useLocations';
import { useReadProfileInstitutionMemberships } from '@/composables/data/useMembers';
import { useDirtyForm } from '@/composables/useDirtyForm';
import { has, InstitutionPermission, type RecursivePermissions } from '@/domain/auth';
import { type Authority, type AuthorityFilter } from '@/domain/authority';
import { locationToRequest, type Location, type LocationRequest } from '@/domain/location';
import type { Institution, InstitutionFilter } from '@/domain/institution';
import type { Profile } from '@/domain/profile';

const props = defineProps<{
    authProfile: Profile;
    location: Location;
    permissions: RecursivePermissions;
}>();

const { mutateAsync: updateLocation, isPending: isUpdatingLocation } = useUpdateLocation();

const { form, hasChanges, isUpdating, saveChanges, cancelChanges } = useDirtyForm({
    isPending: isUpdatingLocation,
    source: () => props.location,
    toForm: locationToRequest,
    onSave: (data: LocationRequest) => {
        updateLocation({ locationId: props.location.id, data });
    },
});

const profileId = computed<string>(() => props.authProfile.id);

// We only allow institution admins to change the location hierarchy.
// Makes it easier to manage permissions.

// For non-admins: institution memberships only.
const { data: memberInstitutions } = useReadProfileInstitutionMemberships(profileId, {
    enabled: computed(() => !props.authProfile.isAdmin),
});

// For admins: all institutions.
const institutionFilters = ref<InstitutionFilter>({
    perPage: 50,
    page: 1,
    query: null,
});

const { data: allInstitutions, isLoading: isLoadingInstitutions } = useReadInstitutions(
    institutionFilters,
    {
        enabled: computed(() => props.authProfile.isAdmin),
    },
);

const institutionOptions = computed<Institution[] | undefined>(() => {
    const predicate = has(InstitutionPermission.Administrator);

    const result =
        allInstitutions.value?.data ??
        memberInstitutions.value
            ?.filter((membership) => {
                const permissions = membership.role?.permissions;

                if (!permissions) {
                    return false;
                }

                return predicate(permissions);
            })
            .map((membership) => {
                return membership.institution;
            });

    const current = props.location.institution;
    const exists = result?.find((i) => i.id === current?.id);

    if (current && !exists) {
        result?.push(current);
    }

    return result;
});

// Fetch authorities for the selected institution.
// (Institution) admins can switch to all authorities within their institution.
const institutionId = computed<number | null>(() => {
    return form.value?.institutionId ?? null;
});

const authorityFilter = ref<AuthorityFilter>({
    perPage: 50,
    page: 1,
    query: null,
});

const { data: authorities, isLoading: isLoadingAuthorities } = useReadInstitutionAuthorities(
    institutionId,
    authorityFilter,
);

const authorityOptions = computed<Authority[] | undefined>(() => {
    const result = authorities.value?.data;
    const current = props.location.authority;
    const exists = result?.find((a) => a.id === current?.id);

    if (current && !exists) {
        result?.push(current);
    }

    return result;
});

const isLoadingHierarchyOptions = computed<boolean>(() => {
    return isLoadingInstitutions.value || isLoadingAuthorities.value;
});

const disableHierarchyBuilder = computed<boolean>(() => {
    let disable = !props.authProfile.isAdmin;

    if (props.location.institution || props.location.authority) {
        const perms = props.permissions.institution;
        disable = disable && !has(InstitutionPermission.Administrator)(perms);
    }

    return disable;
});

const breadcrumbs = computed<BreadcrumbItem[]>(() => [
    {
        label: 'Locaties',
        to: {
            name: 'manage.locations',
        },
    },
    {
        label: props.location.name,
        to: {
            name: 'manage.location.info',
            params: {
                locationId: props.location.id,
            },
        },
    },
    {
        label: 'Instellingen',
    },
]);
</script>

<template>
    <PageContent>
        <ManageBreadcrumb :items="breadcrumbs" />

        <PageTitle title="Instellingen" />

        <LocationSettingsBuilder v-if="form" :authorities="authorities" v-model:form="form">
        </LocationSettingsBuilder>

        <LocationHierarchyBuilder
            v-if="form"
            :authority-options="authorityOptions"
            :institution-options="institutionOptions"
            :is-loading-options="isLoadingHierarchyOptions"
            :disabled="disableHierarchyBuilder"
            v-model:form="form">
        </LocationHierarchyBuilder>

        <SaveBar
            :show="hasChanges"
            :loading="isUpdating"
            @save="saveChanges"
            @cancel="cancelChanges">
        </SaveBar>
    </PageContent>
</template>
