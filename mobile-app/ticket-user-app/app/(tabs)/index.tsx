import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { Calendar } from 'react-native-calendars'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'
import { useEffect, useState } from 'react'
import { auth, db } from '../../firebase'
import { doc, getDoc } from 'firebase/firestore'

const EVENTS = [
  {
    id: '1',
    title: 'Neon Beats Festival',
    date: '2026-01-12',
    venue: 'Bingu Stadium',
    image: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2',
  },
  {
    id: '2',
    title: 'The Lunar Echoes',
    date: '2026-01-18',
    venue: 'Civo Stadium',
    image: 'https://images.unsplash.com/photo-1497032205916-ac775f0649ae',
  },
]

export default function HomeTab() {
  const router = useRouter()
  const user = auth.currentUser

  const [photoURL, setPhotoURL] = useState<string | null>(null)
  const [loadingAvatar, setLoadingAvatar] = useState(true)

  // 🔹 Load user avatar from Firestore
  useEffect(() => {
    const loadAvatar = async () => {
      if (!user) {
        setLoadingAvatar(false)
        return
      }

      try {
        const snap = await getDoc(doc(db, 'users', user.uid))
        if (snap.exists()) {
          setPhotoURL(snap.data().photoURL || null)
        }
      } catch {
        // silently fail → fallback avatar
      } finally {
        setLoadingAvatar(false)
      }
    }

    loadAvatar()
  }, [user])

  return (
    <LinearGradient
      colors={['#1e3a8a', '#312e81']}
      style={{ flex: 1 }}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          {/* 👤 PROFILE AVATAR */}
          <TouchableOpacity onPress={() => router.push('/profile')}>
            {loadingAvatar ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Image
                source={{
                  uri: photoURL || 'https://i.pravatar.cc/100',
                }}
                style={styles.avatar}
              />
            )}
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Home</Text>

          <Text style={styles.bell}>🔔</Text>
        </View>

        {/* 📅 CALENDAR */}
        <View style={styles.calendarBox}>
          <Calendar
            theme={{
              backgroundColor: '#ffffff',
              calendarBackground: '#ffffff',
              todayTextColor: '#1e3a8a',
              selectedDayBackgroundColor: '#1e3a8a',
              arrowColor: '#1e3a8a',
              monthTextColor: '#1e3a8a',
              textDayFontWeight: '500',
            }}
            markedDates={{
              '2026-01-12': { marked: true, dotColor: '#1e3a8a' },
              '2026-01-18': { marked: true, dotColor: '#1e3a8a' },
            }}
          />
        </View>

        {/* 🎟 EVENTS */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending Events</Text>

          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={EVENTS}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.eventCard}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.eventImage}
                />
                <Text style={styles.eventTitle}>{item.title}</Text>
                <Text style={styles.eventMeta}>{item.venue}</Text>
                <Text style={styles.eventDate}>{item.date}</Text>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  header: {
    marginTop: 60,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '600',
  },
  bell: {
    fontSize: 18,
    color: '#ffffff',
  },

  calendarBox: {
    marginTop: 20,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },

  section: {
    marginTop: 30,
    paddingLeft: 16,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },

  eventCard: {
    width: 220,
    backgroundColor: '#ffffff',
    borderRadius: 18,
    marginRight: 14,
    paddingBottom: 12,
  },
  eventImage: {
    width: '100%',
    height: 130,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
    marginHorizontal: 10,
    color: '#0f172a',
  },
  eventMeta: {
    fontSize: 13,
    color: '#475569',
    marginHorizontal: 10,
  },
  eventDate: {
    fontSize: 12,
    color: '#1e3a8a',
    marginHorizontal: 10,
    marginTop: 4,
  },
})
