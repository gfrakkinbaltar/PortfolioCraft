// Core Types for PortfolioCraft

export interface PortfolioSection {
  id: string
  type: SectionType
  title: string
  content: Record<string, unknown>
  styles: SectionStyles
  animations: AnimationConfig
  order: number
  visible: boolean
}

export type SectionType =
  | 'hero'
  | 'about'
  | 'projects'
  | 'skills'
  | 'experience'
  | 'education'
  | 'contact'
  | 'testimonials'
  | 'custom'

export interface SectionStyles {
  backgroundColor?: string
  textColor?: string
  padding?: string
  margin?: string
  borderRadius?: string
  customCSS?: string
}

export interface AnimationConfig {
  enabled: boolean
  type: AnimationType
  duration: number
  delay: number
  easing: string
  trigger: 'scroll' | 'hover' | 'click' | 'load'
}

export type AnimationType =
  | 'fadeIn'
  | 'slideUp'
  | 'slideDown'
  | 'slideLeft'
  | 'slideRight'
  | 'scale'
  | 'rotate'
  | 'reveal'
  | 'stagger'
  | 'custom'

export interface Customization {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  fontPrimary: string
  fontSecondary: string
  animationSpeed: number
  particlesEnabled: boolean
  theme: 'light' | 'dark'
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  demoUrl?: string
  githubUrl?: string
  featured: boolean
  date: Date
}

export interface Skill {
  id: string
  name: string
  level: number // 0-100
  category: string
  icon?: string
}

export interface Experience {
  id: string
  company: string
  position: string
  startDate: Date
  endDate?: Date
  current: boolean
  description: string
  achievements: string[]
  technologies: string[]
}

export interface Template {
  id: string
  name: string
  description: string
  preview: string
  category: TemplateCategory
  sections: PortfolioSection[]
  customization: Customization
  featured: boolean
}

export type TemplateCategory =
  | 'developer'
  | 'designer'
  | 'creative'
  | 'business'
  | 'minimal'
  | 'bold'

export interface BuilderState {
  sections: PortfolioSection[]
  currentSection: string | null
  history: HistoryEntry[]
  historyIndex: number
  customization: Customization
  template: Template | null
  isDirty: boolean
}

export interface HistoryEntry {
  timestamp: number
  state: Partial<BuilderState>
  action: string
}
