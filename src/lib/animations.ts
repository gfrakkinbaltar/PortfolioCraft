import anime from 'animejs'
import type { AnimeInstance, AnimeParams } from 'animejs'
import type { AnimationConfig } from '../types/portfolio'

export class AnimationController {
  private animations: Map<string, AnimeInstance> = new Map()
  
  constructor() {
    this.initScrollObserver()
  }
  
  /**
   * Initialize scroll-triggered animations using Intersection Observer
   */
  private initScrollObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target as HTMLElement
            const animationType = element.dataset.animation
            
            if (animationType) {
              this.triggerAnimation(element, animationType)
              observer.unobserve(element) // Animate once
            }
          }
        })
      },
      {
        threshold: 0.3,
        rootMargin: '0px 0px -10% 0px',
      }
    )

    // Observe all elements with data-animation attribute
    document.querySelectorAll('[data-animation]').forEach((el) => {
      observer.observe(el)
    })
  }
  
  /**
   * Trigger animation based on type
   */
  private triggerAnimation(element: HTMLElement, type: string): void {
    const config = this.getAnimationConfig(type)
    
    anime({
      targets: element,
      ...config,
      complete: () => {
        element.classList.add('animated')
      },
    })
  }
  
  /**
   * Get animation configuration by type
   */
  private getAnimationConfig(type: string): AnimeParams {
    const configs: Record<string, AnimeParams> = {
      fadeIn: {
        opacity: [0, 1],
        duration: 800,
        easing: 'easeOutQuad',
      },
      slideUp: {
        opacity: [0, 1],
        translateY: [16, 0],
        duration: 600,
        easing: 'easeOutQuad',
      },
      slideDown: {
        opacity: [0, 1],
        translateY: [-16, 0],
        duration: 600,
        easing: 'easeOutQuad',
      },
      slideLeft: {
        opacity: [0, 1],
        translateX: [32, 0],
        duration: 600,
        easing: 'easeOutQuad',
      },
      slideRight: {
        opacity: [0, 1],
        translateX: [-32, 0],
        duration: 600,
        easing: 'easeOutQuad',
      },
      scale: {
        opacity: [0, 1],
        scale: [0.95, 1],
        duration: 600,
        easing: 'easeOutQuad',
      },
      reveal: {
        opacity: [0, 1],
        translateY: [24, 0],
        scale: [0.98, 1],
        duration: 800,
        easing: 'spring(1, 80, 10, 0)',
      },
    }
    
    return configs[type] || configs.fadeIn
  }
  
  /**
   * Create staggered animation for multiple elements
   */
  staggerAnimation(
    selector: string,
    config: Partial<AnimationConfig>
  ): AnimeInstance {
    const animation = anime({
      targets: selector,
      opacity: [0, 1],
      translateY: [16, 0],
      duration: config.duration || 600,
      delay: anime.stagger(config.delay || 100),
      easing: config.easing || 'easeOutQuad',
    })
    
    return animation
  }
  
  /**
   * Hover animation for cards/buttons
   */
  hoverAnimation(element: HTMLElement): void {
    element.addEventListener('mouseenter', () => {
      anime({
        targets: element,
        scale: 1.02,
        translateY: -2,
        duration: 200,
        easing: 'easeOutQuad',
      })
    })
    
    element.addEventListener('mouseleave', () => {
      anime({
        targets: element,
        scale: 1,
        translateY: 0,
        duration: 200,
        easing: 'easeOutQuad',
      })
    })
  }
  
  /**
   * Text split animation (requires splitting.js)
   */
  textRevealAnimation(selector: string): void {
    const elements = document.querySelectorAll(selector)
    
    elements.forEach((el) => {
      const text = el.textContent || ''
      el.innerHTML = text
        .split('')
        .map((char) => `<span class="char">${char}</span>`)
        .join('')
      
      anime({
        targets: el.querySelectorAll('.char'),
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 800,
        delay: anime.stagger(50),
        easing: 'easeOutQuad',
      })
    })
  }
  
  /**
   * Parallax effect
   */
  parallaxEffect(element: HTMLElement, speed: number = 0.5): void {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset
      const yPos = -(scrolled * speed)
      
      anime({
        targets: element,
        translateY: yPos,
        duration: 0,
      })
    })
  }
  
  /**
   * Cancel all animations
   */
  cancelAll(): void {
    this.animations.forEach((anim) => anim.pause())
    this.animations.clear()
  }
  
  /**
   * Initialize page load animations
   */
  initPageAnimations(): void {
    // Animate fade-in elements
    const fadeElements = document.querySelectorAll('.fade-in')
    fadeElements.forEach((el, index) => {
      anime({
        targets: el,
        opacity: [0, 1],
        translateY: [20, 0],
        duration: 600,
        delay: index * 100,
        easing: 'easeOutQuad',
      })
    })
    
    // Animate nav header
    anime({
      targets: '.nav-header',
      opacity: [0, 1],
      translateY: [-20, 0],
      duration: 400,
      easing: 'easeOutQuad',
    })
  }
  
  /**
   * Initialize scroll-triggered animations
   */
  initScrollAnimations(): void {
    // Re-initialize scroll observer for new elements
    this.initScrollObserver()
    
    // Add hover animations to cards
    document.querySelectorAll('.drag-item, .section-item, .template-card').forEach((el) => {
      this.hoverAnimation(el as HTMLElement)
    })
  }
}
