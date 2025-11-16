import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type { BuilderState, PortfolioSection, Customization, Template } from '../types/portfolio'

interface BuilderStore extends BuilderState {
  // Actions
  addSection: (section: PortfolioSection) => void
  updateSection: (id: string, updates: Partial<PortfolioSection>) => void
  removeSection: (id: string) => void
  reorderSections: (startIndex: number, endIndex: number) => void
  setCurrentSection: (id: string | null) => void
  
  // Customization
  updateCustomization: (updates: Partial<Customization>) => void
  
  // Template
  loadTemplate: (template: Template) => void
  clearTemplate: () => void
  
  // History
  undo: () => void
  redo: () => void
  saveState: (action: string) => void
  
  // Export
  exportPortfolio: () => string
  importPortfolio: (data: string) => void
}

const defaultCustomization: Customization = {
  primaryColor: '#E8D5C4',
  secondaryColor: '#1A1A1A',
  accentColor: '#4A4A4A',
  fontPrimary: 'Sorts Mill Goudy',
  fontSecondary: 'Oranienbaum',
  animationSpeed: 1,
  particlesEnabled: true,
  theme: 'light',
}

export const useBuilderStore = create<BuilderStore>()(
  devtools(
    persist(
      (set, get) => ({
        sections: [],
        currentSection: null,
        history: [],
        historyIndex: -1,
        customization: defaultCustomization,
        template: null,
        isDirty: false,

        addSection: (section) => {
          set((state) => {
            const newState = {
              sections: [...state.sections, section],
              isDirty: true,
            }
            get().saveState('Add Section')
            return newState
          })
        },

        updateSection: (id, updates) => {
          set((state) => ({
            sections: state.sections.map((s) =>
              s.id === id ? { ...s, ...updates } : s
            ),
            isDirty: true,
          }))
          get().saveState('Update Section')
        },

        removeSection: (id) => {
          set((state) => ({
            sections: state.sections.filter((s) => s.id !== id),
            currentSection: state.currentSection === id ? null : state.currentSection,
            isDirty: true,
          }))
          get().saveState('Remove Section')
        },

        reorderSections: (startIndex, endIndex) => {
          set((state) => {
            const result = Array.from(state.sections)
            const [removed] = result.splice(startIndex, 1)
            result.splice(endIndex, 0, removed)
            return {
              sections: result.map((s, i) => ({ ...s, order: i })),
              isDirty: true,
            }
          })
          get().saveState('Reorder Sections')
        },

        setCurrentSection: (id) => {
          set({ currentSection: id })
        },

        updateCustomization: (updates) => {
          set((state) => ({
            customization: { ...state.customization, ...updates },
            isDirty: true,
          }))
          get().saveState('Update Customization')
        },

        loadTemplate: (template) => {
          set({
            template,
            sections: template.sections,
            customization: template.customization,
            isDirty: false,
          })
          get().saveState('Load Template')
        },

        clearTemplate: () => {
          set({
            template: null,
            sections: [],
            customization: defaultCustomization,
            isDirty: false,
          })
          get().saveState('Clear Template')
        },

        saveState: (action) => {
          set((state) => {
            const entry = {
              timestamp: Date.now(),
              state: {
                sections: state.sections,
                customization: state.customization,
              },
              action,
            }
            
            const newHistory = state.history.slice(0, state.historyIndex + 1)
            newHistory.push(entry)
            
            // Keep only last 50 states
            if (newHistory.length > 50) {
              newHistory.shift()
            }
            
            return {
              history: newHistory,
              historyIndex: newHistory.length - 1,
            }
          })
        },

        undo: () => {
          set((state) => {
            if (state.historyIndex <= 0) return state
            
            const prevState = state.history[state.historyIndex - 1]
            return {
              ...prevState.state,
              historyIndex: state.historyIndex - 1,
              isDirty: true,
            }
          })
        },

        redo: () => {
          set((state) => {
            if (state.historyIndex >= state.history.length - 1) return state
            
            const nextState = state.history[state.historyIndex + 1]
            return {
              ...nextState.state,
              historyIndex: state.historyIndex + 1,
              isDirty: true,
            }
          })
        },

        exportPortfolio: () => {
          const state = get()
          return JSON.stringify({
            sections: state.sections,
            customization: state.customization,
            template: state.template,
            version: '2.0.0',
            exportedAt: new Date().toISOString(),
          }, null, 2)
        },

        importPortfolio: (data) => {
          try {
            const parsed = JSON.parse(data)
            set({
              sections: parsed.sections || [],
              customization: parsed.customization || defaultCustomization,
              template: parsed.template || null,
              isDirty: false,
            })
            get().saveState('Import Portfolio')
          } catch (error) {
            console.error('Failed to import portfolio:', error)
          }
        },
      }),
      {
        name: 'portfolio-builder-storage',
        partialize: (state) => ({
          sections: state.sections,
          customization: state.customization,
          template: state.template,
        }),
      }
    )
  )
)
