export class Block {
  constructor(
    public id: number,
    public event: string,
    public hash: string,
    public timestamp: string
  ) {}
}