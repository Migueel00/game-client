export class AssetManager {
  // Maps para almacenar assets por clave semántica
  private images: Map<string, HTMLImageElement> = new Map();
  private sounds: Map<string, HTMLAudioElement> = new Map();

  // Control de carga
  private assetsToLoad: number = 0;
  private assetsLoaded: number = 0;

  // Métodos principales
  public addImage(key: string, src: string): void {
    const image = new Image();
    image.src = src;
    this.images.set(key, image);
    this.assetsToLoad++;
  }

  public addSound(key: string, elementId: string): void {
    const soundElement = document.querySelector<HTMLAudioElement>(`#${elementId}`);
    if (!soundElement) {
      throw new Error(`Sound element with Id ${elementId} not found`);
    }

    soundElement.load();
    this.sounds.set(key, soundElement);
    this.assetsToLoad++;
  }

  public async loadAllAssets(): Promise<void> {
    const promises: Promise<void>[] = [];

    for (const [key, image] of this.images) {
      const promise = new Promise<void>((resolve, reject) => {
        const onLoad = () => {
          this.assetsLoaded++;
          image.removeEventListener('load', onLoad);
          image.removeEventListener('error', onError);
          resolve();
        }

        const onError = () => {
          image.removeEventListener('load', onLoad);
          image.removeEventListener('error', onError);
          reject(new Error(`Failed to load image: ${key}`));
        }

        image.addEventListener('load', onLoad);
        image.addEventListener('error', onError);
      });

      promises.push(promise);
    }

    // Crear promises para sonidos
    for(const [key, sound] of this.sounds){
      const promise = new Promise<void>((resolve, reject) => {
        const onCanPlay = () => {
          this.assetsLoaded++;
          sound.removeEventListener('canplaythrough', onCanPlay);
          sound.removeEventListener('error', onError);
          resolve();
        }

        const onError = () => {
          sound.removeEventListener('canplaythrough', onCanPlay);
          sound.removeEventListener('error', onError);
          reject(new Error(`Failed to load sound: ${key}`));
        }

        sound.addEventListener('canplaythrough', onCanPlay);
        sound.addEventListener('error', onError);
      });
      promises.push(promise);
    }

    // Esperar a que todos los assets se carguen
    await Promise.all(promises);
    console.log('All assets loaded successfully');
  }

  // Getters semánticos
  public getSpriteSheet(): HTMLImageElement {
    const image = this.images.get('spritesheet');
    if (!image) {
        throw new Error('Spritesheet not found or not loaded');
    }
    return image;
}

public getMapImage(): HTMLImageElement {
    const image = this.images.get('map');
    if (!image) {
        throw new Error('Map image not found or not loaded');
    }
    return image;
}

public getGameMusic(): HTMLAudioElement {
    const sound = this.sounds.get('gameMusic');
    if (!sound) {
        throw new Error('Game music not found or not loaded');
    }
    return sound;
}

public getLoadingProgress(): number {
    if (this.assetsToLoad === 0) return 100;
    return (this.assetsLoaded / this.assetsToLoad) * 100;
}
}