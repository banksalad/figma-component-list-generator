console.log(`Extract Components in ${figma.currentPage.name}`);

// Each ComponentSet has variant components as its children
const componentSetNodeList: ComponentSetNode[] = [];
// Includes variant component of ComponentSet
const componentNodeList: ComponentNode[] = [];
figma.currentPage
  .findAll()
  .forEach(node => {
    switch (node.type) {
      case 'COMPONENT_SET': {
        componentSetNodeList.push(node);
        break;
      }
      case 'COMPONENT': {
        componentNodeList.push(node);
        break;
      }
    }
  });

// Excludes components which must not be included such as X00_, 999_, 경훈, ...
const validComponentPrefixRegex = new RegExp(`^(\\d{3})(?<!\\d00)(?<!999)_.+`);
// Component names may not be trimmed enough(start / ends with spacings).
const trackedComponentList: (ComponentNode | ComponentSetNode)[] = [];

console.log(`ComponentSetNode(${componentSetNodeList.length})`);
componentSetNodeList.forEach(componentSetNode => {
  // utilize this value later if needed
  const trimmedName = componentSetNode.name.trim();
  const validComponentNumber = trimmedName.match(validComponentPrefixRegex)?.[1];
  if (validComponentNumber != null) {
    console.log(`- [tracked] ${trimmedName} (${componentSetNode.children.length} variants)`);
    trackedComponentList.push(componentSetNode);
  } else {
    console.log(`- [invalid] ${trimmedName} does not match ${validComponentPrefixRegex}`);
  }
  componentSetNode.children.forEach(componentNode => {
    console.log(`- [variant] ${componentNode.name.trim()}`);
  });
});

console.log(`ComponentNode(${componentNodeList.length})`);
componentNodeList.forEach(componentNode => {
  const trimmedName = componentNode.name.trim();
  const parent = componentNode.parent;
  if (parent != null && parent.type === 'COMPONENT_SET') { // exclude variant component
    console.log(`- [ignored] ${trimmedName} is already added by component set ${parent.name}`);
  } else {
    // utilize this value later if needed
    const validComponentNumber = trimmedName.match(validComponentPrefixRegex)?.[1];
    if (validComponentNumber != null) {
      console.log(`- [tracked] ${trimmedName}`);
      trackedComponentList.push(componentNode);
    } else {
      console.log(`- [invalid] ${trimmedName} does not match ${validComponentPrefixRegex}`);
    }
  }
});

// Clear list to prevent mistakes
componentSetNodeList.length = 0;
componentNodeList.length = 0;
console.log(`Tracked Component(Set)Node(${trackedComponentList.length})`);

// Sort tracked components in lexicographical order
const trackedComponentNameList = trackedComponentList
  .map(node => node.name.trim())
  .sort((a, b) => a.localeCompare(b))
  .reduce((previousValue, currentValue) => previousValue + `${currentValue}\n`, '');
console.log(trackedComponentNameList);

figma.showUI(__html__);
figma.ui.postMessage(trackedComponentNameList);
figma.ui.onmessage = (event) => {
  console.log(event.pluginMessage);
  figma.closePlugin();
};
