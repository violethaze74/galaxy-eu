import Vue from "vue";
import { mount } from "@vue/test-utils";
import Node from "./Node";
import { getNewAttachNode } from "jest/helpers";

jest.mock("app");

describe("Node", () => {
    it("test attributes", async () => {
        const wrapper = mount(Node, {
            propsData: {
                id: "node-id",
                name: "node-name",
                type: "tool",
                step: {},
                getManager: () => {},
                getCanvasManager: () => {},
            },
            attachTo: getNewAttachNode(),
        });
        const icon = wrapper.findAll("i");
        expect(icon.at(2).classes()).toEqual(expect.arrayContaining(["fa-wrench"]));
        const toolLinks = wrapper.findAll("i");
        expect(toolLinks.length).toBe(3);
        wrapper.setProps({ type: "subworkflow" });
        await Vue.nextTick();
        expect(icon.at(2).classes()).toEqual(expect.arrayContaining(["fa-sitemap"]));
        const subworkflowLinks = wrapper.findAll("i");
        expect(subworkflowLinks.length).toBe(2);
        const workflowTitle = wrapper.find(".node-title");
        expect(workflowTitle.text()).toBe("node-name");
    });
});
