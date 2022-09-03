import { CSSProperties } from "react";

export interface TreeNode {
  elementType: "div" | "button" | "span" | "input" | "output" | "label";
  part: string;
  children: TreeNode[] | string | undefined;
  textFromApi: string | undefined;
  style: CSSProperties;
}
