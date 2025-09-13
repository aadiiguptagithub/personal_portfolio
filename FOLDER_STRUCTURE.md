# Project Folder Structure

This document outlines the organized folder structure of the React Portfolio project.

## 📁 Frontend Structure

```
Frontend/src/
├── assets/                    # Static assets
│   ├── company/              # Company logos
│   ├── icons/                # SVG icons and logos
│   ├── images/               # PNG/JPEG images
│   ├── tech/                 # Technology stack images
│   └── index.js              # Asset exports
│
├── components/               # React components
│   ├── canvas/              # 3D canvas components
│   │   ├── Ball.jsx
│   │   ├── Computers.jsx
│   │   ├── Earth.jsx
│   │   ├── Stars.jsx
│   │   └── index.js
│   │
│   ├── context/             # Context providers
│   │   ├── BlogContext.jsx
│   │   ├── WorkContext.jsx
│   │   └── index.js
│   │
│   ├── forms/               # Form components
│   │   ├── AdminLogin.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── index.js
│   │
│   ├── layout/              # Layout components
│   │   ├── Footer.jsx
│   │   ├── Navbar.jsx
│   │   └── index.js
│   │
│   ├── pages/               # Page components
│   │   ├── About.jsx
│   │   ├── AboutUs.jsx
│   │   ├── BlogDetail.jsx
│   │   ├── BlogList.jsx
│   │   ├── Contact.jsx
│   │   ├── ContactUs.jsx
│   │   ├── Experience.jsx
│   │   ├── Feedbacks.jsx
│   │   ├── Hero.jsx
│   │   ├── Tech.jsx
│   │   ├── Work.jsx
│   │   ├── Works.jsx
│   │   └── index.js
│   │
│   ├── ui/                  # Reusable UI components
│   │   ├── AdminDashboard.jsx
│   │   ├── Loader.jsx
│   │   └── index.js
│   │
│   └── index.js             # Main component exports
│
├── config/                  # Configuration files
│   ├── constants/           # App constants
│   ├── styles.js           # Style configurations
│   └── index.js
│
├── dashboard/               # Admin dashboard
│   ├── components/          # Dashboard components
│   │   ├── AdminProfileModal.jsx
│   │   ├── BlogModal.jsx
│   │   ├── BlogTable.jsx
│   │   ├── ProjectModal.jsx
│   │   ├── ProjectTable.jsx
│   │   ├── Sidebar.jsx
│   │   ├── StatCards.jsx
│   │   ├── Topbar.jsx
│   │   ├── UserModal.jsx
│   │   ├── UserTable.jsx
│   │   └── index.js
│   │
│   ├── pages/               # Dashboard pages
│   │   ├── admindashboard.jsx
│   │   ├── adminlogin.jsx
│   │   └── index.js
│   │
│   └── index.js
│
├── hoc/                     # Higher-order components
│   ├── SectionWrapper.jsx
│   └── index.js
│
├── hooks/                   # Custom React hooks (for future use)
│
├── utils/                   # Utility functions
│   └── motion.js
│
├── App.jsx                  # Main App component
├── index.css               # Global styles
└── main.jsx                # App entry point
```

## 🎯 Folder Purpose

### **Components**
- **canvas/**: 3D Three.js components for interactive elements
- **context/**: React Context providers for state management
- **forms/**: Authentication and form components
- **layout/**: Header, footer, and layout components
- **pages/**: Main page components and sections
- **ui/**: Reusable UI components and widgets

### **Assets**
- **company/**: Company and client logos
- **icons/**: SVG icons and brand logos
- **images/**: General images and photos
- **tech/**: Technology stack icons

### **Config**
- **constants/**: App-wide constants and configurations
- **styles.js**: Tailwind and style configurations

### **Dashboard**
- **components/**: Admin dashboard specific components
- **pages/**: Admin dashboard pages

### **Utils & HOC**
- **hoc/**: Higher-order components for code reuse
- **hooks/**: Custom React hooks (ready for future use)
- **utils/**: Utility functions and helpers

## 📦 Import Examples

```javascript
// Page components
import { Hero, About, Work } from '../components/pages';

// Layout components
import { Navbar, Footer } from '../components/layout';

// Context providers
import { BlogProvider, WorkProvider } from '../components/context';

// UI components
import { Loader } from '../components/ui';

// Canvas components
import { EarthCanvas, StarsCanvas } from '../components/canvas';

// Assets
import { logo, github, linkedin } from '../assets';

// Config
import { navLinks, projects } from '../config';
```

## ✅ Benefits

1. **Better Organization**: Components are grouped by functionality
2. **Easier Maintenance**: Related files are kept together
3. **Scalability**: Easy to add new components in appropriate folders
4. **Import Clarity**: Clear import paths with barrel exports
5. **Team Collaboration**: Developers can easily find and work on specific features
6. **Code Reusability**: UI components can be easily shared across pages

## 🔄 Migration Notes

All existing imports have been updated to work with the new structure. The project maintains full functionality while providing better organization for future development.