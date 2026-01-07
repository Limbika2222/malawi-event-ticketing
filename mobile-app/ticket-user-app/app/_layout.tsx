import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import 'react-native-reanimated'

import { useColorScheme } from '@/hooks/use-color-scheme'

export default function RootLayout() {
  const colorScheme = useColorScheme() ?? 'light'

  return (
    <ThemeProvider
      value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <Stack screenOptions={{ headerShown: false }}>
        {/* 🔑 Auth Gate */}
        <Stack.Screen name="index" />

        {/* 🌐 Public Screens */}
        <Stack.Screen name="landing" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="profile-setup" />

        {/* 📱 Main App */}
        <Stack.Screen name="(tabs)" />

        {/* 🧩 Optional modal */}
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal' }}
        />
      </Stack>

      <StatusBar style="auto" />
    </ThemeProvider>
  )
}
