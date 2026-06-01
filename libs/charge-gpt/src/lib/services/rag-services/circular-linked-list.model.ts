export class CircularLinkedList {
    private head: any;
    private tail: any;

    constructor() {
        this.head = null;
        this.tail = null;
    }

    addNode(value) {
        const newNode = {
            value,
            next: null,
        };

        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
            this.tail.next = this.head;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
            this.tail.next = this.head;
        }
    }

    removeNode(value) {
        if (this.head.value === value) {
            this.head = this.head.next;
            this.tail.next = this.head;
            return;
        }

        let currentNode = this.head;
        let previousNode = null;

        while (currentNode.value !== value) {
            previousNode = currentNode;
            currentNode = currentNode.next;
        }

        previousNode.next = currentNode.next;
    }

    getNextNode() {
        if (!this.head) {
            return null;
        }

        const currentNode = this.head;
        this.head = this.head.next;

        return currentNode;
    }
}