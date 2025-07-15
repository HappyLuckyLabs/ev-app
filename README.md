# EV Connect - Tesla Vehicle Diagnostics

A mobile-optimized web application for viewing Tesla vehicle diagnostics, battery information, and charging data through Tesla's official API.

## Features

- **Tesla API Integration**: Real-time vehicle data from Tesla's official Fleet API
- **Battery Monitoring**: SoC %, estimated range, energy remaining, health metrics
- **Charging Details**: Amps, voltage, power, charge state, and limits
- **Vehicle Context**: Speed, odometer, location, door states
- **Mobile Optimized**: Touch-friendly interface with responsive design
- **Export/Share**: Export vehicle data in multiple formats
- **Registration Search**: Look up vehicles by registration plate

## Tech Stack

- **React 18** with TypeScript
- **Tailwind CSS v4** for styling
- **Shadcn/ui** component library
- **Vite** for build tooling
- **Vercel** for deployment

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Tesla Developer Account (for real Tesla API access)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/ev-connect.git
cd ev-connect
```

2. Install dependencies:
```bash
npm install
```

3. Set up Tesla API credentials (optional - app works in demo mode without):
   - Sign up at [Tesla Developer Portal](https://developer.tesla.com/)
   - Create a new Tesla App
   - Copy your Client ID and Client Secret
   - Create a `.env.local` file:
```env
TESLA_CLIENT_ID=your_tesla_client_id
TESLA_CLIENT_SECRET=your_tesla_client_secret
TESLA_REDIRECT_URI=http://localhost:3000/callback
```

4. Start the development server:
```bash
npm run dev
```

## Deployment

### Deploy to Vercel

1. **Quick Deploy**:
   [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/ev-connect)

2. **Manual Deploy**:
   - Push code to GitHub
   - Connect GitHub repo to Vercel
   - Set environment variables in Vercel dashboard:
     - `TESLA_CLIENT_ID`
     - `TESLA_CLIENT_SECRET`
     - `TESLA_REDIRECT_URI` (your-domain.vercel.app/callback)

### Deploy to Other Platforms

The app is a standard React SPA and can be deployed to:
- **Netlify**: `npm run build` → deploy `dist/` folder
- **GitHub Pages**: Use `gh-pages` package
- **AWS S3**: Upload `dist/` folder with CloudFront
- **Firebase Hosting**: Use Firebase CLI

## Tesla API Setup

### Step 1: Create Tesla Developer Account
1. Go to [developer.tesla.com](https://developer.tesla.com/)
2. Sign up with your Tesla account
3. Complete developer verification

### Step 2: Create Tesla App
1. Create a new application in the Tesla Developer Console
2. Set your redirect URI to: `https://yourdomain.com/callback`
3. Note your Client ID and Client Secret

### Step 3: Configure Application
Option A - Environment Variables:
```env
TESLA_CLIENT_ID=your_client_id
TESLA_CLIENT_SECRET=your_client_secret
TESLA_REDIRECT_URI=https://yourdomain.com/callback
```

Option B - Programmatic Configuration:
```typescript
import { configureTeslaApi } from './services/config';

configureTeslaApi({
  clientId: 'your_client_id',
  clientSecret: 'your_client_secret',
  redirectUri: 'https://yourdomain.com/callback'
});
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
├── components/           # React components
│   ├── ui/              # Shadcn/ui components
│   └── ...              # App-specific components
├── services/            # API services and utilities
├── styles/              # Global CSS styles
├── App.tsx              # Main app component
└── src/
    └── main.tsx         # App entry point
```

## Features Overview

### Authentication
- Tesla OAuth 2.0 integration
- Demo mode for testing without API credentials
- Secure token storage and refresh

### Vehicle Data
- Real-time battery and charging metrics
- Vehicle diagnostics and health checks
- Location tracking (when permitted)
- Historical data trends

### Mobile Experience
- Touch-optimized interface
- Responsive design for all screen sizes
- Native app-like navigation
- Offline-capable (planned)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Disclaimer

This application is not affiliated with Tesla, Inc. Tesla is a trademark of Tesla, Inc. This app uses Tesla's official API in compliance with their terms of service.

## Support

For support, please open an issue on GitHub or contact [your-email@example.com](mailto:your-email@example.com).