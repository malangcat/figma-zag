import { CSSProperties } from "react";

interface ComponentData {
  states: string[];
  elementType: Record<
    string,
    "div" | "span" | "button" | "label" | "input" | "output"
  >;
  figmaNodeType: Record<string, SceneNode["type"]>;
  parent: Record<string, string | null>;
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
  figmaNodeType: {
    root: "COMPONENT",
    label: "TEXT",
    control: "FRAME",
    track: "FRAME",
    range: "FRAME",
    thumb: "FRAME",
    input: "FRAME",
    output: "TEXT",
  },
  parent: {
    root: null,
    label: "root",
    control: "root",
    track: "control",
    range: "track",
    thumb: "control",
    input: "thumb",
    output: "root",
  },
  ignoredStyles: {
    range: ["width"],
  },
};

const checkbox: ComponentData = {
  states: ["checked", "unchecked"],
  elementType: {
    root: "label",
    label: "span",
    control: "div",
    input: "input",
  },
  figmaNodeType: {
    root: "COMPONENT",
    label: "TEXT",
    control: "FRAME",
    input: "FRAME",
  },
  parent: {
    root: null,
    label: "root",
    control: "root",
    input: "root",
  },
  ignoredStyles: {},
};

export const componentDatas: Record<string, ComponentData> = {
  slider,
  checkbox,
};
