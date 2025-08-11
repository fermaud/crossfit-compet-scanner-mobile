# CrossFit Event Scanner Mobile

A React Native mobile application built with Expo that displays CrossFit competitions and events in France. This is the mobile companion to the [CrossFit Competition Scanner](https://github.com/yourusername/crossfit-compet-scanner) web application.

## 🏋️ Features

### 📱 Core Functionality
- **Event Listing** - Browse all CrossFit competitions in France
- **Search & Filter** - Find events by name, location, type, and duration
- **Event Details** - View competition information, dates, and locations
- **External Links** - Direct access to event registration and location maps

### 🔐 Authentication (Optional)
- **Guest Mode** - Full access to event browsing without login
- **User Authentication** - Powered by Supabase for enhanced features
- **Sidebar Login** - Convenient drawer-based authentication

### 🎨 User Experience
- **Dark Theme** - Modern, eye-friendly interface
- **Drawer Navigation** - Intuitive sidebar menu
- **Pull-to-Refresh** - Easy data updates
- **Native Performance** - Smooth animations and gestures

## 🚀 Tech Stack

- **React Native** with Expo SDK 53
- **TypeScript** for type safety
- **React Navigation** for drawer and stack navigation
- **Supabase** for authentication
- **AsyncStorage** for local data persistence
- **React Native Reanimated** for smooth animations

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
   # Backend API URL
   EXPO_PUBLIC_BACKEND_URL=http://your-backend-url:3030
   
   # Supabase configuration
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
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
│   └── CustomDrawerContent.tsx
├── config/             # Configuration files
│   └── supabase.ts
├── hooks/              # Custom React hooks
│   └── useAuth.ts
├── navigation/         # Navigation setup
│   └── AppNavigator.tsx
├── screens/            # Screen components
│   ├── EventListScreen.tsx
│   ├── HomeScreen.tsx
│   └── LoginScreen.tsx
├── services/           # API services
│   └── api.ts
└── types/              # TypeScript type definitions
    └── Event.ts
```

## 🔧 Configuration

### Backend Connection
The app connects to the CrossFit Competition Scanner backend. Make sure:
- Backend server is running on the configured URL
- CORS is properly configured to allow mobile requests
- API endpoints are accessible

### Supabase Setup
1. Create a Supabase project
2. Enable authentication
3. Add your URL and anon key to the `.env` file

## 📱 Usage

### Guest Mode
- Open the app to immediately see CrossFit events
- Search and browse without authentication
- Tap event links to visit registration pages
- Tap locations to open in maps

### Authenticated Mode
- Swipe from left to open sidebar menu
- Login with your credentials
- Access enhanced features (when implemented)

## 🚀 Building for Production

### iOS
```bash
expo build:ios
```

### Android
```bash
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

- [CrossFit Competition Scanner Web](https://github.com/yourusername/crossfit-compet-scanner) - The web version
- [CrossFit Competition Backend](https://github.com/yourusername/crossfit-compet-alert-backend) - The API backend

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check the [troubleshooting guide](#troubleshooting)

## 🙏 Acknowledgments

- CrossFit community for inspiration
- Expo team for the amazing development platform
- Supabase for authentication services

---

Built with ❤️ for the CrossFit community in France 🇫🇷
