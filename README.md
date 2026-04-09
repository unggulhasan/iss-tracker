# ISS Tracker

A Next.js application for tracking the International Space Station (ISS) in real-time.

## Features

- Real-time ISS location tracking
- Interactive map display
- Live updates of ISS position

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd iss-tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Docker

Build and run with Docker:

```bash
docker build -t iss-tracker .
docker run -p 3000:3000 iss-tracker
```

Build and push to a registry:

```bash
docker build -t your-registry/iss-tracker:latest .
docker push your-registry/iss-tracker:latest
```

## Project Structure

- `app/` - Next.js app directory
  - `components/` - React components
    - `ISSTracker.tsx` - Main ISS tracking component
  - `page.tsx` - Main page
  - `layout.tsx` - App layout
  - `globals.css` - Global styles

## Technologies Used

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is private.