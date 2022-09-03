import { CSSProperties } from "react";

export function createSliderTemplate() {
  const root = figma.createFrame();

  const label = figma.createText();
  const control = figma.createFrame();
  const track = figma.createFrame();
  const range = figma.createFrame();
  const thumb = figma.createFrame();
  const input = figma.createFrame();
  const output = figma.createText();

  root.name = "Root";
  root.fills = [];
  root.setPluginData("part", "root");
  root.setPluginData("component", "slider");

  label.name = "Label";
  label.setPluginData("part", "label");
  root.appendChild(label);

  control.name = "Control";
  control.fills = [];
  control.setPluginData("part", "control");
  root.appendChild(control);

  track.name = "Track";
  track.fills = [];
  track.setPluginData("part", "track");
  control.appendChild(track);

  range.name = "Range";
  range.fills = [];
  range.setPluginData("part", "range");
  track.appendChild(range);

  thumb.name = "Thumb";
  thumb.fills = [];
  thumb.setPluginData("part", "thumb");
  control.appendChild(thumb);

  input.name = "Input";
  input.fills = [];
  input.setPluginData("part", "input");
  thumb.appendChild(input);

  output.name = "Output";
  output.setPluginData("part", "output");
  root.appendChild(output);
}

export function setPart(node: SceneNode, part: string) {
  node.setPluginData("part", part);
}

export function setState(node: SceneNode, state: string) {
  node.setPluginData("state", state);
}

export function setTextFromApi(node: SceneNode, key: string) {
  node.setPluginData("textFromApi", key);
}

interface ComponentData {
  states: string[];
  elementType: Record<string, "div" | "button" | "label" | "input" | "output">;
  ignoredStyles: Record<string, Array<keyof CSSProperties>>;
}

const slider: ComponentData = {
  states: ["idle", "focus", "dragging"],
  elementType: {
    root: "div",
    label: "label",
    control: "div",
    track: "div",
    range: "div",
    thumb: "div",
    input: "input",
    output: "output",
  },
  ignoredStyles: {
    range: ["width"],
  },
};

export const componentDatas: Record<string, ComponentData> = {
  slider,
};
