import * as React from "react";
import { ComponentSpec, TreeNode } from "../../shared/tree";
import { handleFigmaMessage, requestComponentSpec } from "../request";
import * as slider from "@zag-js/slider";
import * as checkbox from "@zag-js/checkbox";
import { useMachine, normalizeProps, mergeProps } from "@zag-js/react";

function useComponentSpec() {
  const [componentSpec, setComponentSpec] = React.useState<ComponentSpec>();

  React.useEffect(() => {
    const handleMessage = handleFigmaMessage(
      "get.selected.componentSpec",
      (pluginMessage) => {
        const { message } = pluginMessage;
        if (message != null) {
          setComponentSpec(message);
        }
      },
    );
    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  return componentSpec;
}

function useTree(
  componentSpec: ComponentSpec | null | undefined,
  state: string | null | undefined,
) {
  if (componentSpec == null || state == null) {
    return { tree: undefined, stateError: false };
  }

  const { treePerState } = componentSpec;

  return {
    tree: treePerState[state],
    stateError: treePerState != null && !treePerState[state],
  };
}

function useComponentMachine(component: string | null | undefined) {
  const [sliderState, sliderSend] = useMachine(
    slider.machine({
      id: React.useId(),
    }),
  );
  const sliderApi = slider.connect(sliderState, sliderSend, normalizeProps);

  const [checkboxState, checkboxSend] = useMachine(
    checkbox.machine({
      id: React.useId(),
    }),
  );
  const checkboxApi = checkbox.connect(
    checkboxState,
    checkboxSend,
    normalizeProps,
  );

  if (component === "slider") {
    return {
      state: sliderState.value,
      api: sliderApi,
    };
  }
  if (component === "checkbox") {
    return {
      state: checkboxState.value,
      api: checkboxApi,
    };
  }
  return {
    state: null,
    api: undefined,
  };
}

function useComponent(
  tree: TreeNode | null | undefined,
  api:
    | ReturnType<typeof slider.connect | typeof checkbox.connect>
    | null
    | undefined,
) {
  if (tree == null || api == null) {
    return;
  }

  function rec(node: TreeNode, key: React.Key | undefined): React.ReactNode {
    const { children, textFromApi, elementType: Element, part, style } = node;
    const props = mergeProps({ style }, part ? api![part + "Props"] : {}, {
      style: { visibility: "show" },
    });
    return (
      <Element key={key} {...props}>
        {textFromApi
          ? api![textFromApi]
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
  const componentSpec = useComponentSpec();
  const { state, api } = useComponentMachine(componentSpec?.component);
  const { tree, stateError } = useTree(componentSpec, state);
  const component = useComponent(tree, api);

  return (
    <div>
      <h3>Preview</h3>
      <button onClick={requestComponentSpec}>Build</button>
      <div style={{ padding: 24 }}>
        {!stateError ? component : <div>State {state} is not defined</div>}
      </div>
    </div>
  );
};

export default Preview;
