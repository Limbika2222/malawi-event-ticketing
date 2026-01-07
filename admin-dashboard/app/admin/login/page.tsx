"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { auth, db } from "@/firebase"
import { FirebaseError } from "firebase/app"

export default function AdminLogin() {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    console.log("Attempting admin login with:", email)

    try {
      // 🔐 1. Firebase Authentication
      const cred = await signInWithEmailAndPassword(auth, email, password)
      console.log("Auth success, UID:", cred.user.uid)

      // 🔐 2. Firestore admin authorization
      const adminRef = doc(db, "admins", cred.user.uid)
      const adminSnap = await getDoc(adminRef)

      if (!adminSnap.exists()) {
        throw new Error("NOT_ADMIN")
      }

      if (adminSnap.data().active !== true) {
        throw new Error("ADMIN_DISABLED")
      }

      // ✅ 3. Redirect to dashboard
      router.push("/admin/dashboard")
    } catch (err: unknown) {
      console.error("LOGIN ERROR:", err)

      // 🔍 Firebase-specific errors
      if (err instanceof FirebaseError) {
        switch (err.code) {
          case "auth/user-not-found":
            setError("No account found with this email")
            break
          case "auth/wrong-password":
            setError("Incorrect password")
            break
          case "auth/invalid-credential":
            setError("Invalid email or password")
            break
          case "auth/too-many-requests":
            setError("Too many attempts. Try again later.")
            break
          default:
            setError("Authentication failed")
        }
      } else if (err instanceof Error) {
        // 🔐 Admin authorization errors
        if (err.message === "NOT_ADMIN") {
          setError("This account is not an admin")
        } else if (err.message === "ADMIN_DISABLED") {
          setError("Admin account is disabled")
        } else {
          setError("Login failed")
        }
      } else {
        setError("Unexpected error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center blur-sm scale-105"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1516450360452-9312f5e86fc7)",
        }}
      />
      <div className="absolute inset-0 bg-black/70" />

      {/* Login Card */}
      <div className="relative z-10 w-[380px] rounded-2xl bg-black/60 backdrop-blur-xl p-8 shadow-2xl border border-white/10">
        <div className="flex justify-center mb-6">
          <Image src="/logo.png" alt="CCNB Media" width={90} height={90} />
        </div>

        <h1 className="text-xl font-semibold text-center">Admin Login</h1>
        <p className="text-sm text-gray-400 text-center mb-6">
          CCNB Media Event Management
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-full bg-white/10 px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-full bg-white/10 px-5 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-blue-600 hover:bg-blue-700 py-3 font-semibold"
          >
            {loading ? "Signing in..." : "Log In"}
          </button>
        </form>

        {error && (
          <p className="text-red-400 text-sm text-center mt-4">
            {error}
          </p>
        )}
      </div>
    </div>
  )
}
