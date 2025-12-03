import colors from '@/src/styles/colors'
import metrics from '@/src/styles/metrics'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { signIn } from '../src/api/authService'
import CustomSnackbar, { SnackbarRef } from '../src/components/common/CustomSnackbar'
import globalStyles from '../src/styles/globalStyles'

export default function SignInScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const snackbarRef = useRef<SnackbarRef>(null)

  const onSignIn = async () => {
    if (!email || !password) {
      snackbarRef.current?.show('Please fill in all fields', 'error')
      return
    }
    try {
      setLoading(true)
      const { userData } = await signIn(email, password)
      const accountType = (userData as any)?.accountType || 'listener'
      snackbarRef.current?.show('Signed in successfully', 'success')
      setTimeout(() => router.push({ pathname: '/home', params: { accountType } }), 800)
    } catch (error: any) {
      snackbarRef.current?.show(error.message || 'Invalid credentials', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[globalStyles.container, globalStyles.centered]}>
      <View style={globalStyles.topSection}>
        <Image source={require('../assets/images/podcax-splash.png')} style={globalStyles.logo} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <Text style={globalStyles.title}>Sign In</Text>
          <Text style={[globalStyles.subtitle, { marginTop: metrics.marginSmall }]}>
            Welcome back! Please log in to continue.
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
        <View style={{ width: '100%', position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
          <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            style={[globalStyles.input, { paddingRight: 40 }]}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={{
              position: 'absolute',
              right: metrics.marginMedium,
              marginBottom: metrics.marginMedium,
              backgroundColor: colors.primary,
              padding: metrics.paddingSmall,
              borderRadius: metrics.radiusLarge
            }}
          >
            <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={22} color={colors.border} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={globalStyles.actionButton} onPress={onSignIn} disabled={loading}>
          <Text style={globalStyles.buttonText}>{loading ? 'Signing In...' : 'Sign In'}</Text>
        </TouchableOpacity>
        <View style={globalStyles.bottomLinks}>
          <TouchableOpacity onPress={() => router.push('/signup')}>
            <Text style={globalStyles.linkText}>Don't have an account? Sign Up</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/forgot-password')}>
            <Text style={globalStyles.linkText}>If you forgot password</Text>
          </TouchableOpacity>
        </View>
      </View>
      <CustomSnackbar ref={snackbarRef} />
    </View>
  )
}
