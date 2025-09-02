Estrategia de Refactorización por Fases
Fase 1: Arquitectura Base (Empezar aquí)
  Separar responsabilidades básicas
  GameState (ya empezamos)
  CanvasManager (manejo de canvas)
  AssetManager (carga de recursos)
  InputManager (eventos de entrada)
Fase 2: Sistema de Escenas
  Crear sistema de estados/escenas
  SceneManager
  MenuScene, GameScene, GameOverScene
  Cada escena maneja su propia lógica y renderizado
Fase 3: Entidades y Componentes
  Refactorizar sprites a sistema de entidades
  Entity base
  Component system (Position, Render, Physics, Input)
  ComponentManager
Fase 4: Servicios
  Crear servicios especializados
  AudioService
  ScoreService
  CollisionService