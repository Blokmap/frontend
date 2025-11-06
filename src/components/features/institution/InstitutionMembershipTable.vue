<script lang="ts" setup>
import InstitutionActionMenu from '@/components/features/institution/InstitutionActionMenu.vue';
import InstitutionLogo from '@/components/features/institution/InstitutionLogo.vue';
import Table from '@/components/shared/molecules/table/Table.vue';
import TableCell from '@/components/shared/molecules/table/TableCell.vue';
import { useI18n } from 'vue-i18n';
import RoleBadge from '../auth/roles/RoleBadge.vue';
import type { InstitutionMembership } from '@/domain/member';

defineProps<{
    memberships?: InstitutionMembership[];
    loading?: boolean;
}>();

const emit = defineEmits<{
    'click:membership': [membership: InstitutionMembership];
}>();

const { locale } = useI18n();

const onInstitutionClick = (membership: InstitutionMembership) => {
    emit('click:membership', membership);
};
</script>

<template>
    <Table :value="memberships" @click:row="onInstitutionClick">
        <template #row="{ data: membership }">
            <TableCell column="Institutie">
                <div class="flex items-center space-x-3">
                    <div class="h-16 w-16 flex-shrink-0">
                        <InstitutionLogo :slug="membership.institution.slug" />
                    </div>
                    <div class="min-w-0 flex-1">
                        <div class="truncate text-sm font-medium text-slate-900">
                            {{ membership.institution.name[locale] }}
                        </div>
                        <div class="truncate text-xs text-slate-500">
                            {{ membership.institution.slug }}
                        </div>
                    </div>
                </div>
            </TableCell>

            <TableCell column="E-mailadres">
                {{ membership.institution.email || '-' }}
            </TableCell>

            <TableCell column="Telefoon">
                {{ membership.institution.phone || '-' }}
            </TableCell>

            <TableCell column="Locatie">
                <div
                    v-if="membership.institution.city || membership.institution.province"
                    class="text-sm">
                    <div v-if="membership.institution.street">
                        {{ membership.institution.street }}
                    </div>
                    <div>
                        <span v-if="membership.institution.zip">{{
                            membership.institution.zip
                        }}</span>
                        <span v-if="membership.institution.city">
                            {{ membership.institution.zip ? ' ' : ''
                            }}{{ membership.institution.city }}
                        </span>
                    </div>
                    <div v-if="membership.institution.province" class="text-slate-500">
                        {{ membership.institution.province }}
                    </div>
                </div>
                <span v-else>-</span>
            </TableCell>

            <TableCell column="Rol">
                <RoleBadge :role="membership.role" type="institution" />
            </TableCell>

            <TableCell column="Acties">
                <InstitutionActionMenu :institution="membership.institution" />
            </TableCell>
        </template>
    </Table>
</template>
