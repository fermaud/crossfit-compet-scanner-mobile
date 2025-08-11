# CrossFit Event Scanner Mobile

A React Native mobile application built with Expo that displays CrossFit competitions and events in France. This is the mobile companion to the [CrossFit Competition Scanner](https://github.com/yourusername/crossfit-compet-scanner) web application.

## 🏋️ Features

### 📱 Core Functionality
- **Event Listing** - Browse all CrossFit competitions in France
- **Advanced Search** - Find events by name with debounced search (1 second delay)
- **Comprehensive Filters** - Filter by département, duration, date range, and source
- **Event Details** - View competition information, dates, and locations
- **External Links** - Direct access to event registration and location maps
- **Infinite Scroll** - Load events 10 by 10 with smooth pagination
- **End-of-List Indicator** - Clear visual feedback when all events are loaded

### 🔍 Advanced Filtering System
- **Département Filter** - Select specific French départements with searchable list
- **Duration Filter** - Filter by event duration (1, 2, or 3+ days)
- **Date Range** - Set minimum and maximum dates for events
- **Source Filter** - Filter by data source (ScoringFit, CompetitionCorner)
- **Filter Badge** - Visual indicator showing number of active filters
- **Quick Reset** - Easy filter clearing functionality

### 🎨 User Experience
- **Dark Theme** - Modern, eye-friendly interface optimized for mobile
- **Clean Header** - Professional app branding
- **Responsive Design** - Optimized for all screen sizes
- **Pull-to-Refresh** - Easy data updates
- **Native Performance** - Smooth animations and gestures
- **Loading States** - Clear feedback during data fetching

## 🚀 Tech Stack

- **React Native** with Expo SDK 53
- **TypeScript** for type safety
- **React Native DateTimePicker** for date selection
- **Dayjs** for date formatting and manipulation
- **Custom API Integration** with debounced requests
- **Optimized FlatList** with infinite scroll pagination

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (for iOS development) or Android Studio (for Android)
- Expo Go app on your mobile device for testing

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/crossfit-compet-scanner-mobile.git
   cd crossfit-compet-scanner-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Backend API URL - Use your computer's IP address for mobile testing
   EXPO_PUBLIC_BACKEND_URL=http://192.168.1.XXX:3030
   
   # For production deployment
   # EXPO_PUBLIC_BACKEND_URL=https://your-production-backend.com
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

5. **Run on device/simulator**
   - Scan QR code with Expo Go app (mobile)
   - Press `i` for iOS simulator
   - Press `a` for Android emulator

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   └── FilterModal.tsx
├── data/               # Static data files
│   └── departements.ts
├── screens/            # Screen components
│   └── EventListScreen.tsx
├── services/           # API services
│   └── api.ts
└── types/              # TypeScript type definitions
    └── Event.ts
```

## 🔧 Configuration

### Backend Connection
The app connects to the CrossFit Competition Scanner backend. Make sure:
- Backend server is running on the configured URL
- CORS is properly configured to allow mobile requests (no origin header)
- API endpoints are accessible from your mobile device
- Use your computer's local IP address (not localhost) for mobile testing

## 📱 Usage

### Event Browsing
- **Immediate Access** - Events load automatically on app launch
- **Search Events** - Type in the search bar (1-second delay for optimization)
- **Infinite Scroll** - Scroll down to load more events (10 at a time)
- **Event Details** - Tap event links to visit registration pages
- **Location Links** - Tap locations to open in maps app

### Advanced Filtering
- **Filter Button** - Tap the ⚙️ icon next to the search bar
- **Département Selection** - Choose specific French départements
- **Duration Filter** - Filter by 1, 2, or 3+ day events
- **Date Range** - Set minimum and maximum event dates
- **Source Filter** - Filter by ScoringFit or CompetitionCorner
- **Active Filters** - Red badge shows number of active filters
- **Reset Filters** - Clear all filters with one tap

## 🚀 Building for Production

### EAS Build (Recommended)
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Configure EAS
eas build:configure

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

### Legacy Expo Build
```bash
# iOS
expo build:ios

# Android
expo build:android
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Related Projects

- [CrossFit Competition Scanner Web](https://github.com/fermaud/crossfit-compet-scanner) - The Nuxt.js web version
- [CrossFit Competition Backend](https://github.com/yourusername/crossfit-compet-alert-backend) - The Node.js API backend

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check that your backend is running and accessible
- Ensure your mobile device is on the same network as your backend
- Verify CORS configuration allows requests without origin header

## 🔧 Troubleshooting

### Common Issues

**Network Request Failed**
- Check that backend is running on the configured URL
- Use your computer's IP address instead of localhost
- Verify CORS configuration allows mobile requests

**Events Not Loading**
- Ensure backend API is accessible from mobile device
- Check network connectivity
- Verify API endpoints return correct data format

**Filters Not Working**
- Check that backend supports all filter parameters
- Verify date format in API requests (YYYY-MM-DD)
- Ensure département numbers are correctly formatted

## 🙏 Acknowledgments

- CrossFit community for inspiration
- Expo team for the amazing development platform
- Supabase for authentication services

---

Built with ❤️ for the CrossFit community in France 🇫🇷
