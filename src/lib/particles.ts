import Matter from 'matter-js'

export class ParticleSystem {
  private engine: Matter.Engine
  private render: Matter.Render
  private runner: Matter.Runner
  private particles: Matter.Body[] = []
  private canvas: HTMLCanvasElement
  
  constructor(canvasId: string) {
    this.canvas = document.getElementById(canvasId) as HTMLCanvasElement
    
    if (!this.canvas) {
      throw new Error(`Canvas with id "${canvasId}" not found`)
    }
    
    // Create engine
    this.engine = Matter.Engine.create({
      gravity: { x: 0, y: 0.2, scale: 0.001 },
    })
    
    // Create renderer
    this.render = Matter.Render.create({
      canvas: this.canvas,
      engine: this.engine,
      options: {
        width: window.innerWidth,
        height: window.innerHeight,
        wireframes: false,
        background: 'transparent',
      },
    })
    
    // Create runner
    this.runner = Matter.Runner.create()
    
    this.init()
  }
  
  private init(): void {
    // Start rendering
    Matter.Render.run(this.render)
    Matter.Runner.run(this.runner, this.engine)
    
    // Create particles
    this.createParticles()
    
    // Add mouse interaction
    this.addMouseInteraction()
    
    // Handle resize
    window.addEventListener('resize', () => this.handleResize())
  }
  
  private createParticles(): void {
    const particleCount = Math.min(50, Math.floor(window.innerWidth / 20))
    
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight
      const size = Math.random() * 4 + 2
      
      const particle = Matter.Bodies.circle(x, y, size, {
        restitution: 0.8,
        friction: 0.05,
        frictionAir: 0.01,
        render: {
          fillStyle: `rgba(232, 213, 196, ${Math.random() * 0.5 + 0.2})`,
        },
      })
      
      this.particles.push(particle)
      Matter.World.add(this.engine.world, particle)
    }
    
    // Add boundaries
    this.addBoundaries()
  }
  
  private addBoundaries(): void {
    const thickness = 50
    const { width = window.innerWidth, height = window.innerHeight } = this.render.options
    
    const boundaries = [
      // Top
      Matter.Bodies.rectangle(width / 2, -thickness / 2, width, thickness, {
        isStatic: true,
        render: { visible: false },
      }),
      // Bottom
      Matter.Bodies.rectangle(width / 2, height + thickness / 2, width, thickness, {
        isStatic: true,
        render: { visible: false },
      }),
      // Left
      Matter.Bodies.rectangle(-thickness / 2, height / 2, thickness, height, {
        isStatic: true,
        render: { visible: false },
      }),
      // Right
      Matter.Bodies.rectangle(width + thickness / 2, height / 2, thickness, height, {
        isStatic: true,
        render: { visible: false },
      }),
    ]
    
    Matter.World.add(this.engine.world, boundaries)
  }
  
  private addMouseInteraction(): void {
    const mouse = Matter.Mouse.create(this.canvas)
    const mouseConstraint = Matter.MouseConstraint.create(this.engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    })
    
    Matter.World.add(this.engine.world, mouseConstraint)
    this.render.mouse = mouse
  }
  
  private handleResize(): void {
    this.render.canvas.width = window.innerWidth
    this.render.canvas.height = window.innerHeight
    
    Matter.Render.setPixelRatio(this.render, window.devicePixelRatio)
  }
  
  /**
   * Add force to all particles (e.g., on mouse move)
   */
  addForceToParticles(force: Matter.Vector): void {
    this.particles.forEach((particle) => {
      Matter.Body.applyForce(particle, particle.position, force)
    })
  }
  
  /**
   * Destroy the particle system
   */
  destroy(): void {
    Matter.Render.stop(this.render)
    Matter.Runner.stop(this.runner)
    Matter.World.clear(this.engine.world, false)
    Matter.Engine.clear(this.engine)
    this.render.canvas.remove()
  }
}
