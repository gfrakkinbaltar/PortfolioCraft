// Main application entry point
import { useBuilderStore } from './lib/store'
import { ParticleSystem } from './lib/particles'
import { AnimationController } from './lib/animations'
import type { PortfolioSection } from './types/portfolio'

class PortfolioCraftApp {
  private animationController: AnimationController
  private currentDevice: 'desktop' | 'tablet' | 'mobile' = 'desktop'
  
  constructor() {
    this.animationController = new AnimationController()
    this.init()
  }
  
  private init(): void {
    console.log('🚀 PortfolioCraft initializing...')
    
    // Initialize particle background
    this.initParticles()
    
    // Initialize drag and drop
    this.initDragDrop()
    
    // Initialize event listeners
    this.initEventListeners()
    
    // Initialize animations
    this.animationController.initPageAnimations()
    
    // Load saved state
    this.loadSavedState()
    
    console.log('✅ PortfolioCraft ready!')
  }
  
  private initParticles(): void {
    try {
      const canvas = document.getElementById('particle-canvas')
      if (canvas && window.innerWidth > 768) {
        // Only init on larger screens for performance
        new ParticleSystem('particle-canvas')
      }
    } catch (error) {
      console.warn('Particle system failed to initialize:', error)
    }
  }
  
  private initDragDrop(): void {
    const dragItems = document.querySelectorAll<HTMLElement>('.drag-item')
    const dropZone = document.getElementById('main-drop-zone')
    const previewContainer = document.getElementById('portfolio-preview')
    
    if (!dragItems.length || !dropZone || !previewContainer) return
    
    let draggedElement: HTMLElement | null = null
    
    // Drag start
    dragItems.forEach(item => {
      item.addEventListener('dragstart', () => {
        draggedElement = item
        item.style.opacity = '0.5'
        item.classList.add('dragging')
      })
      
      item.addEventListener('dragend', () => {
        item.style.opacity = '1'
        item.classList.remove('dragging')
      })
    })
    
    // Drop zone events
    dropZone.addEventListener('dragover', (e) => {
      e.preventDefault()
      dropZone.classList.add('drag-over')
    })
    
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('drag-over')
    })
    
    dropZone.addEventListener('drop', (e) => {
      e.preventDefault()
      dropZone.classList.remove('drag-over')
      
      if (draggedElement) {
        const sectionType = draggedElement.dataset.sectionType
        if (sectionType) {
          this.addSection(sectionType)
        }
      }
      
      draggedElement = null
    })
    
    // Make preview sections sortable
    this.initSortable(previewContainer)
  }
  
  private initSortable(container: HTMLElement): void {
    let draggedSection: HTMLElement | null = null
    
    container.addEventListener('dragstart', (e) => {
      const target = e.target as HTMLElement
      if (target.classList.contains('portfolio-section')) {
        draggedSection = target
        target.style.opacity = '0.5'
      }
    })
    
    container.addEventListener('dragover', (e) => {
      e.preventDefault()
      const target = e.target as HTMLElement
      const section = target.closest('.portfolio-section') as HTMLElement
      
      if (section && section !== draggedSection && draggedSection) {
        const rect = section.getBoundingClientRect()
        const midpoint = rect.top + rect.height / 2
        
        if (e.clientY < midpoint) {
          section.parentElement?.insertBefore(draggedSection, section)
        } else {
          section.parentElement?.insertBefore(draggedSection, section.nextSibling)
        }
      }
    })
    
    container.addEventListener('dragend', () => {
      if (draggedSection) {
        draggedSection.style.opacity = '1'
        draggedSection = null
        this.updateSectionOrder()
      }
    })
  }
  
  private initEventListeners(): void {
    // Device preview buttons
    document.querySelectorAll('.device-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLElement
        const device = target.dataset.device as 'desktop' | 'tablet' | 'mobile'
        if (device) {
          this.changeDevice(device)
        }
      })
    })
    
    // Undo/Redo buttons
    const undoBtn = document.getElementById('undo-btn')
    const redoBtn = document.getElementById('redo-btn')
    
    if (undoBtn) {
      undoBtn.addEventListener('click', () => {
        useBuilderStore.getState().undo()
        this.renderPreview()
      })
    }
    
    if (redoBtn) {
      redoBtn.addEventListener('click', () => {
        useBuilderStore.getState().redo()
        this.renderPreview()
      })
    }
    
    // Save button
    const saveBtn = document.getElementById('save-btn')
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.savePortfolio())
    }
    
    // Export buttons
    document.getElementById('export-html')?.addEventListener('click', () => {
      this.exportAsHTML()
    })
    
    document.getElementById('export-pdf')?.addEventListener('click', () => {
      this.exportAsPDF()
    })
    
    document.getElementById('share-link')?.addEventListener('click', () => {
      this.generateShareLink()
    })
    
    // Color pickers
    document.getElementById('primary-color')?.addEventListener('change', (e) => {
      const value = (e.target as HTMLInputElement).value
      useBuilderStore.getState().updateCustomization({ primaryColor: value })
      this.applyCustomization()
    })
    
    document.getElementById('secondary-color')?.addEventListener('change', (e) => {
      const value = (e.target as HTMLInputElement).value
      useBuilderStore.getState().updateCustomization({ secondaryColor: value })
      this.applyCustomization()
    })
    
    document.getElementById('accent-color')?.addEventListener('change', (e) => {
      const value = (e.target as HTMLInputElement).value
      useBuilderStore.getState().updateCustomization({ accentColor: value })
      this.applyCustomization()
    })
    
    // Font selector
    document.getElementById('font-primary')?.addEventListener('change', (e) => {
      const value = (e.target as HTMLSelectElement).value
      useBuilderStore.getState().updateCustomization({ fontPrimary: value })
      this.applyCustomization()
    })
    
    // Animation speed
    document.getElementById('animation-speed')?.addEventListener('input', (e) => {
      const value = parseFloat((e.target as HTMLInputElement).value)
      useBuilderStore.getState().updateCustomization({ animationSpeed: value })
    })
    
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn')
    if (mobileMenuBtn && window.innerWidth < 768) {
      mobileMenuBtn.addEventListener('click', () => {
        // Toggle mobile menu
        document.querySelector('.nav-header')?.classList.toggle('menu-open')
      })
    }
    
    // Sidebar toggles
    document.getElementById('sidebar-toggle')?.addEventListener('click', () => {
      document.querySelector('.builder-sidebar')?.classList.toggle('open')
    })
    
    document.getElementById('panel-toggle')?.addEventListener('click', () => {
      document.querySelector('.builder-panel')?.classList.toggle('open')
    })
  }
  
  private addSection(sectionType: string): void {
    const section: PortfolioSection = {
      id: `section-${Date.now()}`,
      type: sectionType as any,
      title: this.getSectionTitle(sectionType),
      content: this.getDefaultContent(sectionType),
      styles: {
        backgroundColor: '#FFFFFF',
        textColor: '#1A1A1A',
        padding: '4rem 2rem',
      },
      animations: {
        enabled: true,
        type: 'fadeIn',
        duration: 600,
        delay: 0,
        easing: 'easeOutQuad',
        trigger: 'scroll',
      },
      order: useBuilderStore.getState().sections.length,
      visible: true,
    }
    
    useBuilderStore.getState().addSection(section)
    this.renderPreview()
    
    // Show success message
    this.showNotification('Section added successfully!', 'success')
  }
  
  private getSectionTitle(type: string): string {
    const titles: Record<string, string> = {
      'hero-3d': '3D Particle Hero',
      'hero-video': 'Video Background Hero',
      'hero-minimal': 'Minimal Hero',
      'about': 'About Me',
      'projects': 'My Projects',
      'skills': 'Skills & Expertise',
      'experience': 'Work Experience',
      'contact': 'Get In Touch',
    }
    
    return titles[type] || 'New Section'
  }
  
  private getDefaultContent(type: string): Record<string, unknown> {
    // Return appropriate default content based on section type
    const defaults: Record<string, any> = {
      'hero-3d': {
        heading: 'Welcome to My Portfolio',
        subheading: 'Creating Amazing Digital Experiences',
        ctaText: 'View My Work',
        ctaLink: '#projects',
      },
      'about': {
        heading: 'About Me',
        text: 'I am a passionate developer creating impactful digital solutions.',
        image: '/resources/professional-headshot.jpg',
      },
      'projects': {
        heading: 'My Projects',
        projects: [],
      },
      'skills': {
        heading: 'Skills & Expertise',
        skills: [],
      },
      'experience': {
        heading: 'Work Experience',
        entries: [],
      },
      'contact': {
        heading: 'Get In Touch',
        email: 'hello@example.com',
        social: {},
      },
    }
    
    return defaults[type] || {}
  }
  
  private renderPreview(): void {
    const previewContainer = document.getElementById('portfolio-preview')
    if (!previewContainer) return
    
    const sections = useBuilderStore.getState().sections
    
    // Clear existing content
    previewContainer.innerHTML = ''
    
    if (sections.length === 0) {
      // Show welcome message
      previewContainer.innerHTML = `
        <div class="welcome-section p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100 min-h-96 flex items-center justify-center">
          <div>
            <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
              </svg>
            </div>
            <h3 class="font-display text-2xl font-bold mb-2">Start Building Your Portfolio</h3>
            <p class="text-secondary mb-6">Drag sections from the library to begin</p>
            <div class="drop-zone flex items-center justify-center" id="main-drop-zone">
              <p class="text-secondary">Drop your first section here</p>
            </div>
          </div>
        </div>
      `
      
      // Re-init drop zone
      this.initDragDrop()
      return
    }
    
    // Render sections
    sections.forEach((section, index) => {
      const sectionEl = this.renderSection(section, index)
      previewContainer.appendChild(sectionEl)
    })
    
    // Re-initialize animations
    this.animationController.initScrollAnimations()
  }
  
  private renderSection(section: PortfolioSection, index: number): HTMLElement {
    const div = document.createElement('div')
    div.className = 'portfolio-section fade-in'
    div.dataset.sectionId = section.id
    div.draggable = true
    div.style.animationDelay = `${index * 0.1}s`
    
    // Apply section styles
    if (section.styles.backgroundColor) {
      div.style.backgroundColor = section.styles.backgroundColor
    }
    if (section.styles.textColor) {
      div.style.color = section.styles.textColor
    }
    if (section.styles.padding) {
      div.style.padding = section.styles.padding
    }
    
    // Render content based on type
    div.innerHTML = this.getSectionHTML(section)
    
    // Add edit/delete controls
    const controls = document.createElement('div')
    controls.className = 'section-controls absolute top-4 right-4 flex gap-2 opacity-0 hover:opacity-100 transition-opacity'
    controls.innerHTML = `
      <button class="btn-secondary p-2" onclick="portfolioApp.editSection('${section.id}')">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
        </svg>
      </button>
      <button class="btn-secondary p-2" onclick="portfolioApp.deleteSection('${section.id}')">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
    `
    div.style.position = 'relative'
    div.appendChild(controls)
    
    return div
  }
  
  private getSectionHTML(section: PortfolioSection): string {
    const content = section.content
    
    switch (section.type) {
      case 'hero':
        return `
          <div class="hero-section text-center py-20 px-4">
            <h1 class="font-display text-5xl md:text-7xl font-bold mb-6">${content.heading || 'Your Name'}</h1>
            <p class="text-xl md:text-2xl text-secondary mb-8">${content.subheading || 'Your Tagline'}</p>
            <button class="btn-primary px-8 py-3">${content.ctaText || 'Get Started'}</button>
          </div>
        `
      
      case 'about':
        return `
          <div class="about-section py-16 px-4">
            <div class="max-w-4xl mx-auto">
              <h2 class="font-display text-4xl font-bold mb-8">${content.heading || 'About Me'}</h2>
              <div class="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <p class="text-lg leading-relaxed">${content.text || 'Tell your story here...'}</p>
                </div>
                ${content.image ? `<img src="${content.image}" alt="Profile" class="rounded-lg shadow-lg" />` : ''}
              </div>
            </div>
          </div>
        `
      
      case 'projects':
        return `
          <div class="projects-section py-16 px-4">
            <div class="max-w-6xl mx-auto">
              <h2 class="font-display text-4xl font-bold mb-12 text-center">${content.heading || 'My Projects'}</h2>
              <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                ${this.renderProjectCards(content.projects as any[] || [])}
              </div>
            </div>
          </div>
        `
      
      case 'skills':
        return `
          <div class="skills-section py-16 px-4">
            <div class="max-w-4xl mx-auto">
              <h2 class="font-display text-4xl font-bold mb-12 text-center">${content.heading || 'Skills'}</h2>
              <div id="skills-chart-${section.id}" class="h-96"></div>
            </div>
          </div>
        `
      
      case 'contact':
        return `
          <div class="contact-section py-16 px-4">
            <div class="max-w-2xl mx-auto text-center">
              <h2 class="font-display text-4xl font-bold mb-8">${content.heading || 'Get In Touch'}</h2>
              <p class="text-lg mb-8">Let's work together on your next project</p>
              <a href="mailto:${content.email || 'hello@example.com'}" class="btn-primary px-8 py-3">Send Email</a>
            </div>
          </div>
        `
      
      default:
        return `
          <div class="custom-section py-16 px-4">
            <div class="max-w-4xl mx-auto">
              <h2 class="font-display text-4xl font-bold mb-8">${section.title}</h2>
              <p>Custom section content</p>
            </div>
          </div>
        `
    }
  }
  
  private renderProjectCards(projects: any[]): string {
    if (projects.length === 0) {
      return '<p class="col-span-full text-center text-secondary">No projects yet. Add some to showcase your work!</p>'
    }
    
    return projects.map(project => `
      <div class="project-card bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
        ${project.image ? `<img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover" />` : ''}
        <div class="p-6">
          <h3 class="font-bold text-xl mb-2">${project.title}</h3>
          <p class="text-secondary mb-4">${project.description}</p>
          ${project.demoUrl ? `<a href="${project.demoUrl}" class="btn-primary inline-block">View Project</a>` : ''}
        </div>
      </div>
    `).join('')
  }
  
  private changeDevice(device: 'desktop' | 'tablet' | 'mobile'): void {
    this.currentDevice = device
    
    const container = document.getElementById('preview-container')
    if (!container) return
    
    // Remove all device classes
    container.classList.remove('device-desktop', 'device-tablet', 'device-mobile')
    
    // Add selected device class
    container.classList.add(`device-${device}`)
    
    // Update button states
    document.querySelectorAll('.device-btn').forEach(btn => {
      btn.classList.remove('active')
      if (btn.getAttribute('data-device') === device) {
        btn.classList.add('active')
      }
    })
  }
  
  private updateSectionOrder(): void {
    const sections = Array.from(document.querySelectorAll('.portfolio-section'))
    const newOrder = sections.map((el, index) => {
      const id = el.getAttribute('data-section-id')
      return { id, order: index }
    })
    
    // Update store
    const currentSections = useBuilderStore.getState().sections
    newOrder.forEach(({ id, order }) => {
      const section = currentSections.find(s => s.id === id)
      if (section) {
        useBuilderStore.getState().updateSection(id!, { order })
      }
    })
  }
  
  private applyCustomization(): void {
    const custom = useBuilderStore.getState().customization
    
    // Apply colors
    document.documentElement.style.setProperty('--accent', custom.primaryColor)
    document.documentElement.style.setProperty('--text-primary', custom.secondaryColor)
    document.documentElement.style.setProperty('--text-secondary', custom.accentColor)
    
    // Apply fonts
    const previewContainer = document.getElementById('portfolio-preview')
    if (previewContainer) {
      previewContainer.style.fontFamily = `'${custom.fontPrimary}', serif`
    }
    
    this.renderPreview()
  }
  
  private loadSavedState(): void {
    const state = useBuilderStore.getState()
    
    if (state.sections.length > 0) {
      this.renderPreview()
      this.applyCustomization()
    }
  }
  
  private savePortfolio(): void {
    // Trigger save through store (already handles persistence)
    useBuilderStore.getState().saveState('Manual Save')
    this.showNotification('Portfolio saved!', 'success')
  }
  
  private exportAsHTML(): void {
    const sections = useBuilderStore.getState().sections
    const custom = useBuilderStore.getState().customization
    
    // Generate complete HTML document
    const html = this.generateHTMLExport(sections, custom)
    
    // Download as file
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'portfolio.html'
    a.click()
    URL.revokeObjectURL(url)
    
    this.showNotification('Portfolio exported as HTML!', 'success')
  }
  
  private generateHTMLExport(sections: PortfolioSection[], customization: any): string {
    // Generate a complete, standalone HTML file
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
    <link href="https://fonts.googleapis.com/css2?family=${customization.fontPrimary.replace(' ', '+')}:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
      :root {
        --accent: ${customization.primaryColor};
        --text-primary: ${customization.secondaryColor};
        --text-secondary: ${customization.accentColor};
      }
      body {
        font-family: '${customization.fontPrimary}', serif;
      }
    </style>
</head>
<body>
  ${sections.map(section => this.getSectionHTML(section)).join('\n')}
</body>
</html>`
  }
  
  private exportAsPDF(): void {
    // In a real implementation, this would use a library like jsPDF or html2pdf
    this.showNotification('PDF export coming soon!', 'info')
  }
  
  private generateShareLink(): void {
    // Save portfolio data and generate shareable link
    const data = useBuilderStore.getState().exportPortfolio()
    
    // In a real implementation, this would save to a backend and generate a URL
    // For now, copy to clipboard
    navigator.clipboard.writeText(data).then(() => {
      this.showNotification('Portfolio data copied to clipboard!', 'success')
    })
  }
  
  private showNotification(message: string, type: 'success' | 'error' | 'info' = 'info'): void {
    const notification = document.createElement('div')
    notification.className = `fixed top-20 right-6 px-6 py-4 rounded-lg shadow-lg z-50 animate-slide-in ${
      type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-blue-500'
    } text-white`
    notification.textContent = message
    
    document.body.appendChild(notification)
    
    setTimeout(() => {
      notification.classList.add('animate-slide-out')
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }
  
  // Public methods for button onclick handlers
  public editSection(id: string): void {
    const section = useBuilderStore.getState().sections.find(s => s.id === id)
    if (section) {
      useBuilderStore.getState().setCurrentSection(id)
      // Show property panel with section controls
      this.showSectionProperties(section)
    }
  }
  
  public deleteSection(id: string): void {
    if (confirm('Are you sure you want to delete this section?')) {
      useBuilderStore.getState().removeSection(id)
      this.renderPreview()
      this.showNotification('Section deleted', 'success')
    }
  }
  
  private showSectionProperties(section: PortfolioSection): void {
    const propertiesPanel = document.getElementById('section-properties')
    const controlsContainer = document.getElementById('section-controls')
    
    if (!propertiesPanel || !controlsContainer) return
    
    propertiesPanel.style.display = 'block'
    controlsContainer.innerHTML = `
      <div>
        <label class="block text-sm font-medium mb-2">Section Title</label>
        <input type="text" value="${section.title}" 
               class="w-full px-3 py-2 border border-gray-200 rounded"
               onchange="portfolioApp.updateSectionTitle('${section.id}', this.value)">
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Background Color</label>
        <input type="color" value="${section.styles.backgroundColor || '#FFFFFF'}"
               class="color-picker"
               onchange="portfolioApp.updateSectionBackground('${section.id}', this.value)">
      </div>
      <div>
        <label class="block text-sm font-medium mb-2">Text Color</label>
        <input type="color" value="${section.styles.textColor || '#1A1A1A'}"
               class="color-picker"
               onchange="portfolioApp.updateSectionTextColor('${section.id}', this.value)">
      </div>
    `
  }
  
  public updateSectionTitle(id: string, title: string): void {
    useBuilderStore.getState().updateSection(id, { title })
    this.renderPreview()
  }
  
  public updateSectionBackground(id: string, color: string): void {
    const section = useBuilderStore.getState().sections.find(s => s.id === id)
    if (section) {
      useBuilderStore.getState().updateSection(id, {
        styles: { ...section.styles, backgroundColor: color }
      })
      this.renderPreview()
    }
  }
  
  public updateSectionTextColor(id: string, color: string): void {
    const section = useBuilderStore.getState().sections.find(s => s.id === id)
    if (section) {
      useBuilderStore.getState().updateSection(id, {
        styles: { ...section.styles, textColor: color }
      })
      this.renderPreview()
    }
  }
}

// Initialize app when DOM is ready
let portfolioApp: PortfolioCraftApp

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    portfolioApp = new PortfolioCraftApp()
    // Expose to window for onclick handlers
    ;(window as any).portfolioApp = portfolioApp
  })
} else {
  portfolioApp = new PortfolioCraftApp()
  ;(window as any).portfolioApp = portfolioApp
}

export { PortfolioCraftApp }
