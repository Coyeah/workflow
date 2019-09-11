const HEAD_KEY_ID = 'LINKED_OWN_BEGIN_NODER';

class Noder {
  constructor(id) {
    this.id = id;
    this.parent = null;
    this.next = null;
    this.sibling = null;
    this.prevSib = null;
  }
}

class Linked {
  constructor() {
    this.head = new Noder(HEAD_KEY_ID);
  }
  find(item) {
    let currNoder = this.head;
    let resultNoder = null;

    if (item === HEAD_KEY_ID) return this.head;
    
    function loop(targetNoder) {
      let localNoder = targetNoder;
      while (localNoder.next !== null && resultNoder === null) {
        localNoder = localNoder.next;
        if (localNoder.id === item) {
          resultNoder = localNoder;
        }
        if (localNoder.sibling !== null) {
          let tempNoder = localNoder;
          while (tempNoder.sibling !== null && resultNoder === null) {
            tempNoder = tempNoder.sibling;
            if (tempNoder.id === item) {
              resultNoder = tempNoder;
            }
            loop(tempNoder);
          }
        }
      }
    }
    loop(currNoder);
    return resultNoder;
  }
  insert(newItem, item, isSibling) {
    let newNoder = new Noder(newItem);
    let currNoder = this.find(item);
    if (!!isSibling) {
      newNoder.sibling = currNoder.sibling;
      currNoder.sibling = newNoder;
      newNoder.prevSib = currNoder;
      if (newNoder.sibling !== null) {
        newNoder.sibling.prevSib = newNoder;
      }
    } else {
      newNoder.next = currNoder.next;
      currNoder.next = newNoder;
      newNoder.parent = currNoder;
      if (newNoder.next !== null) {
        newNoder.next.parent = newNoder;
      }
    }
  }
  remove(item) {
    let currNode = this.find(item);
    let { parent, next, prevSib, sibling } = currNode;
    
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
    
    let currNoder = this.head;
    function loop(targetNoder) {
      let localNoder = targetNoder;
      while (localNoder.next !== null) {
        localNoder = localNoder.next;
        console.info(localNoder);
        console.info('============', localNoder.id, '============');
        if (localNoder.sibling !== null) {
          let tempNoder = localNoder;
          while (tempNoder.sibling !== null) {
            tempNoder = tempNoder.sibling;
            console.info(tempNoder);
            console.info('============', tempNoder.id, '============');
            loop(tempNoder);
          }
        }
      }
    }
    loop(currNoder);
  }
}

let linklist = new Linked();
linklist.insert('a', HEAD_KEY_ID);
linklist.insert('b', 'a');
linklist.insert('b1', 'b', true);
linklist.insert('b2', 'b1', true);
linklist.insert('c', 'b');
linklist.insert('e', 'b1');
linklist.insert('f', 'b2');

linklist.display();

// let target = linklist.find('b2');
// console.log('target: ', target);