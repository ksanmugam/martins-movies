# 🎬 Martin's Movies

A modern, responsive movie discovery and tracking application built with React, TypeScript, Chakra UI, and TanStack Query.

## ✨ Features

- **Movie Discovery**: Browse popular movies and search by keywords
- **Responsive Design**: Beautiful UI that works on all devices
- **Movie Tracking**: Mark movies as watched with persistent storage
- **IMDB Integration**: Direct links to IMDB when available
- **Smart Caching**: Efficient API calls with intelligent caching
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation
- **Performance**: Optimized loading states and smooth animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 or higher
- npm 8.0 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ksanmugam/martins-movies.git
   cd martins-movies
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

## 3. Set up environment variables

1. **Create and configure your environment file**

Copy the example file to create `.env.development`:

```bash
cp .env.example .env.development
```

Then open `.env.development` in a text editor and add your own values. Replace `your_api_key_here` with your TMDB API key:

```env
VITE_APP_TITLE="Martin's Movies"
VITE_APP_DESCRIPTION="Discover and track your favorite movies"

VITE_TMDB_API_KEY=your_api_key_here

VITE_ENABLE_ANALYTICS=false
VITE_ENABLE_DEV_TOOLS=true

VITE_DEV_MODE=true
```

4. **Start the development server**
   ```bash
   pnpm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:3000`

## 🔑 Getting a TMDB API Key

1. Visit [The Movie Database](https://www.themoviedb.org/)
2. Create a free account
3. Go to Settings → API
4. Request an API key for developer use
5. Copy your API key to the `.env` file

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Card/   # Individual movie card
│   │   ├── MovieCard.tsx   # Individual movie card
│   ├── Common/   # Individual movie card
│   │   ├── SearchBar.tsx   # Search functionality
│   │   └── Pagination.tsx  # Page navigation
├── constants/   # Individual movie card
│   ├── placeholder.ts   # Individual movie card
│   ├── tmdb.constants.ts   # Individual movie card
├── hooks/              # Custom React hooks
│   └── useMovies.ts    # TanStack Query hooks
├── services/           # API layer
│   └── tmdbApi.ts      # TMDB API integration
├── theme/              # Chakra UI theme
│   └── chakraTheme.ts  # Custom theme configuration
├── types/              # TypeScript definitions
│   └── movie.types.ts  # Movie-related types
├── utils/              # Utility functions
│   └── helpers.ts      # Helper functions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## 🛠️ Built With

### Core Technologies
- **React 18** - Modern React with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server

### UI & Styling
- **Chakra UI** - Modular and accessible component library
- **Emotion** - CSS-in-JS styling

### Data Management
- **TanStack Query** - Powerful data synchronization
- **TMDB API** - The Movie Database REST API

### Development Tools
- **ESLint** - Code linting with modern configuration
- **TypeScript** - Static type checking
- **Vite** - Fast build tool and dev server
- **TanStack Query DevTools** - Development debugging tools

## 📝 Available Scripts

- `pnpm run dev` - Start development server
- `pnpm run build` - Build for production
- `pnpm run preview` - Preview production build
- `pnpm run lint` - Run ESLint
- `pnpm run lint:fix` - Fix ESLint errors
- `pnpm run type-check` - Check TypeScript types

## 🎨 Features in Detail

### Movie Discovery
- Browse popular movies with pagination
- Search movies by title and keywords
- Responsive grid layout with consistent card heights

### Movie Tracking
- Mark movies as "watched" with visual indicators
- Persistent storage using localStorage (with fallback)
- Watch status survives browser sessions

### Performance Optimizations
- Smart API caching with TanStack Query
- Image lazy loading
- Optimized bundle splitting
- Efficient re-renders with React best practices

### Accessibility
- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly
- High contrast mode support
- Focus management

### Error Handling
- Comprehensive error boundaries
- Network error detection
- Automatic retry with exponential backoff
- User-friendly error messages
- Loading states for all async operations

## 🚀 Deployment

### Build for Production
```bash
pnpm run build
```

### Deploy to Netlify
1. Build the project: `pnpm run build`
2. Upload the `dist` folder to Netlify
3. Set environment variables in Netlify dashboard

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🔧 Configuration

### Environment Variables
- `VITE_TMDB_API_KEY` - Your TMDB API key (required)
- `VITE_APP_TITLE` - Application title (optional)
- `VITE_ENABLE_ANALYTICS` - Enable analytics tracking (optional)

### Customization
- **Theme**: Edit `src/theme/chakraTheme.ts` for colors and styling
- **API**: Modify `src/services/tmdbApi.ts` for API customization
- **Components**: Extend components in `src/components/`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [The Movie Database (TMDB)](https://www.themoviedb.org/) for the amazing API
- [Chakra UI](https://chakra-ui.com/) for the excellent component library
- [TanStack Query](https://tanstack.com/query) for powerful data management

## 📞 Support

If you have any questions or need help, please:
- Open an issue on GitHub
- Check the documentation
- Join our community discussions

---

**Made with ❤️ by the Martin's Movies team**