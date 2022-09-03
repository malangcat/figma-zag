import { CSSProperties } from "react";
import { ComponentSpec, TreeNode } from "../shared/tree";
import { componentDatas } from "./data";

const justifyContentCssValues = {
  MIN: "flex-start",
  MAX: "flex-end",
  CENTER: "center",
  SPACE_BETWEEN: "space-between",
} as const;

const alignItemsCssValues = {
  MIN: "flex-start",
  MAX: "flex-end",
  CENTER: "center",
} as const;

const textAlignCssValues = {
  LEFT: "left",
  RIGHT: "right",
  CENTER: "center",
  JUSTIFIED: "justify",
} as const;

const textVerticalAlignCssValues = {
  TOP: "top",
  CENTER: "middle",
  BOTTOM: "bottom",
} as const;

const textDecorationCssValues = {
  UNDERLINE: "underline",
  STRIKETHROUGH: "line-through",
} as const;

function handleSolidPaint(paint: SolidPaint | undefined) {
  if (!paint) {
    return "transparent";
  }
  const { r, g, b } = paint.color;
  const a = paint.opacity;
  return `rgba(${r * 255}, ${g * 255}, ${b * 255}, ${a})`;
}

function handleLineHeight(lineHeight: LineHeight) {
  if (lineHeight.unit === "AUTO") {
    return;
  }
  return lineHeight.unit === "PIXELS"
    ? lineHeight.value
    : lineHeight.value + "%";
}

function handleWidth(node: FrameNode | ComponentNode): CSSProperties {
  if (node.layoutGrow === 1) {
    return {
      width: "100%",
    };
  }
  return {
    width: node.width,
  };
}

function handleHeight(node: FrameNode | ComponentNode): CSSProperties {
  if (node.layoutGrow === 1) {
    return {
      height: "100%",
    };
  }
  return {
    height: node.height,
  };
}

function handleFlex(node: FrameNode | ComponentNode): CSSProperties {
  if (node.layoutMode !== "NONE") {
    return {
      display: "flex",
      flexDirection: node.layoutMode === "VERTICAL" ? "column" : "row",
      justifyContent: justifyContentCssValues[node.primaryAxisAlignItems],
      alignItems: alignItemsCssValues[node.counterAxisAlignItems],
    };
  }
  return {};
}

function handleFlexGap(node: FrameNode | ComponentNode): CSSProperties {
  if (node.primaryAxisAlignItems !== "SPACE_BETWEEN" && node.itemSpacing > 0) {
    return {
      gap: node.itemSpacing,
    };
  }
  return {};
}

function handlePadding(node: FrameNode | ComponentNode): CSSProperties {
  if (
    node.paddingTop === node.paddingBottom &&
    node.paddingTop === node.paddingLeft &&
    node.paddingTop === node.paddingRight &&
    node.paddingTop > 0
  ) {
    return {
      padding: node.paddingTop,
    };
  }
  if (
    node.paddingTop === node.paddingBottom &&
    node.paddingLeft === node.paddingRight
  ) {
    return {
      padding: `${node.paddingTop}px ${node.paddingLeft}px`,
    };
  }
  return {
    paddingTop: node.paddingTop,
    paddingBottom: node.paddingBottom,
    paddingLeft: node.paddingLeft,
    paddingRight: node.paddingRight,
  };
}

function handleTextDecoration(node: TextNode): CSSProperties {
  if (
    node.textDecoration === "STRIKETHROUGH" ||
    node.textDecoration === "UNDERLINE"
  ) {
    return {
      textDecoration: textDecorationCssValues[node.textDecoration],
    };
  }
  return {};
}

function getFrameStyle(node: FrameNode | ComponentNode): CSSProperties {
  return {
    ...handleWidth(node),
    ...handleFlex(node),
    ...handleFlexGap(node),
    ...handleHeight(node),
    ...handlePadding(node),
    backgroundColor: handleSolidPaint(node.fills[0] as SolidPaint),
    borderRadius: node.cornerRadius as number,
    borderColor: handleSolidPaint(node.strokes[0] as SolidPaint),
    borderWidth: node.strokes.length > 0 ? (node.strokeWeight as number) : 0,
    borderStyle: "solid",
  };
}

function getTextStyle(node: TextNode): CSSProperties {
  return {
    ...handleTextDecoration(node),
    fontFamily: (node.fontName as FontName).family,
    fontSize: node.fontSize as number,
    fontWeight: (node.fontName as FontName).style,
    lineHeight: handleLineHeight(node.lineHeight as LineHeight),
    color: handleSolidPaint(node.fills[0]),
    textAlign: textAlignCssValues[node.textAlignHorizontal],
    verticalAlign: textVerticalAlignCssValues[node.textAlignVertical],
  };
}

function getNodeStyle(node: SceneNode): CSSProperties {
  if (node.type === "FRAME" || node.type === "COMPONENT") {
    return getFrameStyle(node);
  }
  if (node.type === "TEXT") {
    return getTextStyle(node);
  }
  return {};
}

export function buildComponentSpec(
  root: FrameNode | ComponentSetNode,
): ComponentSpec {
  const treePerState: Record<string, TreeNode> = {};
  const component = root.getPluginData("component");

  for (const child of root.children) {
    const state = child.getPluginData("state");

    const componentData = componentDatas[component];

    function rec(node: SceneNode): TreeNode {
      const children =
        "children" in node
          ? node.children.length > 0
            ? node.children.map(rec)
            : undefined
          : node.type === "TEXT"
          ? node.characters
          : undefined;
      const part = node.getPluginData("part");
      const elementType = componentData.elementType[part] ?? "div";
      const style = getNodeStyle(node as SceneNode);
      const textFromApi = node.getPluginData("textFromApi");
      const ignoredStyles = componentData.ignoredStyles[part] ?? [];
      ignoredStyles.forEach((key: keyof CSSProperties) => {
        delete style[key];
      });
      return {
        elementType,
        part,
        children,
        textFromApi,
        style,
      };
    }

    treePerState[state] = rec(child);
  }

  return {
    component,
    treePerState,
  };
}
