import { Scene } from "../scenes/Scene.js";

export class SceneManager {
  private currentScene: Scene | null = null;
  private scenes: Map<string, Scene> = new Map();

  public addScene(key: string, scene: Scene): void {
    this.scenes.set(key, scene);
  }

  public switchToScene(name: string): void {
    const newScene = this.scenes.get(name);
    if (!newScene) {
      throw new Error(`Scene '${name}' not found`);
    }

    // Salir de la escena actual
    if (this.currentScene) {
      this.currentScene.exit();
    }

    // Cambiar a la nueva escena
    this.currentScene = newScene;
    this.currentScene.enter();
    
    console.log(`Switched to scene: ${name}`);
  }

  public update(deltaTime: number): void {
    if (this.currentScene) {
      this.currentScene.update(deltaTime);
    }
  }

  public render(): void {
    if (this.currentScene) {
      this.currentScene.render();
    }
  }

  public handleInput(event: KeyboardEvent): void {
    if (this.currentScene) {
      this.currentScene.handleInput(event);
    }
  }

  public getCurrentScene(): Scene | null {
    return this.currentScene;
  }

  public getCurrentSceneName(): string | null {
    return this.currentScene ? this.currentScene.getName() : null;
  }
}