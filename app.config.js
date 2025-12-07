import 'dotenv/config';

export default {
  expo: {
    name: "iTravel",
    slug: "itravel",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    extra: {
      GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY,
      RAPID_API_KEY: process.env.RAPID_API_KEY
    },
    splash: {
      image: "./assets/restaurants.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    ios: {
      supportsTablet: true
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff"
      },
      edgeToEdgeEnabled: true
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    "plugins": [
      "expo-font"
    ]
  }
}
