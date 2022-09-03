import * as React from "react";
import {
  requestCreateCheckbox,
  requestCreateSlider,
  requestSetState,
  requestSetTextFromApi,
} from "../request";

const Create = ({}) => {
  return (
    <div>
      <h3>Slider</h3>
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
      <h3>Checkbox</h3>
      <div>
        <button onClick={requestCreateCheckbox}>
          Create checkbox template
        </button>
      </div>
      <div>
        <button onClick={() => requestSetState("unchecked")}>
          State=unchecked
        </button>
        <button onClick={() => requestSetState("checked")}>
          State=checked
        </button>
      </div>
    </div>
  );
};

export default Create;
