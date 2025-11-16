declare module 'animejs' {
  interface AnimeInstance {
    play(): void
    pause(): void
    restart(): void
    reverse(): void
    seek(time: number): void
    finished: Promise<void>
  }

  interface AnimeParams {
    targets?: any
    duration?: number
    delay?: number | ((el: any, i: number, l: number) => number)
    easing?: string
    elasticity?: number
    loop?: boolean | number
    direction?: 'normal' | 'reverse' | 'alternate'
    autoplay?: boolean
    complete?: () => void
    opacity?: number | number[]
    translateY?: number | number[]
    translateX?: number | number[]
    scale?: number | number[]
    rotate?: number | number[]
    [key: string]: any
  }

  interface AnimeStatic {
    (params: AnimeParams): AnimeInstance
    timeline(params?: AnimeParams): AnimeInstance
    stagger(value: number, options?: { start?: number; from?: string | number }): (el: any, i: number) => number
    easing: Record<string, string>
  }

  const anime: AnimeStatic
  export default anime
  export { AnimeInstance, AnimeParams }
}
