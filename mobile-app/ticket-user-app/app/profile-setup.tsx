import { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { auth, db } from '../firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

export default function ProfileSetup() {
  const router = useRouter()
  const params = useLocalSearchParams()

  const [dob, setDob] = useState<Date | null>(null)
  const [city, setCity] = useState('')
  const [showPicker, setShowPicker] = useState(false)
  const [saving, setSaving] = useState(false)

  // ✅ Safe param handling
  const fullName =
    typeof params.fullName === 'string' ? params.fullName : ''
  const gender =
    typeof params.gender === 'string' ? params.gender : ''

  const onDateChange = (_: unknown, selectedDate?: Date) => {
    setShowPicker(false)
    if (selectedDate) {
      setDob(selectedDate)
    }
  }

  const saveProfile = async () => {
    if (!dob || !city.trim()) {
      Alert.alert('Missing info', 'Please select date of birth and city')
      return
    }

    const user = auth.currentUser
    if (!user) {
      Alert.alert('Session expired', 'Please login again')
      router.replace('/login')
      return
    }

    try {
      setSaving(true)

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        fullName,
        gender,
        dob: dob.toISOString().split('T')[0], // YYYY-MM-DD
        city: city.trim(),
        profileCompleted: true,
        createdAt: serverTimestamp(),
      })

      // ✅ DIRECT redirect to app home
      router.replace('/(tabs)')
    } catch {
      Alert.alert('Error', 'Failed to complete profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <LinearGradient
      colors={['#1e3a8a', '#312e81', '#0f172a']}
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Complete your profile</Text>
        <Text style={styles.subtitle}>
          Just a few more details to get started
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Name: {fullName || '—'}</Text>
          <Text style={styles.infoText}>Gender: {gender || '—'}</Text>
        </View>

        {/* DOB Picker */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowPicker(true)}
          activeOpacity={0.85}
        >
          <Text style={{ color: dob ? '#ffffff' : '#c7d2fe' }}>
            {dob
              ? dob.toISOString().split('T')[0]
              : 'Select Date of Birth'}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={dob || new Date(2000, 0, 1)}
            mode="date"
            display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
            maximumDate={new Date()}
            onChange={onDateChange}
          />
        )}

        <TextInput
          placeholder="City"
          placeholderTextColor="#c7d2fe"
          style={styles.input}
          value={city}
          onChangeText={setCity}
        />

        <TouchableOpacity
          style={[styles.primaryButton, saving && { opacity: 0.7 }]}
          onPress={saveProfile}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#1e3a8a" />
          ) : (
            <Text style={styles.primaryText}>Finish Setup</Text>
          )}
        </TouchableOpacity>
      </View>
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
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: '#c7d2fe',
    textAlign: 'center',
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    padding: 14,
    borderRadius: 14,
    marginBottom: 24,
  },
  infoText: {
    color: '#e0e7ff',
    fontSize: 14,
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    color: '#ffffff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 14,
    marginBottom: 14,
  },
  primaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  primaryText: {
    color: '#1e3a8a',
    fontSize: 16,
    fontWeight: '600',
  },
})
