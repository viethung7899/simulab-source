import { Rectangle } from 'pixi.js';
import { Vector2D } from './Vector2D';

export class Entity {
  protected _position: Vector2D;

  constructor(x: number, y: number) {
    this._position = new Vector2D(x, y);
  }

  get position() {
    return this._position;
  }
}

class Node<T> {
  public value: T;
  public prev: Node<T>;
  public next: Node<T>;

  constructor(value: T, prev: Node<T> = null, next: Node<T> = null) {
    this.value = value;
    this.prev = prev;
    this.next = next;
  }
}

export type Client<T extends Entity> = {
  entity: T;
  row: number;
  col: number;
  node: Node<Client<T>> | undefined;
};

export class SpatialHashGrid<T extends Entity> {
  private _bounds: Rectangle;
  private _rows: number;
  private _cols: number;
  private _queryIds: number;
  private _cells: Node<Client<T>>[][];

  constructor(bounds: Rectangle, rows: number, cols: number) {
    this._bounds = bounds;
    this._rows = rows;
    this._cols = cols;

    this._cells = [...Array(rows)].map<Node<Client<T>>[]>((_) =>
      [...Array(cols)].map<Node<Client<T>>>((_) => null),
    );
  }

  newClient(entity: T): Client<T> {
    return {
      entity,
      row: -1,
      col: -1,
      node: null,
    };
  }

  addClient(client: Client<T>) {
    const [row, col] = this._getCellIndex(client.entity.position);
    const head = new Node(client, null, this._cells[row][col]);
    if (this._cells[row][col]) this._cells[row][col].prev = head;
    this._cells[row][col] = head;
    client.row = row;
    client.col = col;
    client.node = head;
    // console.log(`Added (${client.entity.position.x, client.entity.position.y}) at (${row}, ${col})`);
  }

  findNearBy(position: Vector2D, limit: number) {
    const [minRow, minCol] = this._getCellIndex(
      position.clone().add(new Vector2D(-limit / 2)),
    );
    const [maxRow, maxCol] = this._getCellIndex(
      position.clone().add(new Vector2D(limit / 2)),
    );

    const clients: Client<T>[] = [];

    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol; col <= maxCol; col++) {
        let head = this._cells[row][col];
        while (head) {
          clients.push(head.value);
          head = head.next;
        }
      }
    }

    return clients;
  }

  removeClient(client: Client<T>) {
    const { row, col, node } = client;
    if (node.next) node.next.prev = node.prev;
    if (node.prev) node.prev.next = node.next;
    else this._cells[row][col] = node.next;

    client.row = null;
    client.col = null;
    client.node = null;
  }

  updateClient(client: Client<T>) {
    const [row, col] = this._getCellIndex(client.entity.position);

    // Check before remove
    if (client.row === row && client.col === col) return;

    this.removeClient(client);
    this.addClient(client);
  }

  _getCellIndex({ x, y }: Vector2D) {
    let row, col;
    if (x <= this._bounds.x) col = 0;
    else if (x >= this._bounds.x + this._bounds.width) col = this._cols - 1;
    else
      col = Math.floor(
        (x - this._bounds.x) / (this._bounds.width / this._cols),
      );

    if (y <= this._bounds.y) row = 0;
    else if (y >= this._bounds.y + this._bounds.height) row = this._rows - 1;
    else
      row = Math.floor(
        (y - this._bounds.y) / (this._bounds.height / this._rows),
      );

    return [row, col];
  }
}
