<template>
    <ToolPanelViewProvider
        v-if="isConfigLoaded && config.default_panel_view"
        v-slot="{ currentPanel, currentPanelView }"
        :panel-view="config.default_panel_view">
        <ToolBoxWorkflow
            v-if="currentPanelView"
            :toolbox="currentPanel"
            :panel-views="config.panel_views"
            :current-panel-view="currentPanelView"
            :workflows="workflows"
            :data-managers="dataManagers"
            :module-sections="moduleSections"
            @updatePanelView="updatePanelView"
            @onInsertTool="onInsertTool"
            @onInsertModule="onInsertModule"
            @onInsertWorkflow="onInsertWorkflow"
            @onInsertWorkflowSteps="onInsertWorkflowSteps">
        </ToolBoxWorkflow>
    </ToolPanelViewProvider>
</template>

<script>
import ToolPanelViewProvider from "components/providers/ToolPanelViewProvider";
import { mapActions } from "vuex";

import { useConfig } from "@/composables/config";

import ToolBoxWorkflow from "./ToolBoxWorkflow";

export default {
    components: {
        ToolBoxWorkflow,
        ToolPanelViewProvider,
    },
    props: {
        workflows: {
            type: Array,
            required: true,
        },
        dataManagers: {
            type: Array,
            required: true,
        },
        moduleSections: {
            type: Array,
            required: true,
        },
    },
    setup() {
        const { config, isConfigLoaded } = useConfig(true);
        return { config, isConfigLoaded };
    },
    methods: {
        updatePanelView(panelView) {
            this.setCurrentPanelView(panelView);
        },
        ...mapActions("panels", ["setCurrentPanelView"]),
        onInsertTool(toolId, toolName) {
            this.$emit("onInsertTool", toolId, toolName);
        },
        onInsertModule(moduleName, moduleTitle) {
            this.$emit("onInsertModule", moduleName, moduleTitle);
        },
        onInsertWorkflow(workflowId, workflowName) {
            this.$emit("onInsertWorkflow", workflowId, workflowName);
        },
        onInsertWorkflowSteps(workflowId, workflowStepCount) {
            this.$emit("onInsertWorkflowSteps", workflowId, workflowStepCount);
        },
    },
};
</script>
