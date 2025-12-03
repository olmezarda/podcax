import metrics from '@/src/styles/metrics'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { resetPassword } from '../src/api/authService'
import CustomSnackbar, { SnackbarRef } from '../src/components/common/CustomSnackbar'
import globalStyles from '../src/styles/globalStyles'

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const snackbarRef = useRef<SnackbarRef>(null)

  const onResetPassword = async () => {
    if (!email) {
      snackbarRef.current?.show('Please enter your email address', 'error')
      return
    }
    try {
      setLoading(true)
      await resetPassword(email)
      snackbarRef.current?.show('A password reset link has been sent to your email.', 'success')
      setTimeout(() => router.push('/signin'), 1200)
    } catch (error: any) {
      const code = error.code
      let message = 'Failed to send reset email. Please try again.'
      if (code === 'auth/invalid-email') message = 'Please enter a valid email address.'
      if (code === 'auth/user-not-found') message = 'No account found with this email.'
      snackbarRef.current?.show(message, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[globalStyles.container, globalStyles.centered]}>
      <View style={globalStyles.topSection}>
        <Image source={require('../assets/images/podcax-splash.png')} style={globalStyles.logo} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <Text style={globalStyles.title}>Forgot Password</Text>
          <Text style={[globalStyles.subtitle, { marginTop: metrics.marginSmall }]}>
            Enter your email address to receive a password reset link.
          </Text>
        </View>
      </View>
      <View style={globalStyles.form}>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={globalStyles.input}
          keyboardType="email-address"
        />
        <TouchableOpacity style={globalStyles.actionButton} onPress={onResetPassword} disabled={loading}>
          <Text style={globalStyles.buttonText}>{loading ? 'Sending...' : 'Send Reset Link'}</Text>
        </TouchableOpacity>
        <View style={globalStyles.bottomLinks}>
          <TouchableOpacity onPress={() => router.push('/signin')}>
            <Text style={globalStyles.linkText}>Back to Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
      <CustomSnackbar ref={snackbarRef} />
    </View>
  )
}
