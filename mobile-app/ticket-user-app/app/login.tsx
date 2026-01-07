import { useState } from 'react'
import {
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase' // ✅ FIXED PATH

export default function Login() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const login = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Missing info', 'Please enter email and password')
      return
    }

    try {
      setLoading(true)

      await signInWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      )

      // Let auth gate (app/index.tsx) decide next screen
      router.replace('/')

    } catch (err: any) {
      switch (err.code) {
        case 'auth/wrong-password':
          Alert.alert('Login failed', 'Wrong password')
          break
        case 'auth/user-not-found':
          Alert.alert('Login failed', 'User not found')
          break
        case 'auth/invalid-email':
          Alert.alert('Login failed', 'Invalid email address')
          break
        case 'auth/network-request-failed':
          Alert.alert('Network error', 'Check your internet connection')
          break
        default:
          Alert.alert('Login error', err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <LinearGradient
      colors={['#1e3a8a', '#312e81', '#0f172a']}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.container}
      >
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Login to continue</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#c7d2fe"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#c7d2fe"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.primaryButton, loading && { opacity: 0.7 }]}
          onPress={login}
          disabled={loading}
        >
          <Text style={styles.primaryText}>
            {loading ? 'Signing in…' : 'Login'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/register')}>
          <Text style={styles.link}>
            Don’t have an account? Create one
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#c7d2fe',
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    color: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 16,
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  primaryText: {
    color: '#1e3a8a',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    color: '#e0e7ff',
    textAlign: 'center',
    fontSize: 14,
  },
})
