// PortfolioCraft - Main JavaScript File
// Advanced Portfolio Builder Platform

class PortfolioBuilder {
    constructor() {
        this.sections = [];
        this.currentSection = null;
        this.history = [];
        this.historyIndex = -1;
        this.customization = {
            primaryColor: '#E8D5C4',
            secondaryColor: '#1A1A1A',
            accentColor: '#4A4A4A',
            fontPrimary: 'Sorts Mill Goudy',
            animationSpeed: 1
        };
        
        this.init();
    }
    
    init() {
        this.initParticleSystem();
        this.initDragDrop();
        this.initAnimations();
        this.initEventListeners();
        this.initScrollAnimations();
        this.initTextEffects();
        this.saveState();
    }
    
    // Particle System Background
    initParticleSystem() {
        const canvas = document.getElementById('particle-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: 0, y: 0 };
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        
        const createParticles = () => {
            particles = [];
            const particleCount = Math.min(50, Math.floor(window.innerWidth / 20));
            
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    size: Math.random() * 3 + 1,
                    opacity: Math.random() * 0.5 + 0.2
                });
            }
        };
        
        const updateParticles = () => {
            particles.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;
                
                // Mouse interaction
                const dx = mouse.x - particle.x;
                const dy = mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    particle.vx -= dx * 0.00005;
                    particle.vy -= dy * 0.00005;
                }
                
                // Boundary check
                if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
                if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
                
                // Keep particles in bounds
                particle.x = Math.max(0, Math.min(canvas.width, particle.x));
                particle.y = Math.max(0, Math.min(canvas.height, particle.y));
            });
        };
        
        const drawParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw connections
            particles.forEach((particle, i) => {
                particles.slice(i + 1).forEach(otherParticle => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 150) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(232, 213, 196, ${0.1 * (1 - distance / 150)})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                });
            });
            
            // Draw particles
            particles.forEach(particle => {
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(232, 213, 196, ${particle.opacity})`;
                ctx.fill();
            });
        };
        
        const animate = () => {
            updateParticles();
            drawParticles();
            requestAnimationFrame(animate);
        };
        
        // Event listeners
        window.addEventListener('resize', () => {
            resizeCanvas();
            createParticles();
        });
        
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        
        // Initialize
        resizeCanvas();
        createParticles();
        animate();
    }
    
    // Drag and Drop System
    initDragDrop() {
        const dragItems = document.querySelectorAll('.drag-item');
        const dropZone = document.getElementById('main-drop-zone');
        const previewContainer = document.getElementById('portfolio-preview');
        
        let draggedElement = null;
        
        dragItems.forEach(item => {
            item.addEventListener('dragstart', (e) => {
                draggedElement = item;
                item.style.opacity = '0.5';
                
                // Add visual feedback
                anime({
                    targets: item,
                    scale: 0.95,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
            
            item.addEventListener('dragend', (e) => {
                item.style.opacity = '1';
                anime({
                    targets: item,
                    scale: 1,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
        });
        
        // Drop zone handling
        if (dropZone) {
            dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                dropZone.classList.add('drag-over');
            });
            
            dropZone.addEventListener('dragleave', (e) => {
                dropZone.classList.remove('drag-over');
            });
            
            dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                dropZone.classList.remove('drag-over');
                
                if (draggedElement) {
                    const sectionType = draggedElement.dataset.sectionType;
                    this.addSection(sectionType);
                }
            });
        }
        
        // Make preview sections sortable
        this.initSortable();
    }
    
    initSortable() {
        const preview = document.getElementById('portfolio-preview');
        if (!preview) return;
        
        let draggedItem = null;
        let placeholder = null;
        
        preview.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('portfolio-section')) {
                draggedItem = e.target;
                placeholder = document.createElement('div');
                placeholder.className = 'sortable-placeholder';
                placeholder.style.height = e.target.offsetHeight + 'px';
                placeholder.style.background = 'rgba(232, 213, 196, 0.2)';
                placeholder.style.border = '2px dashed #E8D5C4';
                placeholder.style.borderRadius = '8px';
                placeholder.style.margin = '8px 0';
            }
        });
        
        preview.addEventListener('dragover', (e) => {
            e.preventDefault();
            const afterElement = this.getDragAfterElement(preview, e.clientY);
            if (afterElement == null) {
                preview.appendChild(placeholder);
            } else {
                preview.insertBefore(placeholder, afterElement);
            }
        });
        
        preview.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedItem && placeholder) {
                preview.insertBefore(draggedItem, placeholder);
                placeholder.remove();
                this.updateSectionOrder();
                this.saveState();
            }
        });
    }
    
    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.portfolio-section:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    // Section Management
    addSection(type) {
        const section = {
            id: 'section-' + Date.now(),
            type: type,
            content: this.getSectionContent(type),
            settings: this.getDefaultSettings(type)
        };
        
        this.sections.push(section);
        this.renderSection(section);
        this.updateSectionOrder();
        this.saveState();
        
        // Show success feedback
        this.showNotification('Section added successfully!', 'success');
    }
    
    getSectionContent(type) {
        const contents = {
            'hero-3d': {
                title: 'Creative Developer',
                subtitle: 'Building digital experiences that inspire',
                ctaText: 'View My Work',
                ctaLink: '#projects'
            },
            'hero-video': {
                title: 'Welcome to My Portfolio',
                subtitle: 'Where creativity meets technology',
                videoUrl: 'https://example.com/hero-video.mp4'
            },
            'hero-minimal': {
                title: 'John Doe',
                subtitle: 'Full Stack Developer & Designer',
                tagline: 'Available for freelance work'
            },
            'about': {
                title: 'About Me',
                content: 'I am a passionate developer with 5+ years of experience creating web applications and digital experiences. My expertise spans frontend and backend technologies, with a focus on user-centered design and performance optimization.',
                image: 'resources/professional-headshot.jpg'
            },
            'projects': {
                title: 'Featured Projects',
                projects: [
                    {
                        title: 'E-Commerce Platform',
                        description: 'Full-stack web application with React and Node.js',
                        image: 'https://via.placeholder.com/400x300',
                        tags: ['React', 'Node.js', 'MongoDB']
                    },
                    {
                        title: 'Mobile App Design',
                        description: 'UI/UX design for fitness tracking application',
                        image: 'https://via.placeholder.com/400x300',
                        tags: ['Figma', 'Prototyping', 'User Research']
                    },
                    {
                        title: 'Data Visualization',
                        description: 'Interactive dashboard for business analytics',
                        image: 'https://via.placeholder.com/400x300',
                        tags: ['D3.js', 'Python', 'PostgreSQL']
                    }
                ]
            },
            'skills': {
                title: 'Skills & Expertise',
                skills: [
                    { name: 'JavaScript', level: 90 },
                    { name: 'React', level: 85 },
                    { name: 'Node.js', level: 80 },
                    { name: 'Python', level: 75 },
                    { name: 'UI/UX Design', level: 70 }
                ]
            },
            'experience': {
                title: 'Work Experience',
                experiences: [
                    {
                        title: 'Senior Frontend Developer',
                        company: 'Tech Company',
                        period: '2022 - Present',
                        description: 'Leading frontend development team and implementing modern web technologies.'
                    },
                    {
                        title: 'Full Stack Developer',
                        company: 'Startup Inc.',
                        period: '2020 - 2022',
                        description: 'Developed and maintained multiple web applications using React and Node.js.'
                    }
                ]
            },
            'contact': {
                title: 'Get In Touch',
                subtitle: 'Ready to collaborate on your next project',
                email: 'hello@example.com',
                phone: '+1 (555) 123-4567',
                social: [
                    { platform: 'LinkedIn', url: 'https://linkedin.com/in/example' },
                    { platform: 'GitHub', url: 'https://github.com/example' },
                    { platform: 'Twitter', url: 'https://twitter.com/example' }
                ]
            }
        };
        
        return contents[type] || {};
    }
    
    getDefaultSettings(type) {
        const settings = {
            'hero-3d': {
                particleCount: 50,
                animationSpeed: 1,
                colorScheme: 'default'
            },
            'projects': {
                layout: 'grid',
                columns: 3,
                showFilters: true
            },
            'skills': {
                chartType: 'radar',
                animation: true
            }
        };
        
        return settings[type] || {};
    }
    
    renderSection(section) {
        const preview = document.getElementById('portfolio-preview');
        if (!preview) return;
        
        const sectionElement = document.createElement('div');
        sectionElement.className = 'portfolio-section mb-6 p-6 bg-white rounded-lg shadow-sm border border-gray-200';
        sectionElement.id = section.id;
        sectionElement.draggable = true;
        
        sectionElement.innerHTML = this.generateSectionHTML(section);
        
        // Remove welcome section if this is the first section
        const welcomeSection = preview.querySelector('.welcome-section');
        if (welcomeSection && this.sections.length === 1) {
            welcomeSection.remove();
        }
        
        preview.appendChild(sectionElement);
        
        // Add click handler for section selection
        sectionElement.addEventListener('click', () => {
            this.selectSection(section.id);
        });
        
        // Animate section appearance
        anime({
            targets: sectionElement,
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 600,
            easing: 'easeOutQuad'
        });
    }
    
    generateSectionHTML(section) {
        const content = section.content;
        
        switch (section.type) {
            case 'hero-3d':
                return `
                    <div class="hero-3d-section text-center py-20 relative overflow-hidden">
                        <div class="hero-particles absolute inset-0" id="particles-${section.id}"></div>
                        <div class="relative z-10">
                            <h1 class="font-display text-5xl md:text-6xl font-bold mb-4 text-white">${content.title}</h1>
                            <p class="text-xl mb-8 text-gray-200">${content.subtitle}</p>
                            <a href="${content.ctaLink}" class="btn-primary text-lg px-8 py-3">${content.ctaText}</a>
                        </div>
                    </div>
                `;
                
            case 'about':
                return `
                    <div class="about-section">
                        <h2 class="font-display text-3xl font-bold mb-6 text-center">${content.title}</h2>
                        <div class="flex flex-col md:flex-row items-center gap-8">
                            <div class="md:w-1/3">
                                <img src="${content.image}" alt="About me" class="w-48 h-48 rounded-full object-cover mx-auto">
                            </div>
                            <div class="md:w-2/3">
                                <p class="text-lg leading-relaxed">${content.content}</p>
                            </div>
                        </div>
                    </div>
                `;
                
            case 'projects':
                const projectsHTML = content.projects.map(project => `
                    <div class="project-card bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                        <img src="${project.image}" alt="${project.title}" class="w-full h-48 object-cover">
                        <div class="p-6">
                            <h3 class="font-display text-xl font-bold mb-2">${project.title}</h3>
                            <p class="text-secondary mb-4">${project.description}</p>
                            <div class="flex flex-wrap gap-2">
                                ${project.tags.map(tag => `<span class="px-3 py-1 bg-accent text-white text-sm rounded-full">${tag}</span>`).join('')}
                            </div>
                        </div>
                    </div>
                `).join('');
                
                return `
                    <div class="projects-section">
                        <h2 class="font-display text-3xl font-bold mb-8 text-center">${content.title}</h2>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            ${projectsHTML}
                        </div>
                    </div>
                `;
                
            case 'skills':
                const skillsHTML = content.skills.map(skill => `
                    <div class="skill-item mb-4">
                        <div class="flex justify-between mb-2">
                            <span class="font-medium">${skill.name}</span>
                            <span class="text-secondary">${skill.level}%</span>
                        </div>
                        <div class="w-full bg-gray-200 rounded-full h-2">
                            <div class="skill-bar bg-accent h-2 rounded-full" data-width="${skill.level}%"></div>
                        </div>
                    </div>
                `).join('');
                
                return `
                    <div class="skills-section">
                        <h2 class="font-display text-3xl font-bold mb-8 text-center">${content.title}</h2>
                        <div class="max-w-2xl mx-auto">
                            ${skillsHTML}
                        </div>
                    </div>
                `;
                
            case 'experience':
                const experienceHTML = content.experiences.map(exp => `
                    <div class="experience-item mb-6 p-6 bg-gray-50 rounded-lg">
                        <div class="flex justify-between items-start mb-3">
                            <h3 class="font-display text-xl font-bold">${exp.title}</h3>
                            <span class="text-secondary text-sm">${exp.period}</span>
                        </div>
                        <p class="font-medium text-accent mb-2">${exp.company}</p>
                        <p class="text-secondary">${exp.description}</p>
                    </div>
                `).join('');
                
                return `
                    <div class="experience-section">
                        <h2 class="font-display text-3xl font-bold mb-8 text-center">${content.title}</h2>
                        ${experienceHTML}
                    </div>
                `;
                
            case 'contact':
                const socialHTML = content.social.map(social => `
                    <a href="${social.url}" class="text-accent hover:text-accent-dark transition-colors">
                        ${social.platform}
                    </a>
                `).join(' • ');
                
                return `
                    <div class="contact-section text-center">
                        <h2 class="font-display text-3xl font-bold mb-4">${content.title}</h2>
                        <p class="text-lg mb-8 text-secondary">${content.subtitle}</p>
                        
                        <div class="max-w-md mx-auto space-y-4 mb-8">
                            <div class="flex items-center justify-center space-x-3">
                                <svg class="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                                </svg>
                                <span>${content.email}</span>
                            </div>
                            
                            <div class="flex items-center justify-center space-x-3">
                                <svg class="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"></path>
                                </svg>
                                <span>${content.phone}</span>
                            </div>
                        </div>
                        
                        <div class="text-center">
                            ${socialHTML}
                        </div>
                    </div>
                `;
                
            default:
                return `<div class="p-4 bg-gray-100 rounded">Section type "${section.type}" not implemented yet.</div>`;
        }
    }
    
    selectSection(sectionId) {
        // Remove previous selection
        document.querySelectorAll('.portfolio-section').forEach(section => {
            section.classList.remove('selected');
        });
        
        // Add selection to current section
        const sectionElement = document.getElementById(sectionId);
        if (sectionElement) {
            sectionElement.classList.add('selected');
            this.currentSection = this.sections.find(s => s.id === sectionId);
            this.showSectionProperties();
        }
    }
    
    showSectionProperties() {
        const propertiesPanel = document.getElementById('section-properties');
        const controlsContainer = document.getElementById('section-controls');
        
        if (!this.currentSection || !propertiesPanel) return;
        
        propertiesPanel.style.display = 'block';
        controlsContainer.innerHTML = this.generatePropertyControls(this.currentSection);
    }
    
    generatePropertyControls(section) {
        const controls = {
            'hero-3d': `
                <div>
                    <label class="block text-sm font-medium mb-2">Hero Title</label>
                    <input type="text" value="${section.content.title}" class="w-full px-3 py-2 border border-gray-200 rounded" 
                           onchange="portfolioBuilder.updateSectionContent('${section.id}', 'title', this.value)">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Subtitle</label>
                    <input type="text" value="${section.content.subtitle}" class="w-full px-3 py-2 border border-gray-200 rounded" 
                           onchange="portfolioBuilder.updateSectionContent('${section.id}', 'subtitle', this.value)">
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Particle Count</label>
                    <input type="range" min="10" max="100" value="${section.settings.particleCount}" 
                           onchange="portfolioBuilder.updateSectionSetting('${section.id}', 'particleCount', this.value)">
                </div>
            `,
            'projects': `
                <div>
                    <label class="block text-sm font-medium mb-2">Layout</label>
                    <select class="w-full px-3 py-2 border border-gray-200 rounded" 
                            onchange="portfolioBuilder.updateSectionSetting('${section.id}', 'layout', this.value)">
                        <option value="grid" ${section.settings.layout === 'grid' ? 'selected' : ''}>Grid</option>
                        <option value="masonry" ${section.settings.layout === 'masonry' ? 'selected' : ''}>Masonry</option>
                        <option value="carousel" ${section.settings.layout === 'carousel' ? 'selected' : ''}>Carousel</option>
                    </select>
                </div>
                <div>
                    <label class="block text-sm font-medium mb-2">Columns</label>
                    <input type="range" min="1" max="4" value="${section.settings.columns}" 
                           onchange="portfolioBuilder.updateSectionSetting('${section.id}', 'columns', this.value)">
                </div>
            `,
            'skills': `
                <div>
                    <label class="block text-sm font-medium mb-2">Chart Type</label>
                    <select class="w-full px-3 py-2 border border-gray-200 rounded" 
                            onchange="portfolioBuilder.updateSectionSetting('${section.id}', 'chartType', this.value)">
                        <option value="radar" ${section.settings.chartType === 'radar' ? 'selected' : ''}>Radar Chart</option>
                        <option value="bars" ${section.settings.chartType === 'bars' ? 'selected' : ''}>Progress Bars</option>
                        <option value="pie" ${section.settings.chartType === 'pie' ? 'selected' : ''}>Pie Chart</option>
                    </select>
                </div>
            `
        };
        
        return controls[section.type] || '<p class="text-secondary">No properties available for this section.</p>';
    }
    
    updateSectionContent(sectionId, property, value) {
        const section = this.sections.find(s => s.id === sectionId);
        if (section && section.content) {
            section.content[property] = value;
            this.rerenderSection(section);
            this.saveState();
        }
    }
    
    updateSectionSetting(sectionId, setting, value) {
        const section = this.sections.find(s => s.id === sectionId);
        if (section && section.settings) {
            section.settings[setting] = value;
            this.rerenderSection(section);
            this.saveState();
        }
    }
    
    rerenderSection(section) {
        const element = document.getElementById(section.id);
        if (element) {
            element.innerHTML = this.generateSectionHTML(section);
            
            // Re-initialize animations for the section
            this.initSectionAnimations(element);
        }
    }
    
    updateSectionOrder() {
        const preview = document.getElementById('portfolio-preview');
        const sections = preview.querySelectorAll('.portfolio-section');
        const newOrder = [];
        
        sections.forEach(element => {
            const section = this.sections.find(s => s.id === element.id);
            if (section) {
                newOrder.push(section);
            }
        });
        
        this.sections = newOrder;
    }
    
    removeSection(sectionId) {
        const index = this.sections.findIndex(s => s.id === sectionId);
        if (index > -1) {
            this.sections.splice(index, 1);
            const element = document.getElementById(sectionId);
            if (element) {
                anime({
                    targets: element,
                    opacity: 0,
                    translateX: -50,
                    duration: 400,
                    easing: 'easeOutQuad',
                    complete: () => {
                        element.remove();
                        this.saveState();
                    }
                });
            }
        }
    }
    
    // Animation System
    initAnimations() {
        // Initialize skill bar animations
        this.animateSkillBars();
        
        // Initialize section entrance animations
        this.initSectionAnimations();
    }
    
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-bar');
        skillBars.forEach(bar => {
            const width = bar.dataset.width;
            anime({
                targets: bar,
                width: width,
                duration: 1000,
                delay: 200,
                easing: 'easeOutQuad'
            });
        });
    }
    
    initSectionAnimations(container = document) {
        const sections = container.querySelectorAll('.portfolio-section');
        sections.forEach((section, index) => {
            // Add entrance animation
            anime({
                targets: section,
                opacity: [0, 1],
                translateY: [30, 0],
                duration: 600,
                delay: index * 100,
                easing: 'easeOutQuad'
            });
            
            // Add hover effects
            section.addEventListener('mouseenter', () => {
                anime({
                    targets: section,
                    scale: 1.02,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
            
            section.addEventListener('mouseleave', () => {
                anime({
                    targets: section,
                    scale: 1,
                    duration: 200,
                    easing: 'easeOutQuad'
                });
            });
        });
    }
    
    // Scroll Animations
    initScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Trigger specific animations based on element type
                    if (entry.target.classList.contains('skill-bar')) {
                        this.animateSkillBars();
                    }
                }
            });
        }, observerOptions);
        
        // Observe all sections
        document.querySelectorAll('.portfolio-section').forEach(section => {
            observer.observe(section);
        });
    }
    
    // Text Effects
    initTextEffects() {
        // Initialize Splitting.js for text animations
        if (typeof Splitting !== 'undefined') {
            Splitting();
            
            // Animate split text
            const splitText = document.querySelectorAll('[data-splitting]');
            splitText.forEach(element => {
                const chars = element.querySelectorAll('.char');
                anime({
                    targets: chars,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 800,
                    delay: anime.stagger(50),
                    easing: 'easeOutQuad'
                });
            });
        }
        
        // Initialize Typed.js effects
        const typedElements = document.querySelectorAll('[data-typed]');
        typedElements.forEach(element => {
            const text = element.dataset.typed;
            if (typeof Typed !== 'undefined') {
                new Typed(element, {
                    strings: [text],
                    typeSpeed: 50,
                    showCursor: false
                });
            }
        });
    }
    
    // Event Listeners
    initEventListeners() {
        // Device preview buttons
        const deviceBtns = document.querySelectorAll('.device-btn');
        deviceBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                deviceBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.changeDevicePreview(btn.dataset.device);
            });
        });
        
        // Device selector dropdown
        const deviceSelector = document.getElementById('device-selector');
        if (deviceSelector) {
            deviceSelector.addEventListener('change', (e) => {
                this.changeDevicePreview(e.target.value);
            });
        }
        
        // Undo/Redo buttons
        const undoBtn = document.getElementById('undo-btn');
        const redoBtn = document.getElementById('redo-btn');
        
        if (undoBtn) undoBtn.addEventListener('click', () => this.undo());
        if (redoBtn) redoBtn.addEventListener('click', () => this.redo());
        
        // Save button
        const saveBtn = document.getElementById('save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.savePortfolio();
                this.showNotification('Portfolio saved successfully!', 'success');
            });
        }
        
        // Export buttons
        const exportHtmlBtn = document.getElementById('export-html');
        const exportPdfBtn = document.getElementById('export-pdf');
        const shareLinkBtn = document.getElementById('share-link');
        
        if (exportHtmlBtn) {
            exportHtmlBtn.addEventListener('click', () => {
                this.exportHTML();
                this.showNotification('HTML export started!', 'info');
            });
        }
        
        if (exportPdfBtn) {
            exportPdfBtn.addEventListener('click', () => {
                this.exportPDF();
                this.showNotification('PDF export started!', 'info');
            });
        }
        
        if (shareLinkBtn) {
            shareLinkBtn.addEventListener('click', () => {
                this.generateShareLink();
                this.showNotification('Share link generated!', 'success');
            });
        }
        
        // Mobile menu toggle
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
        
        // Sidebar toggle for mobile
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                const sidebar = document.querySelector('.builder-sidebar');
                sidebar.classList.toggle('open');
            });
        }
        
        // Panel toggle for mobile
        const panelToggle = document.getElementById('panel-toggle');
        if (panelToggle) {
            panelToggle.addEventListener('click', () => {
                const panel = document.querySelector('.builder-panel');
                panel.classList.remove('open');
            });
        }
        
        // Color picker changes
        const colorPickers = document.querySelectorAll('input[type="color"]');
        colorPickers.forEach(picker => {
            picker.addEventListener('change', (e) => {
                this.updateCustomization(e.target.id, e.target.value);
            });
        });
        
        // Font selector
        const fontSelector = document.getElementById('font-primary');
        if (fontSelector) {
            fontSelector.addEventListener('change', (e) => {
                this.updateCustomization('fontPrimary', e.target.value);
            });
        }
        
        // Animation speed slider
        const animationSpeed = document.getElementById('animation-speed');
        if (animationSpeed) {
            animationSpeed.addEventListener('input', (e) => {
                this.updateCustomization('animationSpeed', parseFloat(e.target.value));
            });
        }
    }
    
    changeDevicePreview(device) {
        const previewContainer = document.getElementById('preview-container');
        if (!previewContainer) return;
        
        // Remove existing device classes
        previewContainer.classList.remove('device-desktop', 'device-tablet', 'device-mobile');
        
        // Add new device class
        previewContainer.classList.add(`device-${device}`);
        
        // Update responsive styles
        const iframe = previewContainer.querySelector('#portfolio-preview');
        if (iframe) {
            switch (device) {
                case 'desktop':
                    iframe.style.width = '100%';
                    iframe.style.height = '600px';
                    break;
                case 'tablet':
                    iframe.style.width = '768px';
                    iframe.style.height = '1024px';
                    break;
                case 'mobile':
                    iframe.style.width = '375px';
                    iframe.style.height = '667px';
                    break;
            }
        }
        
        // Animate the transition
        anime({
            targets: previewContainer,
            scale: [0.95, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });
    }
    
    updateCustomization(property, value) {
        this.customization[property] = value;
        this.applyCustomization();
        this.saveState();
    }
    
    applyCustomization() {
        const root = document.documentElement;
        
        // Update CSS custom properties
        root.style.setProperty('--accent', this.customization.primaryColor);
        root.style.setProperty('--text-primary', this.customization.secondaryColor);
        root.style.setProperty('--text-secondary', this.customization.accentColor);
        
        // Update font family
        document.body.style.fontFamily = this.customization.fontPrimary;
        
        // Update animation speed
        document.documentElement.style.setProperty('--animation-speed', this.customization.animationSpeed);
    }
    
    // History Management
    saveState() {
        const state = {
            sections: this.sections,
            customization: this.customization,
            timestamp: Date.now()
        };
        
        // Remove future history if we're not at the end
        this.history = this.history.slice(0, this.historyIndex + 1);
        
        // Add new state
        this.history.push(state);
        this.historyIndex++;
        
        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
    }
    
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.loadState(this.history[this.historyIndex]);
            this.showNotification('Undo successful', 'info');
        } else {
            this.showNotification('Nothing to undo', 'warning');
        }
    }
    
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.loadState(this.history[this.historyIndex]);
            this.showNotification('Redo successful', 'info');
        } else {
            this.showNotification('Nothing to redo', 'warning');
        }
    }
    
    loadState(state) {
        this.sections = state.sections || [];
        this.customization = state.customization || this.customization;
        
        // Clear and rebuild preview
        const preview = document.getElementById('portfolio-preview');
        if (preview) {
            preview.innerHTML = '';
            
            if (this.sections.length === 0) {
                // Show welcome section
                preview.innerHTML = `
                    <div class="welcome-section p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100 min-h-96 flex items-center justify-center">
                        <div>
                            <div class="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg class="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                                </svg>
                            </div>
                            <h3 class="font-display text-2xl font-bold mb-2">Start Building Your Portfolio</h3>
                            <p class="text-secondary mb-6">Drag sections from the library to begin creating your stunning portfolio</p>
                            <div class="drop-zone flex items-center justify-center" id="main-drop-zone">
                                <p class="text-secondary">Drop your first section here</p>
                            </div>
                        </div>
                    </div>
                `;
            } else {
                // Render all sections
                this.sections.forEach(section => {
                    this.renderSection(section);
                });
            }
        }
        
        // Apply customization
        this.applyCustomization();
    }
    
    // Export Functions
    savePortfolio() {
        const portfolioData = {
            sections: this.sections,
            customization: this.customization,
            timestamp: Date.now(),
            version: '1.0'
        };
        
        localStorage.setItem('portfolioCraft-data', JSON.stringify(portfolioData));
        return portfolioData;
    }
    
    exportHTML() {
        const portfolioData = this.savePortfolio();
        
        // Create a complete HTML document
        const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Coda&family=Hedvig+Letters+Sans&family=Jersey+15&family=Jersey+20+Charted&family=Liter&family=Luckiest+Guy&family=Oranienbaum&family=Press+Start+2P&family=Quattrocento+Sans&family=Sorts+Mill+Goudy&family=Unna&display=swap" rel="stylesheet">
    <style>
        :root {
            --accent: ${this.customization.primaryColor};
            --text-primary: ${this.customization.secondaryColor};
            --text-secondary: ${this.customization.accentColor};
        }
        body { font-family: '${this.customization.fontPrimary}', serif; }
    </style>
</head>
<body>
    ${this.generateExportHTML()}
</body>
</html>`;
        
        // Download the file
        const blob = new Blob([htmlContent], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'portfolio.html';
        a.click();
        URL.revokeObjectURL(url);
    }
    
    generateExportHTML() {
        let html = '';
        
        this.sections.forEach(section => {
            html += `<div class="section">${this.generateSectionHTML(section)}</div>`;
        });
        
        return html;
    }
    
    exportPDF() {
        // This would typically integrate with a PDF library like jsPDF
        this.showNotification('PDF export feature coming soon!', 'info');
    }
    
    generateShareLink() {
        const portfolioData = this.savePortfolio();
        const encodedData = btoa(JSON.stringify(portfolioData));
        const shareUrl = `${window.location.origin}${window.location.pathname}?data=${encodedData}`;
        
        // Copy to clipboard
        navigator.clipboard.writeText(shareUrl).then(() => {
            this.showNotification('Share link copied to clipboard!', 'success');
        });
    }
    
    loadSharedPortfolio() {
        const urlParams = new URLSearchParams(window.location.search);
        const dataParam = urlParams.get('data');
        
        if (dataParam) {
            try {
                const portfolioData = JSON.parse(atob(dataParam));
                this.loadState(portfolioData);
                this.showNotification('Shared portfolio loaded!', 'success');
            } catch (e) {
                this.showNotification('Failed to load shared portfolio', 'error');
            }
        }
    }
    
    // Mobile Menu
    toggleMobileMenu() {
        const menu = document.querySelector('.mobile-menu');
        if (menu) {
            menu.classList.toggle('open');
        }
    }
    
    // Notifications
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type} fixed top-20 right-6 z-50 px-6 py-4 rounded-lg shadow-lg text-white max-w-sm`;
        notification.style.background = type === 'success' ? '#2D5A27' : type === 'error' ? '#8B0000' : '#1E3A8A';
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        anime({
            targets: notification,
            translateX: [300, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutQuad'
        });
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            anime({
                targets: notification,
                translateX: 300,
                opacity: 0,
                duration: 300,
                easing: 'easeInQuad',
                complete: () => {
                    notification.remove();
                }
            });
        }, 3000);
    }
}

// Initialize the application
let portfolioBuilder;

document.addEventListener('DOMContentLoaded', () => {
    portfolioBuilder = new PortfolioBuilder();
    
    // Load shared portfolio if URL contains data
    portfolioBuilder.loadSharedPortfolio();
    
    // Load saved portfolio from localStorage
    const savedData = localStorage.getItem('portfolioCraft-data');
    if (savedData) {
        try {
            const portfolioData = JSON.parse(savedData);
            portfolioBuilder.loadState(portfolioData);
        } catch (e) {
            console.error('Failed to load saved portfolio:', e);
        }
    }
});

// Global functions for inline event handlers
window.portfolioBuilder = portfolioBuilder;