import { CircularLinkedList } from './circular-linked-list.model';

describe('CircularLinkedList', () => {
    it('it should return value circularly in the list', () => {
        const list = new CircularLinkedList();
        list.addNode(1);
        list.addNode(2);
        
        expect(list.getNextNode().value).toBe(1);
        expect(list.getNextNode().value).toBe(2);
        expect(list.getNextNode().value).toBe(1);
        expect(list.getNextNode().value).toBe(2);
    });
});