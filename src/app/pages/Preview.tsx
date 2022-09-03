import * as React from "react";
import { TreeNode } from "../../shared/tree";
import { handleFigmaMessage, requestTree } from "../request";
import * as slider from "@zag-js/slider";
import { useMachine, normalizeProps, mergeProps } from "@zag-js/react";

function useTree(state: string | null) {
  const [treePerState, setTreePerState] = React.useState<Record<
    string,
    TreeNode
  > | null>(null);

  React.useEffect(() => {
    const handleMessage = handleFigmaMessage(
      "get.selected.tree",
      (pluginMessage) => {
        const { message } = pluginMessage;
        if (message != null) {
          setTreePerState(message);
        }
      },
    );
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  if (treePerState == null || state == null) {
    return { tree: undefined, stateError: false };
  }

  return {
    tree: treePerState[state],
    stateError: treePerState != null && !treePerState[state],
  };
}

function useComponent(
  tree: TreeNode | undefined,
  api: ReturnType<
    typeof slider.connect<
      JSX.IntrinsicElements & {
        element: React.HTMLAttributes<HTMLElement>;
      }
    >
  >,
) {
  if (!tree) {
    return;
  }

  function rec(node: TreeNode, key: React.Key | undefined): React.ReactNode {
    const { children, textFromApi, elementType: Element, part, style } = node;
    const props = mergeProps({ style }, part ? api[part + "Props"] : {}, {
      style: { visibility: "show" },
    });
    return (
      <Element key={key} {...props}>
        {textFromApi
          ? api[textFromApi]
          : typeof children === "undefined"
          ? undefined
          : typeof children === "string"
          ? children
          : children.length === 1
          ? rec(children[0], undefined)
          : children.map(rec)}
      </Element>
    );
  }

  return rec(tree, undefined);
}

const Preview = ({}) => {
  const [state, send] = useMachine(
    slider.machine({
      id: React.useId(),
    }),
  );
  const api = slider.connect(state, send, normalizeProps);
  const { tree, stateError } = useTree(state.value);
  const component = useComponent(tree, api);

  return (
    <div>
      <button onClick={requestTree}>Build</button>
      <div style={{ padding: 24 }}>
        {!stateError ? (
          component
        ) : (
          <div>State {state.value} is not defined</div>
        )}
      </div>
    </div>
  );
};

export default Preview;
