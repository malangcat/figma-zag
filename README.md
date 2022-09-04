# figma-zag

Figma plugin that converts a Figma component into a React Preview using [Zag.js](https://zagjs.com/).

By mapping data-part to Frame and machine state to Variant, the component can be translated from Figma without ad-hoc.

## Limitations

Each variant corresponds to a machine state, so it can't represent the computed state yet.
