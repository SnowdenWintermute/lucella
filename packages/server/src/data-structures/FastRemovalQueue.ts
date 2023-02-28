// adapted from chat-gpt

import isEqual from "lodash.isequal";

type QueueNode<T> = { value: T; next: QueueNode<T> | null; prev: QueueNode<T> | null };

export class FastRemovalQueue<T> {
  head: QueueNode<T> | null = null;
  tail: QueueNode<T> | null = null;
  size = 0;
  map = new Map();

  enqueue(value: any) {
    const node: QueueNode<T> = { value, next: null, prev: null };

    if (!this.head) {
      this.head = node;
      this.tail = node;
    } else {
      this.tail!.next = node;
      node.prev = this.tail;
      this.tail = node;
    }
    this.map.set(value, node);
    this.size += 1;
  }

  dequeue() {
    if (!this.head) return null;

    const { value } = this.head;
    this.map.delete(value);

    if (isEqual(this.head, this.tail)) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head.next;
      this.head!.prev = null;
    }
    this.size -= 1;
    return value;
  }

  remove(value: any) {
    const node = this.map.get(value);
    if (!node) return false;

    this.map.delete(value);

    if (isEqual(node, this.head)) {
      this.head = node.next;
      if (this.head) this.head.prev = null;
      else this.tail = null;
    } else if (node === this.tail) {
      this.tail = node.prev;
      if (this.tail) this.tail.next = null;
      else this.head = null;
    } else {
      node.prev.next = node.next;
      node.next.prev = node.prev;
    }
    this.size -= 1;
    return value;
  }

  isEmpty() {
    return this.size === 0;
  }

  getSize() {
    return this.size;
  }
}
