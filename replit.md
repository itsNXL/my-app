# AI Image Generator - Replit Configuration

## Overview

This is a full-stack mobile-first web application for AI-powered image generation with themed prompts and photo transformation features. The system allows users to select from predefined themes (games, movies, TV shows) to generate images using OpenAI's DALL-E 3 API, with a special baby transformation feature for uploaded photos. The application includes a comprehensive admin panel for managing themes and prompts dynamically, plus analytics dashboard and image gallery.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for development and production builds
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: React Query (@tanstack/react-query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Mobile-First**: Designed as a mobile app experience with responsive design

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Session-based (connect-pg-simple for PostgreSQL session store)
- **File Upload**: Multer for handling image uploads
- **Development**: tsx for TypeScript execution in development

### Key Components

#### Database Schema
- **Users**: Basic user management with admin privileges
- **Themes**: Categorized prompts (games, movies, tv, baby) with usage tracking
- **Generated Images**: Tracks all generated images with metadata
- **Baby Transforms**: Special table for photo transformation records

#### API Structure
- `GET /api/themes` - Fetch themes by category
- `GET /api/themes/:id` - Get specific theme
- `POST /api/themes` - Create new theme (admin)
- `PUT /api/themes/:id` - Update theme (admin)
- `DELETE /api/themes/:id` - Delete theme (admin)
- `POST /api/generate/:id` - Generate image from theme
- `POST /api/baby-transform` - Transform uploaded photo to baby version
- `GET /api/recent-images` - Get recently generated images
- `GET /api/analytics` - Get usage analytics and statistics

#### UI Components
- **Theme Selection**: Category tabs and grid layout for theme browsing
- **Image Generation**: Progress tracking and result display with download/share
- **Baby Transform**: Photo upload and transformation interface
- **Gallery**: Image browsing with detailed view and sharing options
- **Admin Panel**: Comprehensive theme management with CRUD operations
- **Analytics Dashboard**: Usage statistics and popular theme tracking
- **Navigation**: Mobile-friendly bottom navigation with 4 main sections

## Data Flow

1. **Theme Selection**: User selects category → fetches themes → displays in grid
2. **Image Generation**: User selects theme → sends theme ID to backend → OpenAI API call → image URL returned
3. **Baby Transform**: User uploads photo → multer processes file → AI transformation → result displayed
4. **Admin Management**: Admin creates/edits themes → updates database → changes reflected in user interface

## External Dependencies

### Core Services
- **OpenAI API**: DALL-E 3 for image generation and GPT-4o for prompt enhancement
- **Neon Database**: PostgreSQL serverless database hosting
- **File Storage**: Local file system for temporary uploads (expandable to cloud storage)

### UI Libraries
- **Radix UI**: Headless component primitives
- **Lucide React**: Icon library
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Form handling and validation

### Development Tools
- **ESBuild**: Fast JavaScript bundler for production
- **Drizzle Kit**: Database schema management and migrations
- **Replit Integration**: Development environment optimization

## Deployment Strategy

### Development
- Run `npm run dev` for development server with hot reload
- Database migrations with `npm run db:push`
- TypeScript checking with `npm run check`

### Production
- Build process: `npm run build` (Vite + ESBuild)
- Start command: `npm start` (production server)
- Environment variables required:
  - `DATABASE_URL` (PostgreSQL connection)
  - `OPENAI_API_KEY` (OpenAI API access)
  - `NODE_ENV=production`

### Architecture Decisions

**Database Choice**: PostgreSQL with Drizzle ORM chosen for:
- Strong typing support with TypeScript
- Efficient query building and migrations
- Serverless compatibility with Neon

**State Management**: React Query over Redux because:
- Excellent server state synchronization
- Built-in caching and background updates
- Simplified API interaction patterns

**Styling Strategy**: Tailwind CSS + shadcn/ui for:
- Rapid development with utility classes
- Consistent design system
- Mobile-first responsive design
- Accessible component primitives

**Mobile-First Design**: Single-page app with mobile navigation because:
- Target use case is mobile image generation
- Simplified user experience
- Touch-friendly interface design

The application is designed to be scalable, with clear separation between frontend and backend, modular component architecture, and efficient database design for handling image generation workflows.