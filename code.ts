
const nodes: SceneNode[] = [];
let data = figma.currentPage
  .findAll(node => node.type === "COMPONENT")
  .map(node => node.name)
  .reduce((accum, currentValue) => accum + currentValue + "\n", "")

figma.showUI(__html__)
figma.ui.postMessage(data)
figma.ui.onmessage = (message) => {
  figma.closePlugin();
}

