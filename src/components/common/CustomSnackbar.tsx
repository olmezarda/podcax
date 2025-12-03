import colors from '@/src/styles/colors'
import globalStyles from '@/src/styles/globalStyles'
import React, { forwardRef, useImperativeHandle, useState } from 'react'
import { Animated, Text } from 'react-native'

type SnackbarType = 'success' | 'error'

export type SnackbarRef = {
  show: (message: string, type?: SnackbarType) => void
}

const CustomSnackbar = forwardRef<SnackbarRef>((_, ref) => {
  const [message, setMessage] = useState('')
  const [type, setType] = useState<SnackbarType>('success')
  const animatedValue = useState(new Animated.Value(-100))[0]

  useImperativeHandle(ref, () => ({
    show: (msg: string, t: SnackbarType = 'success') => {
      setMessage(msg)
      setType(t)
      Animated.timing(animatedValue, {
        toValue: 60,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(animatedValue, {
            toValue: -100,
            duration: 300,
            useNativeDriver: false,
          }).start()
        }, 2500)
      })
    },
  }))

  const backgroundColor = type === 'success' ? colors.success : colors.error

  return (
    <Animated.View style={[globalStyles.snackbarStyle, { top: animatedValue, backgroundColor }]}>
      <Text style={[globalStyles.snacbarTextStyle]}>{message}</Text>
    </Animated.View>
  )
})

export default CustomSnackbar
