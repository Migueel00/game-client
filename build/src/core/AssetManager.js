export class AssetManager {
    // Maps para almacenar assets por clave semántica
    images = new Map();
    sounds = new Map();
    // Control de carga
    assetsToLoad = 0;
    assetsLoaded = 0;
    // Métodos principales
    addImage(key, src) {
        const image = new Image();
        image.src = src;
        this.images.set(key, image);
        this.assetsToLoad++;
    }
    addSound(key, elementId) {
        const soundElement = document.querySelector(`#${elementId}`);
        if (!soundElement) {
            throw new Error(`Sound element with Id ${elementId} not found`);
        }
        soundElement.load();
        this.sounds.set(key, soundElement);
        this.assetsToLoad++;
    }
    async loadAllAssets() {
        const promises = [];
        for (const [key, image] of this.images) {
            const promise = new Promise((resolve, reject) => {
                const onLoad = () => {
                    this.assetsLoaded++;
                    image.removeEventListener('load', onLoad);
                    image.removeEventListener('error', onError);
                    resolve();
                };
                const onError = () => {
                    image.removeEventListener('load', onLoad);
                    image.removeEventListener('error', onError);
                    reject(new Error(`Failed to load image: ${key}`));
                };
                image.addEventListener('load', onLoad);
                image.addEventListener('error', onError);
            });
            promises.push(promise);
        }
        // Crear promises para sonidos
        for (const [key, sound] of this.sounds) {
            const promise = new Promise((resolve, reject) => {
                const onCanPlay = () => {
                    this.assetsLoaded++;
                    sound.removeEventListener('canplaythrough', onCanPlay);
                    sound.removeEventListener('error', onError);
                    resolve();
                };
                const onError = () => {
                    sound.removeEventListener('canplaythrough', onCanPlay);
                    sound.removeEventListener('error', onError);
                    reject(new Error(`Failed to load sound: ${key}`));
                };
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
    getSpriteSheet() {
        const image = this.images.get('spritesheet');
        if (!image) {
            throw new Error('Spritesheet not found or not loaded');
        }
        return image;
    }
    getMapImage() {
        const image = this.images.get('map');
        if (!image) {
            throw new Error('Map image not found or not loaded');
        }
        return image;
    }
    getGameMusic() {
        const sound = this.sounds.get('gameMusic');
        if (!sound) {
            throw new Error('Game music not found or not loaded');
        }
        return sound;
    }
    getLoadingProgress() {
        if (this.assetsToLoad === 0)
            return 100;
        return (this.assetsLoaded / this.assetsToLoad) * 100;
    }
}
