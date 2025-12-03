import colors from '@/src/styles/colors'
import metrics from '@/src/styles/metrics'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useRef, useState } from 'react'
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { signUp } from '../src/api/authService'
import CustomSnackbar, { SnackbarRef } from '../src/components/common/CustomSnackbar'
import globalStyles from '../src/styles/globalStyles'

export default function SignUpScreen() {
  const router = useRouter()
  const [accountType, setAccountType] = useState<'listener' | 'creator'>('listener')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const snackbarRef = useRef<SnackbarRef>(null)

  const onSignUp = async () => {
    if (!email || !password || !username) {
      snackbarRef.current?.show('Please fill in all fields', 'error')
      return
    }
    try {
      setLoading(true)
      await signUp(email, password, username, accountType)
      snackbarRef.current?.show('Account created successfully', 'success')
      setTimeout(() => router.push({ pathname: '/home', params: { accountType } }), 800)
    } catch (error: any) {
      snackbarRef.current?.show(error.message || 'Something went wrong', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={[globalStyles.container, globalStyles.centered]}>
      <View style={globalStyles.topSection}>
        <Image source={require('../assets/images/podcax-splash.png')} style={globalStyles.logo} resizeMode="contain" />
        <View style={{ flex: 1 }}>
          <Text style={globalStyles.title}>Sign Up</Text>
          <Text style={[globalStyles.subtitle, { marginTop: metrics.marginSmall }]}>
            Welcome! Please complete the form for sign up. Don't forget to choose account type.
          </Text>
          <View style={[globalStyles.accountTypeContainer, { marginTop: metrics.marginSmall }]}>
            <TouchableOpacity
              style={[globalStyles.accountButton, accountType === 'listener' && globalStyles.activeAccountButton]}
              onPress={() => setAccountType('listener')}
            >
              <Text style={[globalStyles.accountText, accountType === 'listener' && globalStyles.activeAccountText]}>
                Listener
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[globalStyles.accountButton, accountType === 'creator' && globalStyles.activeAccountButton]}
              onPress={() => setAccountType('creator')}
            >
              <Text style={[globalStyles.accountText, accountType === 'creator' && globalStyles.activeAccountText]}>
                Creator
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={globalStyles.form}>
        <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={globalStyles.input} />
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={globalStyles.input} keyboardType="email-address" />
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
        <TouchableOpacity style={globalStyles.actionButton} onPress={onSignUp} disabled={loading}>
          <Text style={globalStyles.buttonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
        </TouchableOpacity>
        <View style={globalStyles.bottomLinks}>
          <TouchableOpacity onPress={() => router.push('/signin')}>
            <Text style={globalStyles.linkText}>Already have an account? Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/forgot-password')}>
            <Text style={globalStyles.linkText}>Forgot Password</Text>
          </TouchableOpacity>
        </View>
      </View>
      <CustomSnackbar ref={snackbarRef} />
    </View>
  )
}
