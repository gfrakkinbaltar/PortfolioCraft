# PortfolioCraft - Professional Portfolio Builder

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/gaius/portfoliocraft)
[![Version](https://img.shields.io/badge/version-2.0.0-blue)](https://github.com/gaius/portfoliocraft)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A modern, interactive portfolio builder with advanced animations, drag-and-drop functionality, and real-time preview. Built with TypeScript, Vite, and cutting-edge web technologies.

## ✨ Features

### 🎨 Interactive Builder Interface
- **Drag-and-Drop Sections**: Easily add and rearrange portfolio sections
- **Live Preview**: See changes in real-time across different devices
- **Multi-Device Preview**: Switch between desktop, tablet, and mobile views
- **Customization Panel**: Fine-tune colors, fonts, and animations

### 🎭 Advanced Animations
- Scroll-triggered animations with Intersection Observer
- Physics-based particle backgrounds powered by Matter.js
- Smooth transitions using Anime.js
- Staggered text reveals and parallax effects

### 📱 Responsive & Modern
- Mobile-first design
- Optimized for all screen sizes
- Progressive web app ready
- Fast loading with code splitting

### 🎯 Section Library
- **Hero Sections**: 3D particles, video backgrounds, minimal designs
- **Content Sections**: About, Projects, Skills, Experience, Contact
- **Interactive Charts**: Skills visualization with ECharts
- **Timeline Components**: Animated work history

### 💾 State Management
- Persistent storage using Zustand
- Undo/Redo functionality
- History tracking for all changes
- Auto-save capability

### 📤 Export Options
- Export as standalone HTML
- PDF generation
- Shareable portfolio links
- JSON data export/import

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ or Bun
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/gaius/portfoliocraft.git
cd portfoliocraft

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview
```

The app will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
portfoliocraft/
├── src/
│   ├── components/          # Reusable React-like components (future)
│   ├── lib/
│   │   ├── animations.ts    # Animation controller
│   │   ├── particles.ts     # Particle system
│   │   └── store.ts         # State management
│   ├── types/
│   │   ├── portfolio.ts     # TypeScript interfaces
│   │   └── animejs.d.ts     # Animation types
│   ├── utils/               # Utility functions
│   └── main.ts              # Application entry point
├── resources/               # Images and assets
├── index.html               # Main builder page
├── templates.html           # Template gallery
├── resume.html              # Resume builder
├── vite.config.ts           # Vite configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## 🛠️ Technology Stack

### Core
- **TypeScript**: Type-safe development
- **Vite**: Lightning-fast build tool
- **Zustand**: Lightweight state management

### Animations & Graphics
- **Anime.js**: Powerful animation engine
- **Matter.js**: 2D physics engine
- **Pixi.js**: High-performance 2D graphics
- **Three.js**: 3D graphics and effects
- **P5.js**: Creative coding and generative art

### Data Visualization
- **ECharts**: Interactive charts and graphs
- **Splitting.js**: Advanced text animations

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Custom Fonts**: Curated typography selection

## 📖 Usage Guide

### Building Your Portfolio

1. **Start with a Template** (optional)
   - Browse pre-built templates in the Templates page
   - Choose a design that fits your style
   - Customize to make it your own

2. **Add Sections**
   - Drag sections from the left sidebar
   - Drop them into the preview area
   - Rearrange sections by dragging within the preview

3. **Customize Content**
   - Click any section to edit
   - Modify text, colors, and styling in the right panel
   - Adjust global settings for consistent theming

4. **Preview & Test**
   - Use device switcher to test responsiveness
   - Check animations and interactions
   - Verify all content displays correctly

5. **Export**
   - Save your portfolio data
   - Export as HTML for deployment
   - Generate shareable links

### Available Sections

#### Hero Sections
- **3D Particle Hero**: Interactive particle animation background
- **Video Background**: Full-screen video with overlay text
- **Minimal Hero**: Clean typography-focused design

#### Content Sections
- **About**: Personal introduction with image
- **Projects**: Grid layout for showcasing work
- **Skills**: Interactive skill charts and proficiency levels
- **Experience**: Timeline visualization of work history
- **Contact**: Contact form and social links

### Customization Options

#### Global Settings
- **Color Scheme**: Primary, secondary, and accent colors
- **Typography**: Font selection for headers and body text
- **Animation Speed**: Control animation timing globally
- **Particle Effects**: Enable/disable background particles

#### Section-Specific
- **Background Color**: Individual section backgrounds
- **Text Color**: Custom text colors per section
- **Padding**: Spacing control
- **Custom CSS**: Advanced styling options

## 🎯 Development

### Scripts

```bash
# Development
pnpm dev              # Start dev server
pnpm type-check       # TypeScript type checking

# Building
pnpm build            # Build for production
pnpm preview          # Preview production build

# Code Quality
pnpm lint             # Lint code
pnpm format           # Format with Prettier
```

### Adding New Sections

1. Define section type in `src/types/portfolio.ts`
2. Create default content in `main.ts` `getDefaultContent()`
3. Add rendering logic in `getSectionHTML()`
4. Add to section library in `index.html`

### State Management

The app uses Zustand for state management with persistence:

```typescript
import { useBuilderStore } from './lib/store'

// Add a section
useBuilderStore.getState().addSection(section)

// Update section
useBuilderStore.getState().updateSection(id, updates)

// Access state
const sections = useBuilderStore.getState().sections
```

### Animation System

The `AnimationController` class handles all animations:

```typescript
import { AnimationController } from './lib/animations'

const controller = new AnimationController()

// Initialize scroll animations
controller.initScrollAnimations()

// Create staggered animation
controller.staggerAnimation('.element', {
  duration: 600,
  delay: 100
})
```

## 🧪 Testing

The application has been tested for:
- ✅ TypeScript compilation
- ✅ Vite build process
- ✅ Dev server functionality
- ✅ State persistence
- ✅ Animation performance
- ✅ Responsive design

## 📦 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Other Platforms

The `dist/` folder contains static files that can be deployed to:
- Netlify
- GitHub Pages
- AWS S3
- Any static hosting service

## 🔮 Future Enhancements

- [ ] More section templates
- [ ] Advanced animation presets
- [ ] Collaboration features
- [ ] Backend integration for saving portfolios
- [ ] Template marketplace
- [ ] AI-powered content suggestions
- [ ] Analytics dashboard
- [ ] SEO optimization tools
- [ ] Custom domain support
- [ ] Plugin system

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Code Style

- Use TypeScript for all new code
- Follow ESLint rules
- Write descriptive commit messages
- Add comments for complex logic
- Keep functions small and focused

## 🐛 Known Issues

- PDF export requires additional library integration
- Some animations may be slow on low-end devices
- Team deployment requires proper Vercel permissions

## 📄 License

MIT © 2024-2025 Gaius

## 🙏 Acknowledgments

- Animation inspiration from [Awwwards](https://www.awwwards.com/)
- Design system inspired by modern portfolio trends
- Built with passion for creative professionals

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/gaius/portfoliocraft/issues)
- **Discussions**: [GitHub Discussions](https://github.com/gaius/portfoliocraft/discussions)
- **Email**: gaius@gai7us.com

---

**Built with ❤️ by Gaius**  
**Version**: 2.0.0  
**Last Updated**: November 16, 2025

