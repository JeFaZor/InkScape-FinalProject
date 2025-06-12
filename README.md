# INKSCAPE - Tattoo Artist Discovery Platform

A modern platform for connecting tattoo seekers with their perfect artists in Israel, powered by AI image analysis and Instagram integration.

## About

INKSCAPE is an innovative platform designed to revolutionize how people find tattoo artists in Israel. Using advanced AI image recognition technology and Instagram integration, the platform creates perfect matches between clients and artists based on style preferences, location, and ratings.

## Key Features

### Smart Search & Discovery
- **Style-based search**: Browse artists by tattoo styles and specializations
- **Geographic search**: Find artists by location with radius filtering
- **Tag-based filtering**: Filter by specific attributes (color, size, style elements)
- **Text search**: Search by artist name or bio content

### AI-Powered Image Analysis
- **Style recognition**: Automatic tattoo style detection using Gemini AI
- **Smart matching**: Find artists who specialize in detected styles
- **Element identification**: Analyze key components and characteristics
- **High accuracy**: Advanced analysis system with 90%+ accuracy rate

### Instagram Integration
- **Live portfolios**: Display latest work directly from Instagram
- **Automatic sync**: Real-time content updates every 6 hours
- **Smart caching**: Optimized performance and loading times

### Multi-language Support
- **Hebrew & English**: Complete interface in both languages
- **RTL Support**: Full right-to-left text direction support
- **Cultural adaptation**: Design tailored for Israeli users

### Professional Profiles
- **Artist dashboards**: Comprehensive profile and portfolio management
- **Rating system**: Reviews and ratings from verified clients
- **Business tools**: Analytics and client management features

## Technology Stack

### Frontend
- React 17.0.2
- React Router Dom
- Tailwind CSS
- i18next (internationalization)
- Leaflet (interactive maps)
- Lucide React (icons)

### Backend
- Node.js + Express
- Google Generative AI (Gemini)
- Multer (file handling)
- CORS support

### Database & Infrastructure
- Supabase (PostgreSQL)
- Supabase Storage
- Redis (caching)

### External APIs
- Instagram API
- OpenStreetMap Nominatim (geocoding)

## Project Structure

```
INKSCAPE/
├── general-medium-peafowl-react/    # Frontend React Application
│   ├── src/
│   │   ├── components/              # React components
│   │   ├── views/                   # Main pages
│   │   ├── lib/                     # Utilities
│   │   └── styles/                  # Styling
│   └── public/
│       ├── en/                      # English translations
│       └── he/                      # Hebrew translations
│
├── general-medium-peafowl-backend/  # Backend Node.js Application
│   ├── server.js                    # Main server
│   ├── geminiStyleAnalyzer.js       # AI style analyzer
│   └── package.json
│
└── docs/                            # Project documentation
```

## Installation & Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm or yarn
- Supabase account
- Google Cloud API Key (for Gemini service)

### Frontend Setup

```bash
# Clone the repository
git clone [repository-url]
cd general-medium-peafowl-react

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Edit .env.local with your credentials:
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key

# Start development server
npm start
```

### Backend Setup

```bash
# Navigate to backend directory
cd general-medium-peafowl-backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Edit .env with your credentials:
GEMINI_API_KEY=your_gemini_api_key
PORT=5000

# Start the server
npm start
```

### Database Setup

1. Create a new Supabase project
2. Import the database schema from `docs/Database structure.txt`
3. Set up Row Level Security (RLS) policies
4. Configure authentication settings

## Database Schema

The application uses the following main tables:

- **users**: User accounts and basic information
- **artist_profiles**: Extended profiles for tattoo artists
- **styles**: Tattoo style definitions and categories
- **styles_artists**: Junction table for artist-style relationships
- **reviews**: User reviews and ratings
- **search_history**: Search tracking and analytics

## API Endpoints

### Image Analysis
- `POST /api/analyze-tattoo` - Analyze uploaded tattoo images
- `GET /api/test-gemini` - Test Gemini API connection

### Artists
- `GET /api/artists` - Fetch artists with filtering options

### Testing
- `GET /api/test` - Basic server health check

## Development

### Available Scripts

**Frontend:**
- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests

**Backend:**
- `npm start` - Start server
- `npm test` - Run tests

### Environment Variables

**Frontend (.env.local):**
```
REACT_APP_SUPABASE_URL=your_supabase_project_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**Backend (.env):**
```
GEMINI_API_KEY=your_google_ai_api_key
PORT=5000
```

## Architecture

The system follows a Client-Server architecture with MVC pattern:

- **Model**: Data operations using Supabase (PostgreSQL)
- **View**: React-based web interface with responsive design
- **Controller**: Express.js server handling business logic and AI integration

Key architectural decisions:
- Microservices approach for AI analysis
- Real-time capabilities with Supabase
- Caching layer with Redis for performance
- RESTful API design

## Performance Metrics

Target performance indicators:
- Image analysis: < 5 seconds
- Search results: < 2 seconds
- Profile loading: < 2 seconds
- System availability: 99.9%

## Contributing

This project was developed as part of a Computer Science capstone project by:
- **Ido Bashari** (ID: 207132077)
- **Lior Toledano** (ID: 207455528)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Google AI (Gemini) for image analysis capabilities
- Supabase for backend infrastructure
- OpenStreetMap for location services
- The tattoo artist community in Israel for inspiration and feedback
