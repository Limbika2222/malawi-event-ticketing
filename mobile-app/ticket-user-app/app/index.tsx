import { View, ActivityIndicator, StyleSheet } from 'react-native'
import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setTimeout(() => {
        if (user) {
          router.replace('/(tabs)')
        } else {
          router.replace('/landing')
        }
      }, 100)
    })

    return unsubscribe
  }, [router]) // ✅ FIX: router added

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#1e3a8a" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
