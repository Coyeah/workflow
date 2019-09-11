import React from 'react';

export const HEAD_KEY_ID = 'LINKED_OWN_BEGIN_NODER';
export type TNoderPro = Noder | null;
export type TRenderComponent = React.ReactElement | null;
export interface ILinkedRender {
  route: React.ComponentType<any>;
  routeProps: object;
  condition: React.ComponentType<any>;
  conditionProps: object;
  conditionItem: React.ComponentType<any>;
}

export class Noder {
  id: string;
  parent: TNoderPro;
  next: TNoderPro;
  prevSib: TNoderPro;
  sibling: TNoderPro;
  constructor(id: string) {
    this.id = id;
    this.parent = null;
    this.next = null;
    this.prevSib = null;
    this.sibling = null;
  }
}

function loop(targetNoder: Noder, func?: Function) {
  let localNoder: Noder = targetNoder;
  while (localNoder.next !== null) {
    localNoder = localNoder.next;
    func && func(localNoder.id, localNoder);
    if (localNoder.sibling !== null) {
      let tempNoder = localNoder;
      while (tempNoder.sibling !== null) {
        tempNoder = tempNoder.sibling;
        func && func(tempNoder.id, tempNoder);
        loop(tempNoder, func);
      }
    }
  }
}

export class Linked {
  head: Noder;
  constructor() {
    this.head = new Noder(HEAD_KEY_ID);
  }
  find(item: string) {
    let currNode = this.head;
    let resultNoder: TNoderPro = null;
    if (item === HEAD_KEY_ID) return this.head;

    function loop(targetNoder: Noder) {
      let localNoder: TNoderPro = targetNoder;
      while (localNoder.next !== null && resultNoder === null) {
        localNoder = localNoder.next;
        if (localNoder.id === item) resultNoder = localNoder;
        if (localNoder.sibling !== null) {
          let tempNoder = localNoder;
          while (tempNoder.sibling !== null && resultNoder === null) {
            tempNoder = tempNoder.sibling;
            if (tempNoder.id === item) resultNoder = tempNoder
            loop(tempNoder);
          }
        }
      }
    }
    loop(currNode);
    return resultNoder;
  }
  insert(newItem: string, item: string | undefined | null | false, isSibling?: boolean) {
    const next = !!isSibling ? 'sibling' : 'next';
    const parent = !!isSibling ? 'prevSib' : 'parent';
    if (!item) item = HEAD_KEY_ID;

    let newNoder: Noder = new Noder(newItem);
    let currNoder: Noder = this.find(item) as Noder;

    newNoder[next] = currNoder[next];
    currNoder[next] = newNoder;
    newNoder[parent] = currNoder;
    if (newNoder[next] !== null) {
      (newNoder[next] as Noder)[parent] = newNoder;
    }
  }
  remove(item: string) {
    let currNode: Noder = this.find(item) as Noder;
    let { parent, next, prevSib, sibling } = currNode as Noder;

    if (parent !== null) parent.next = next;
    if (next !== null) next.parent = parent;
    if (prevSib !== null) prevSib.sibling = sibling;
    if (sibling !== null) sibling.prevSib = prevSib;

    currNode.parent = null;
    currNode.next = null;
    currNode.prevSib = null;
    currNode.sibling = null;
  }
  display() {
    console.info();
    console.info('////////////////////////////////////');
    console.info('//////// LINK LIST DISPLAY /////////');
    console.info('////////////////////////////////////');
    console.info();
    
    let currNoder: Noder = this.head;
    let count = 0;   
    const func = (id: string, noder: Noder) => {
      count++;
      console.info(noder);
      console.info('============', noder.id, '============');
    } 
    loop(currNoder, func);

    console.info();
    console.info('>>>>>>>>>> NODER COUNT ' + count + ' <<<<<<<<<<');
    console.info();
  }
  forEach(func: Function) {
    let currNoder: Noder = this.head;
    loop(currNoder, func);
  }
  render({
    route: Route,
    condition: Condition,
    conditionItem: ConditionItem,
    routeProps = {},
    conditionProps = {}
  }: ILinkedRender) {
    let currNode = this.head;

    function loop(targetNoder: Noder) {
      let localComponent: TRenderComponent = null;
      let localNoder: Noder = targetNoder;
      while (localNoder.next !== null) {
        localNoder = localNoder.next;
        if ( localNoder.sibling !== null) {
          let tempNoder = localNoder;
          let tempComponent: TRenderComponent = null;
          while (tempNoder.sibling !== null) {
            tempNoder = tempNoder.sibling;
            let tempOwnComponet: TRenderComponent = (
              <ConditionItem>
                <Route key={tempNoder.id} id={tempNoder.id} {...routeProps}  />
                {loop(tempNoder)}
              </ConditionItem>
            );
            tempComponent = (
              <>
                {tempOwnComponet}
                {tempComponent}
              </>
            )
          }
          localComponent = (
            <>
              {localComponent}
              <Condition key={localNoder.id} id={localNoder.id} {...conditionProps} >
                {tempComponent}
              </Condition>
            </>
          )
        } else {
          localComponent = (
            <>
              {localComponent}
              <Route key={localNoder.id} id={localNoder.id} {...routeProps} />
            </>
          );
        }
      }
      return localComponent;
    }

    return loop(currNode);
  }
}