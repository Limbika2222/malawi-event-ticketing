import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { signOut } from 'firebase/auth'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { auth, db } from '../firebase'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import DateTimePicker from '@react-native-community/datetimepicker'
import { Ionicons } from '@expo/vector-icons'

export default function Profile() {
  const router = useRouter()
  const user = auth.currentUser

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [fullName, setFullName] = useState('')
  const [gender, setGender] = useState('')
  const [email, setEmail] = useState('')
  const [dob, setDob] = useState<Date | null>(null)
  const [photoURL, setPhotoURL] = useState<string | null>(null)
  const [showPicker, setShowPicker] = useState(false)

  // 🔹 Load profile
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        router.replace('/landing')
        return
      }

      try {
        const snap = await getDoc(doc(db, 'users', user.uid))
        if (snap.exists()) {
          const data = snap.data()
          setFullName(data.fullName || '')
          setGender(data.gender || '')
          setEmail(user.email || '')
          setPhotoURL(data.photoURL || null)
          if (data.dob) setDob(new Date(data.dob))
        }
      } catch {
        Alert.alert('Error', 'Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [router, user])

  // 🖼️ Pick profile image
  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync()
    if (!permission.granted) {
      Alert.alert('Permission required', 'Allow photo access')
      return
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    })

    if (!result.canceled) {
      const compressed = await ImageManipulator.manipulateAsync(
        result.assets[0].uri,
        [{ resize: { width: 400 } }],
        {
          compress: 0.6,
          format: ImageManipulator.SaveFormat.JPEG,
        }
      )

      setPhotoURL(compressed.uri)
    }
  }

  // 💾 Save profile
  const saveProfile = async () => {
    if (!user || !dob) {
      Alert.alert('Missing info', 'Please select date of birth')
      return
    }

    try {
      setSaving(true)

      await updateDoc(doc(db, 'users', user.uid), {
        fullName,
        gender,
        dob: dob.toISOString().split('T')[0],
        photoURL,
      })

      Alert.alert('Success', 'Profile updated')
    } catch {
      Alert.alert('Error', 'Failed to save profile')
    } finally {
      setSaving(false)
    }
  }

  // 🚪 Logout
  const logout = async () => {
    await signOut(auth)
    router.replace('/landing')
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 🔙 BACK */}
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={26} color="#1e3a8a" />
        </TouchableOpacity>

        {/* 👤 AVATAR */}
        <TouchableOpacity onPress={pickImage}>
          <Image
            source={{ uri: photoURL || 'https://i.pravatar.cc/200' }}
            style={styles.avatar}
          />
          <Text style={styles.changePhoto}>Change photo</Text>
        </TouchableOpacity>

        {/* ✏️ DETAILS */}
        <TextInput
          style={styles.input}
          placeholder="Full name"
          value={fullName}
          onChangeText={setFullName}
        />

        <TextInput
          style={styles.input}
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
        />

        <TextInput
          style={[styles.input, styles.disabled]}
          value={email}
          editable={false}
        />

        {/* 🎂 DOB */}
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowPicker(true)}
        >
          <Text style={{ color: dob ? '#000' : '#9ca3af' }}>
            {dob ? dob.toDateString() : 'Select Date of Birth'}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={dob || new Date(2000, 0, 1)}
            mode="date"
            maximumDate={new Date()}
            onChange={(_, selectedDate) => {
              setShowPicker(false)
              if (selectedDate) setDob(selectedDate)
            }}
          />
        )}

        {/* 💾 SAVE */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={saveProfile}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text style={styles.saveText}>Save Profile</Text>
          )}
        </TouchableOpacity>

        {/* 🚪 LOGOUT */}
        <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtn: {
    marginTop: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 6,
  },
  changePhoto: {
    color: '#1e3a8a',
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#f1f5f9',
    padding: 14,
    borderRadius: 12,
    marginBottom: 14,
    fontSize: 15,
  },
  disabled: {
    backgroundColor: '#e5e7eb',
  },
  saveBtn: {
    backgroundColor: '#1e3a8a',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  logoutBtn: {
    marginTop: 26,
    alignItems: 'center',
  },
  logoutText: {
    color: '#dc2626',
    fontWeight: '600',
  },
})
