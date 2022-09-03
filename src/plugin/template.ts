import { componentDatas } from "./data";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export function createTemplate(component: string) {
  const data = componentDatas[component];
  const parts = Object.keys(data.elementType);
  const components: ComponentNode[] = [];

  function createTemplate(state: string) {
    const nodes: Record<string, SceneNode> = {};

    parts.forEach((part) => {
      if (data.figmaNodeType[part] === "COMPONENT") {
        const component = figma.createComponent();
        component.name = "State=" + capitalize(state);
        component.fills = [];
        component.setPluginData("part", part);
        component.setPluginData("state", state);
        nodes[part] = component;
        components.push(component);
      }
      if (data.figmaNodeType[part] === "FRAME") {
        const frame = figma.createFrame();
        frame.name = capitalize(part);
        frame.fills = [];
        frame.setPluginData("part", part);
        nodes[part] = frame;
      }
      if (data.figmaNodeType[part] === "TEXT") {
        const text = figma.createText();
        text.name = capitalize(part);
        text.setPluginData("part", part);
        nodes[part] = text;
      }
      if (data.parent[part]) {
        const parent = nodes[data.parent[part]!];
        if (!("children" in parent)) {
          throw new Error("Parent is not a frame");
        }
        parent.appendChild(nodes[part]);
      }
    });
  }

  data.states.forEach(createTemplate);
  const componentSetNode = figma.combineAsVariants(
    components,
    figma.currentPage,
  );
  componentSetNode.name = capitalize(component);
  componentSetNode.setPluginData("component", component);
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
