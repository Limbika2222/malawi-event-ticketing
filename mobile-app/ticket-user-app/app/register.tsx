import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Pressable,
  Alert,
} from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useRouter } from 'expo-router'

export default function Register() {
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [gender, setGender] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [genderModal, setGenderModal] = useState(false)

  const register = async () => {
    if (!fullName || !gender || !email || !password || !confirmPassword) {
      Alert.alert('Missing information', 'Please fill in all fields')
      return
    }

    if (password.length < 6) {
      Alert.alert('Weak password', 'Password must be at least 6 characters')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Password mismatch', 'Passwords do not match')
      return
    }

    try {
      setLoading(true)

      // 1️⃣ Create auth user
      const cred = await createUserWithEmailAndPassword(
        auth,
        email.trim().toLowerCase(),
        password
      )

      const uid = cred.user.uid

      // 2️⃣ Save user profile to Firestore
      await setDoc(doc(db, 'users', uid), {
        fullName,
        gender,
        email: email.trim().toLowerCase(),
        role: 'user',
        createdAt: serverTimestamp(),
      })

      // 3️⃣ Go back to auth gate
      router.replace('/')
    } catch (err: any) {
      if (err.code === 'auth/email-already-in-use') {
        Alert.alert('Account exists', 'Email already registered')
      } else if (err.code === 'auth/invalid-email') {
        Alert.alert('Invalid email', 'Please enter a valid email address')
      } else {
        Alert.alert('Registration failed', err.message)
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
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join and start booking events</Text>

        <TextInput
          placeholder="Full Name"
          placeholderTextColor="#c7d2fe"
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
        />

        <TouchableOpacity
          style={styles.input}
          onPress={() => setGenderModal(true)}
        >
          <Text style={{ color: gender ? '#ffffff' : '#c7d2fe' }}>
            {gender || 'Select Gender'}
          </Text>
        </TouchableOpacity>

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

        <TextInput
          placeholder="Repeat Password"
          placeholderTextColor="#c7d2fe"
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.primaryButton, loading && { opacity: 0.7 }]}
          onPress={register}
          disabled={loading}
        >
          <Text style={styles.primaryText}>
            {loading ? 'Creating account…' : 'Register'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace('/login')}>
          <Text style={styles.link}>Already have an account? Login</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>

      <Modal visible={genderModal} transparent animationType="fade">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setGenderModal(false)}
        >
          <View style={styles.modalBox}>
            {['Male', 'Female', 'Other'].map((g) => (
              <TouchableOpacity
                key={g}
                style={styles.modalItem}
                onPress={() => {
                  setGender(g)
                  setGenderModal(false)
                }}
              >
                <Text style={styles.modalText}>{g}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
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
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: '#c7d2fe',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    color: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 14,
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 18,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#020617',
    width: '70%',
    borderRadius: 16,
    paddingVertical: 10,
  },
  modalItem: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalText: {
    color: '#ffffff',
    fontSize: 16,
  },
})
