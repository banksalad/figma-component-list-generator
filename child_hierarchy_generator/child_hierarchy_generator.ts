console.log(`Extract Components in ${figma.currentPage.name}`);

const matcingTarget = ""

class BplComponent {
  categoryId: number
  name: string
  childrens: Array<BplComponent>

  constructor(node: any) {
    const rawName = node.name.trim();
    const statusIndex = rawName.lastIndexOf("(");
    this.name = statusIndex > -1 ? rawName.substring(0, statusIndex) : node.name;
    this.categoryId = +this.name.substring(0, 3);
    this.childrens = filteringVariant(node);

    if (this.name == matcingTarget) console.log(`finialize ${this.categoryId} / ${node.name} / ${this.childrens.length}`);
  }
}

function filteringVariant(node: SceneNode): Array<BplComponent> {
  if (hasChildren(node)) {
    /**
     * 205_ListItem/XXLarge1 과 같이 컴포넌트 하위 child가 모두 Component인 경우
     */
    let isAllVariant = node.children.length > 0;
    node.children.forEach((child) => {
      isAllVariant = isAllVariant && (child.type != "COMPONENT" || !isComponent(child));
    });

    if (node.name == matcingTarget) console.log(`target is All Variant : ${isAllVariant}`);

    if (isAllVariant) {
      return findChilds(node.children[0], node.name);
    }
    else {
      const childrens = Array();
      node.children.forEach((child: any) => childrens.push(...findChilds(child, node.name)));
      return childrens;
    }
  }

  return Array();
}

function findChilds(node: SceneNode, componentName: string): Array<BplComponent> {

  const childs = Array<BplComponent>();

  if (isComponent(node)) {
    childs.push(new BplComponent(node));

    if (componentName == matcingTarget) {
      console.log(`child finded : ${node.name}`);
    }
    return childs;
  }

  if (componentName == matcingTarget) {
    console.log(`target type : ${node.type} / ${node.name}`);
  }

  if (hasChildren(node)) {

    if (componentName == matcingTarget) {
      console.log(`not component, try find child : ${node.name} / ${node.type}`);
    }

    node.children.forEach(child => {
      childs.push(...findChilds(child, componentName));
    });
  }

  return childs;
}

function isComponent(node: SceneNode): boolean {
  const id = node.name.length > 3 ? +node.name.substring(0, 3) : NaN;

  return !isNaN(id) && id > 101 && node.name.substring(3, 4) == "_";
}

function hasChildren(node: any): node is ChildrenMixin {
  return 'children' in node
}

/**
 * 루트 레벨에서 Bpl Component인 목록을 가져온다. 이후 해당 컴포넌트들 스스로의 Child는 각각의 constructor 에서 처리한다.
 */
const componentList = figma.currentPage
  .findAll()
  .filter(node => {
    return (node.type == 'COMPONENT' || node.type == 'COMPONENT_SET') && isComponent(node);
  })
  .map(node => {
    return new BplComponent(node)
  })

/**
 * 컴포넌트 이름 <-> 컴포넌트 child 목록을 매칭하는 key-value 
 */
const results: { [key: string]: Array<string> } = {}

componentList.forEach(component => {
  if (results[component.name] == undefined) {
    results[component.name] = component.childrens.map(child => child.name)
  }
});

const target = matcingTarget.length == 0 ? results : results[matcingTarget];

console.log(JSON.stringify(target, null, 4))

figma.closePlugin();











