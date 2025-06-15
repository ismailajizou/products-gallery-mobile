# Product Gallery Mobile App

A React Native mobile app built with Expo that displays a product catalog with search, filtering, favorites, and offline support.

## Features

- Product catalog with search and category filtering
- Price sorting (ascending/descending)
- Favorites with persistent storage
- Offline support with automatic caching
- Responsive design for phones and tablets

## Setup

### Prerequisites
- Node.js (v16+)
- Expo CLI: `npm install -g @expo/cli`
- Mobile device with Expo Go or emulator

### Installation
```bash
# Clone and install
git clone https://github.com/ismailajizou/products-gallery-mobile.git
cd mobile
npm install

# Start development server
npm start
```

Then scan the QR code with Expo Go or press `i`/`a` for iOS/Android simulator.

## Design Decisions

### Architecture
- **State Management**: Custom `useReducer` hook for simplicity over external libraries
- **Offline-First**: 24-hour caching with automatic API/cache fallback
- **Responsive**: Adaptive layouts for tablets vs phones
- **TypeScript**: Full type safety throughout

### Tech Stack
- Expo SDK 53 / React Native 0.79
- Expo Router for file-based navigation
- AsyncStorage for persistence
- Axios for API calls

## Improvements for More Time

### Performance & UX
- Image loading placeholders and better caching
- Skeleton loading states and animations
- Pull-to-refresh functionality

### Features
- Product detail screens with image galleries
- Shopping cart functionality
- Advanced search with autocomplete

### Quality
- Unit and E2E testing
- Error retry mechanisms
- Better error handling and user feedback
- CI/CD pipeline
