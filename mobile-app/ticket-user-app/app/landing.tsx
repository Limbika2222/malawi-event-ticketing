import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native'
import { LinearGradient } from 'expo-linear-gradient'
import { useRouter } from 'expo-router'

const { width } = Dimensions.get('window')

export default function Landing() {
  const router = useRouter()

  return (
    <LinearGradient
      colors={['#1e3a8a', '#312e81', '#0f172a']}
      style={styles.container}
    >
      {/* Decorative shapes */}
      <View style={styles.blobOne} />
      <View style={styles.blobTwo} />

      {/* Content */}
      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome</Text>
        <Text style={styles.subtitle}>
          Book events • Pay online • Enter securely
        </Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.primaryText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => router.push('/register')}
          >
            <Text style={styles.secondaryText}>Create account</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },

  blobOne: {
    position: 'absolute',
    width: width * 0.9,
    height: width * 0.9,
    backgroundColor: '#6366f1',
    borderRadius: width,
    top: -width * 0.3,
    left: -width * 0.3,
    opacity: 0.35,
  },
  blobTwo: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    backgroundColor: '#22d3ee',
    borderRadius: width,
    bottom: -width * 0.3,
    right: -width * 0.3,
    opacity: 0.25,
  },

  content: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },

  welcome: {
    fontSize: 36,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 12,
  },

  subtitle: {
    fontSize: 16,
    color: '#c7d2fe',
    textAlign: 'center',
    marginBottom: 40,
  },

  buttonGroup: {
    width: '100%',
  },

  primaryButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 16,
  },

  primaryText: {
    color: '#1e3a8a',
    fontSize: 16,
    fontWeight: '600',
  },

  secondaryButton: {
    borderWidth: 1,
    borderColor: '#e0e7ff',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },

  secondaryText: {
    color: '#e0e7ff',
    fontSize: 15,
    fontWeight: '500',
  },
})
