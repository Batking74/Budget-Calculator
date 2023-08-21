export default class LinkedList {
    constructor() {
        this.head = null;
        this.length = 0;
    }
    
    getIndex(index) {
        let originalNode = this.head;
        if(index < 0 || index >= this.length) return null;
        for(let i = 0; i < index; i++) originalNode = originalNode.nextNode;
        return originalNode;
    }

    insertAtHead(newNodeValue) {
        const newNode = new Node(newNodeValue, this.head);
        this.head = newNode;
        this.length++;
    }

    insertAtIndex(index, newNodeValue) {
        if(index == 0) return this.insertAtHead(newNodeValue);
        let prevNode = this.getIndex(index - 1);
        if(prevNode === null) return null;
        prevNode.nextNode = new Node(newNodeValue, prevNode.nextNode);
        this.length++;
    }

    print() {
        let output = '';
        let originalNode = this.head;
        while(originalNode) {
            output = `${output} ${originalNode.value} ->`;
            originalNode = originalNode.nextNode;
        }
        console.log(`${output} ${originalNode}`);
    }

    removeHead() {
        this.head = this.head.nextNode;
        this.length--;
    }

    removeIndex(index) {
        if(index === 0) return this.removeHead();
        const prevNode = this.getIndex(index - 1);
        if(prevNode === null) return null;
        prevNode.nextNode = prevNode.nextNode.nextNode;
        this.length--;
    }
}

export class Node {
    constructor(value, nextNode) {
        this.value = value;
        this.nextNode = nextNode;
    }
}