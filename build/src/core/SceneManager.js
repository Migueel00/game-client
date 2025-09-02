export class SceneManager {
    currentScene = null;
    scenes = new Map();
    addScene(key, scene) {
        this.scenes.set(key, scene);
    }
    switchToScene(name) {
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
    update(deltaTime) {
        if (this.currentScene) {
            this.currentScene.update(deltaTime);
        }
    }
    render() {
        if (this.currentScene) {
            this.currentScene.render();
        }
    }
    handleInput(event) {
        if (this.currentScene) {
            this.currentScene.handleInput(event);
        }
    }
    getCurrentScene() {
        return this.currentScene;
    }
    getCurrentSceneName() {
        return this.currentScene ? this.currentScene.getName() : null;
    }
}
