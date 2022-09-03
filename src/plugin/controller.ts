import { buildComponentSpec } from "./build";
import { createTemplate, setPart, setState, setTextFromApi } from "./template";

figma.on("run", async ({ command }: RunEvent) => {
  if (command === "open") {
    figma.showUI(__html__, { width: 360, height: 600 });
  }
});

const messageHandler = async (msg: any) => {
  if (msg.type === "post.createSlider") {
    createTemplate("slider");
  }
  if (msg.type === "post.createCheckbox") {
    createTemplate("checkbox");
  }
  if (msg.type === "post.selected.part") {
    const node = figma.currentPage.selection[0];
    if (node) {
      setPart(node, msg.part);
    }
  }
  if (msg.type === "post.selected.state") {
    const node = figma.currentPage.selection[0];
    if (node) {
      setState(node, msg.state);
    }
  }
  if (msg.type === "post.selected.textFromApi") {
    const node = figma.currentPage.selection[0];
    if (node) {
      setTextFromApi(node, msg.key);
    }
  }
  if (msg.type === "get.selected.componentSpec") {
    const node = figma.currentPage.selection[0];
    if (node && (node.type === "FRAME" || node.type === "COMPONENT_SET")) {
      const result = buildComponentSpec(node);
      figma.ui.postMessage({
        type: "get.selected.componentSpec",
        message: result,
      });
    }
  }
};

figma.ui.onmessage = (msg) =>
  messageHandler(msg).catch((err) => {
    console.error(err);
  });
