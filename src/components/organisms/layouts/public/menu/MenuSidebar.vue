<script lang="ts" setup>
import Button from 'primevue/button';
import ImageStack from '@/components/molecules/ImageStack.vue';
import LanguageSelector from '@/components/molecules/LanguageSelector.vue';
import LocaleDisplay from '@/components/molecules/LocaleDisplay.vue';
import EntityAvatar from '@/components/molecules/avatar/EntityAvatar.vue';
import {
    faCalendarAlt,
    faGlobe,
    faLock,
    faQuestionCircle,
    faSignOut,
    faSliders,
    faUser,
    faX,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAuthLogout } from '@/composables/data/useAuth';
import { DOCS_URL } from '@/config';
import { type Image } from '@/domain/image';
import MenuSidebarItem from './MenuSidebarItem.vue';
import type { Profile } from '@/domain/profile';

defineProps<{
    loading?: boolean;
    profile?: Profile | null;
    images?: Image[];
}>();

const router = useRouter();

const { locale } = useI18n();
const { mutateAsync: logout } = useAuthLogout();

const showMenu = defineModel<boolean>('show', { default: false });

router.beforeEach(() => {
    showMenu.value = false;
});
</script>

<template>
    <Transition name="fade">
        <div class="menu-backdrop" @click="showMenu = false" v-if="showMenu"></div>
    </Transition>
    <Transition name="slide-left">
        <aside class="menu" @click.stop v-if="showMenu" role="dialog" aria-modal>
            <header class="menu__header">
                <RouterLink :to="{ name: 'profile' }" class="header__profile-link" v-if="profile">
                    <EntityAvatar class="h-10 w-10" :image="profile.avatar?.url" />
                </RouterLink>

                <RouterLink :to="{ name: 'auth' }" v-else>
                    <Button severity="contrast" rounded>
                        <template #icon>
                            <FontAwesomeIcon :icon="faUser" />
                        </template>
                    </Button>
                </RouterLink>

                <Button severity="contrast" @click="showMenu = false" outlined rounded>
                    <template #icon>
                        <FontAwesomeIcon :icon="faX" />
                    </template>
                </Button>
            </header>
            <div class="menu__content">
                <h2 class="text-4xl font-bold">Menu</h2>

                <section class="menu__cta" aria-labelledby="cta-heading">
                    <ImageStack class="cta__stack" :images="images" />
                    <div class="!mb-6 max-w-2xs space-y-2 text-center">
                        <h3 id="cta-heading" class="text-xl font-bold">
                            Zelf een locatie aanbieden?
                        </h3>
                        <p class="text-sm text-slate-600">
                            Dien zelf een locatie in als student of organisatie.
                        </p>
                    </div>
                    <Button severity="secondary">Aan de slag</Button>
                </section>

                <nav class="menu__nav">
                    <template v-if="profile">
                        <MenuSidebarItem label="Profiel" :to="{ name: 'profile' }" :icon="faUser">
                        </MenuSidebarItem>
                        <MenuSidebarItem
                            label="Reservaties"
                            :to="{ name: 'profile', hash: '#reservations' }"
                            :icon="faCalendarAlt">
                        </MenuSidebarItem>
                        <MenuSidebarItem
                            label="Beheermodus"
                            :to="{ name: 'manage' }"
                            :icon="faSliders">
                        </MenuSidebarItem>
                        <MenuSidebarItem
                            v-if="profile.isAdmin"
                            label="Adminmodus"
                            :to="{ name: 'admin' }"
                            :icon="faLock">
                        </MenuSidebarItem>
                    </template>
                </nav>

                <hr class="menu__divider" v-if="profile" />

                <nav class="menu__nav">
                    <MenuSidebarItem
                        v-if="!profile"
                        label="Inloggen"
                        :icon="faUser"
                        :to="{ name: 'auth' }">
                    </MenuSidebarItem>
                    <LanguageSelector v-model="locale">
                        <template #button="{ toggle }">
                            <MenuSidebarItem label="Taal" :icon="faGlobe" @click="toggle">
                                <template #end>
                                    <LocaleDisplay :locale="locale" />
                                </template>
                            </MenuSidebarItem>
                        </template>
                    </LanguageSelector>
                    <MenuSidebarItem label="Helpcentrum" :href="DOCS_URL" :icon="faQuestionCircle">
                    </MenuSidebarItem>
                </nav>

                <hr class="menu__divider" v-if="profile" />

                <nav class="menu__nav">
                    <MenuSidebarItem
                        v-if="profile"
                        label="Uitloggen"
                        :icon="faSignOut"
                        @click="logout">
                    </MenuSidebarItem>
                </nav>
            </div>
        </aside>
    </Transition>
</template>

<style scoped>
@reference '@/assets/styles/main.css';

.menu-backdrop {
    @apply fixed top-0 left-0 z-200 h-screen w-screen;
    @apply bg-slate-950/25 backdrop-blur-xs;
}

.menu {
    @apply fixed top-0 right-0 z-[200] h-screen min-w-[400px] space-y-8 px-12 py-8;
    @apply overflow-y-auto rounded-l-4xl bg-white;

    .menu__header {
        @apply flex items-center justify-end gap-3;
    }

    .menu__content {
        @apply space-y-6;

        .menu__cta {
            @apply flex flex-col space-y-3;
            @apply bg-secondary-50 border-secondary-100 rounded-xl border p-6;

            .cta__stack {
                @apply mx-auto h-30 w-30;
            }
        }

        .menu__nav {
            @apply space-y-6;
        }

        .menu__divider {
            @apply border-t border-slate-200;
        }
    }
}
</style>
