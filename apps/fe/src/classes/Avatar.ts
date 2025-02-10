// src/classes/Avatar.ts
export class Avatar {
  private x: number;
  private y: number;
  private color: string;
  private name: string;
  private size: number;

  constructor(x: number, y: number, color: string, name: string) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.name = name;
    this.size = 40;
  }

  draw(ctx: CanvasRenderingContext2D, blockSize: number): void {
    ctx.beginPath();
    ctx.arc(
      this.x * blockSize,
      this.y * blockSize,
      this.size / 2,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();

    ctx.fillStyle = "white";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.name, this.x * blockSize, this.y * blockSize + this.size);
  }
}
