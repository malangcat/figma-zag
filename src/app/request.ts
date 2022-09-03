export function handleFigmaMessage(
  type: string,
  fn: (pluginMessage: { type: string; [key: string]: any }) => void,
): (event: MessageEvent) => void {
  return (event: MessageEvent) => {
    if (event.origin !== "https://www.figma.com") {
      return;
    }
    if (event.data.pluginMessage.type !== type) {
      return;
    }
    fn(event.data.pluginMessage);
  };
}

export function requestCreateSlider() {
  parent.postMessage({ pluginMessage: { type: "post.createSlider" } }, "*");
}

export function requestCreateCheckbox() {
  parent.postMessage({ pluginMessage: { type: "post.createCheckbox" } }, "*");
}

export function requestSetPart(part: string) {
  parent.postMessage(
    { pluginMessage: { type: "post.selected.part", part } },
    "*",
  );
}

export function requestSetState(state: string) {
  parent.postMessage(
    { pluginMessage: { type: "post.selected.state", state } },
    "*",
  );
}

export function requestSetTextFromApi(key: string) {
  parent.postMessage(
    { pluginMessage: { type: "post.selected.textFromApi", key } },
    "*",
  );
}

export function requestComponentSpec() {
  parent.postMessage(
    { pluginMessage: { type: "get.selected.componentSpec" } },
    "*",
  );
}
