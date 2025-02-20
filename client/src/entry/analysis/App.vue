<template>
    <div id="app" :style="theme">
        <div id="everything">
            <div id="background" />
            <Masthead
                v-if="showMasthead"
                id="masthead"
                :brand="config.brand"
                :logo-url="config.logo_url"
                :logo-src="theme?.['--masthead-logo-img'] ?? config.logo_src"
                :logo-src-secondary="theme?.['--masthead-logo-img-secondary'] ?? config.logo_src_secondary"
                :tabs="tabs"
                :window-tab="windowTab"
                @open-url="openUrl" />
            <Alert
                v-if="config.message_box_visible && config.message_box_content"
                id="messagebox"
                class="rounded-0 m-0 p-2"
                :variant="config.message_box_class || 'info'">
                <span class="fa fa-fw mr-1 fa-exclamation" />
                <!-- eslint-disable-next-line vue/no-v-html -->
                <span v-html="config.message_box_content"></span>
            </Alert>
            <Alert
                v-if="config.show_inactivity_warning && config.inactivity_box_content"
                id="inactivebox"
                class="rounded-0 m-0 p-2"
                variant="warning">
                <span class="fa fa-fw mr-1 fa-exclamation-triangle" />
                <span>{{ config.inactivity_box_content }}</span>
                <span>
                    <a class="ml-1" :href="resendUrl">Resend Verification</a>
                </span>
            </Alert>
            <router-view @update:confirmation="confirmation = $event" />
        </div>
        <div id="dd-helper" />
        <Toast ref="toastRef" />
        <ConfirmDialog ref="confirmDialogRef" />
        <UploadModal ref="uploadModal" />
        <BroadcastsOverlay />
        <DragGhost />
    </div>
</template>
<script>
import { getGalaxyInstance } from "app";
import ConfirmDialog from "components/ConfirmDialog";
import { HistoryPanelProxy } from "components/History/adapters/HistoryPanelProxy";
import Toast from "components/Toast";
import { setConfirmDialogComponentRef } from "composables/confirmDialog";
import { setGlobalUploadModal } from "composables/globalUploadModal";
import { setToastComponentRef } from "composables/toast";
import { fetchMenu } from "entry/analysis/menu";
import { WindowManager } from "layout/window-manager";
import Modal from "mvc/ui/ui-modal";
import { getAppRoot } from "onload";
import { storeToRefs } from "pinia";
import { withPrefix } from "utils/redirect";
import { ref } from "vue";

import { useHistoryStore } from "@/stores/historyStore";
import { useNotificationsStore } from "@/stores/notificationsStore";
import { useUserStore } from "@/stores/userStore";

import Alert from "@/components/Alert.vue";
import DragGhost from "@/components/DragGhost.vue";
import BroadcastsOverlay from "@/components/Notifications/Broadcasts/BroadcastsOverlay.vue";
import Masthead from "components/Masthead/Masthead.vue";
import UploadModal from "components/Upload/UploadModal.vue";

export default {
    components: {
        Alert,
        DragGhost,
        Masthead,
        Toast,
        ConfirmDialog,
        UploadModal,
        BroadcastsOverlay,
    },
    setup() {
        const userStore = useUserStore();
        const { currentTheme } = storeToRefs(userStore);
        const { currentHistory } = storeToRefs(useHistoryStore());

        userStore.loadUser();

        const toastRef = ref(null);
        setToastComponentRef(toastRef);

        const confirmDialogRef = ref(null);
        setConfirmDialogComponentRef(confirmDialogRef);

        const uploadModal = ref(null);
        setGlobalUploadModal(uploadModal);

        return { toastRef, confirmDialogRef, uploadModal, currentTheme, currentHistory };
    },
    data() {
        return {
            config: getGalaxyInstance().config,
            confirmation: null,
            resendUrl: `${getAppRoot()}user/resend_verification`,
            windowManager: new WindowManager(),
        };
    },
    computed: {
        tabs() {
            return fetchMenu(this.config);
        },
        showMasthead() {
            const masthead = this.$route.query.hide_masthead;
            if (masthead !== undefined) {
                return masthead.toLowerCase() != "true";
            }
            return true;
        },
        theme() {
            const themeKeys = Object.keys(this.config.themes);
            if (themeKeys.length > 0) {
                const foundTheme = themeKeys.includes(this.currentTheme);
                const selectedTheme = foundTheme ? this.currentTheme : themeKeys[0];
                return this.config.themes[selectedTheme];
            }
            return null;
        },
        windowTab() {
            return this.windowManager.getTab();
        },
    },
    watch: {
        confirmation() {
            console.debug("App - Confirmation before route change: ", this.confirmation);
            this.$router.confirmation = this.confirmation;
        },
        currentHistory() {
            this.Galaxy.currHistoryPanel.syncCurrentHistoryModel(this.currentHistory);
        },
    },
    mounted() {
        this.Galaxy = getGalaxyInstance();
        this.Galaxy.currHistoryPanel = new HistoryPanelProxy();
        this.Galaxy.modal = new Modal.View();
        this.Galaxy.frame = this.windowManager;
        if (this.Galaxy.config.enable_notification_system) {
            this.startNotificationsPolling();
        }
    },
    created() {
        window.onbeforeunload = () => {
            if (this.confirmation || this.windowManager.beforeUnload()) {
                return "Are you sure you want to leave the page?";
            }
        };
    },
    methods: {
        startNotificationsPolling() {
            const notificationsStore = useNotificationsStore();
            notificationsStore.startPollingNotifications();
        },
        openUrl(urlObj) {
            if (!urlObj.target) {
                this.$router.push(urlObj.url);
            } else {
                const url = withPrefix(urlObj.url);
                if (urlObj.target == "_blank") {
                    window.open(url);
                } else {
                    window.location = url;
                }
            }
        },
    },
};
</script>

<style lang="scss">
@import "custom_theme_variables.scss";
</style>
