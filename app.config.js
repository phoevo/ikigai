
export default {
  expo: {
    name: "ikigai",
    slug: "ikigai",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.mindwaves.ikigai"
    },
    android: {
      package: "com.mindwaves.ikigai",
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff"
      }
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          "image": "./assets/images/splash-icon.png",
          "imageWidth": 200,
          "resizeMode": "contain",
          "backgroundColor": "#ffffff"
        }
      ]
    ],
    experiments: {
      typedRoutes: true
    },
    extra: {
      DATABASE_ID: process.env.EXPO_PUBLIC_DATABASE_ID,
      COLLECTION_ID: process.env.EXPO_PUBLIC_COLLECTION_ID,
      DOCUMENT_ID: process.env.EXPO_PUBLIC_DOCUMENT_ID,
      EXPO_PUBLIC_ANTHROPIC_API_KEY: process.env.EXPO_PUBLIC_ANTHROPIC_API_KEY,
    }
  }
};
