export abstract class Scene {
  protected name: string;

  constructor(name: string) {
    this.name = name;
  }

  public getName(): string {
    return this.name;
  }

  public abstract enter(): void;
  public abstract exit(): void;
  public abstract update(deltaTime: number): void;
  public abstract render(): void;
  public abstract handleInput(event: KeyboardEvent): void;
}