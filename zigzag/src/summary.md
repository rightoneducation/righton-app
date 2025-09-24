# ZigZag Project - Technical Summary

## Project Overview
ZigZag is a React-based web application built with modern web technologies, designed to be scalable and maintainable. The project is currently in early development with a foundation that supports rapid feature development.

## Tech Stack

### Core Framework
- **React 19.1.0** - Latest version of React with modern features
- **TypeScript 4.4.2** - Static typing for better code quality and developer experience
- **Create React App** - Bootstrapped project structure with built-in build tools

### Styling & UI
- **Material-UI (MUI) 7.1.0** - Comprehensive React component library following Material Design principles
- **Emotion 11.14.0** - CSS-in-JS library for component-based styling
- **Styled Components 6.1.18** - Alternative CSS-in-JS approach for component styling
- **Framer Motion 12.23.6** - Animation library for smooth, performant animations

### State Management & Data
- **AWS Amplify** - Backend-as-a-Service for authentication, API, and database
- **GraphQL** - Query language for APIs with auto-generated schema and operations
- **React Router DOM 7.6.0** - Client-side routing for single-page application

### Internationalization
- **i18next 25.1.2** - Internationalization framework
- **react-i18next 15.5.1** - React bindings for i18next
- **i18next-browser-languagedetector** - Automatic language detection

### Additional Libraries
- **Swiper 11.2.10** - Touch slider for mobile-friendly interactions
- **Portable Text 3.2.1** - Rich text content handling
- **UUID 11.1.0** - Unique identifier generation

## Code Styling & Architecture

### Styling Approach
The project uses a **hybrid styling strategy** combining multiple approaches:

1. **CSS-in-JS with Emotion** - Primary styling method for component-specific styles
2. **Styled Components** - Alternative CSS-in-JS approach for complex component styling
3. **Material-UI Components** - Pre-built, accessible components with consistent design system
4. **Traditional CSS** - Global styles and utility classes (App.css, index.css)

### Code Quality & Standards
- **ESLint 9.32.0** - Code linting with Airbnb configuration
- **Prettier 3.5.3** - Code formatting with single quote preference
- **TypeScript strict mode** - Enforced type safety and best practices
- **React Hooks rules** - Enforced React best practices

### Project Structure
```
src/
├── components/          # Reusable UI components
├── containers/          # Page-level components
├── pages/              # Route-based page components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and helpers
├── graphql/            # Auto-generated GraphQL operations
├── images/             # Static assets and icons
└── App.tsx             # Main application component
```

## Development Workflow

### Package Management
- **Yarn** - Primary package manager (yarn.lock present)
- **NPM fallback** - package-lock.json also available for compatibility

### Build & Development
- **Development server** - `yarn start` (localhost:3000)
- **Production build** - `yarn build`
- **Testing** - `yarn test` with Jest and React Testing Library
- **Hot reloading** - Automatic page refresh during development

### Code Generation
- **GraphQL CodeGen** - Auto-generates TypeScript types and operations
- **Amplify CLI** - Backend resource management and code generation

## Backend Integration

### AWS Amplify Services
- **Authentication** - User management and security
- **API Gateway** - RESTful and GraphQL API endpoints
- **Database** - DynamoDB with GraphQL schema
- **Storage** - File upload and management
- **Hosting** - Static site hosting and CDN

### GraphQL Schema
- **User Management** - User CRUD operations
- **Daily Questions** - Content management system
- **Auto-generated operations** - Queries, mutations, and subscriptions

## Design System Considerations

### Component Library
- **Material-UI v7** - Latest version with improved performance and accessibility
- **Design tokens** - Consistent spacing, colors, and typography
- **Responsive design** - Mobile-first approach with breakpoint system

### Animation & Interaction
- **Framer Motion** - Smooth transitions and micro-interactions
- **Touch-friendly** - Swiper integration for mobile gestures
- **Performance optimized** - Hardware acceleration and frame rate optimization

## Getting Started 

### Key Files to Review
1. **package.json** - Dependencies and project configuration
2. **src/App.tsx** - Main application structure
3. **src/components/** - Reusable UI components
4. **src/App.css** - Global styling examples

### Design System Integration
- **Material-UI theme** - Customizable design tokens
- **Component variants** - Pre-built component states and styles
- **Responsive breakpoints** - Mobile-first responsive design

