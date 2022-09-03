import * as React from "react";
import {
  requestCreateSlider,
  requestSetState,
  requestSetTextFromApi,
} from "../request";

const Create = ({}) => {
  return (
    <div>
      <div>
        <button onClick={requestCreateSlider}>Create slider template</button>
      </div>
      <div>
        <button onClick={() => requestSetState("idle")}>State=idle</button>
        <button onClick={() => requestSetState("focus")}>State=focus</button>
        <button onClick={() => requestSetState("dragging")}>
          State=dragging
        </button>
      </div>
      <div>
        <button onClick={() => requestSetTextFromApi("value")}>
          Text=api.value
        </button>
        <button onClick={() => requestSetTextFromApi("")}>
          Text=from figma
        </button>
      </div>
    </div>
  );
};

export default Create;
