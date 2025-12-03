import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import LottieView from 'lottie-react-native'
import React, { useRef, useState } from 'react'
import { Dimensions, FlatList, Text, TouchableOpacity, View } from 'react-native'
import colors from '../src/styles/colors'
import globalStyles from '../src/styles/globalStyles'
import metrics from '../src/styles/metrics'
import slides, { Slide } from '../src/utils/constants'

const { width } = Dimensions.get('window')

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const flatListRef = useRef<FlatList<Slide>>(null)
  const router = useRouter()

  const renderItem = ({ item }: { item: Slide }) => (
    <View style={{ width, flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
      <LottieView source={item.animation} autoPlay loop style={{ width: width * 0.8, height: 300 }} />
      <View style={{ width: '100%', marginTop: metrics.marginMedium, alignItems: 'center' }}>
        <View style={{ backgroundColor: colors.white, padding: metrics.paddingMedium, borderRadius: metrics.radiusMedium, marginBottom: metrics.marginMedium, width: '90%', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[globalStyles.title, { textAlign: 'center' }]}>{item.title}</Text>
        </View>
        <View style={{ backgroundColor: colors.border, padding: metrics.paddingMedium, borderRadius: metrics.radiusMedium, width: '90%', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[globalStyles.contentText, { textAlign: 'center' }]}>{item.description}</Text>
        </View>
      </View>
    </View>
  )

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true })
    } else {
      router.replace('/signup')
    }
  }

  const handleSkip = () => {
    flatListRef.current?.scrollToIndex({ index: slides.length - 1, animated: true })
  }

  const handleDotPress = (index: number) => {
    flatListRef.current?.scrollToIndex({ index, animated: true })
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.key}
        onMomentumScrollEnd={(event) => setCurrentIndex(Math.round(event.nativeEvent.contentOffset.x / width))}
        ref={flatListRef}
        getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
      />
      <TouchableOpacity onPress={handleSkip} style={{ position: 'absolute', top: 50, right: 20, zIndex: 1 }}>
        <Text style={[globalStyles.buttonText, { color: colors.white, backgroundColor: colors.primary, padding: metrics.paddingMedium, borderRadius: metrics.radiusMedium }]}>Skip</Text>
      </TouchableOpacity>
      <View style={{ position: 'absolute', bottom: 100, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
        {slides.map((_, index) => (
          <TouchableOpacity key={index} onPress={() => handleDotPress(index)}>
            <View style={{ width: 50, height: 10, borderRadius: 5, backgroundColor: index === currentIndex ? colors.primary : colors.border, marginHorizontal: 5, marginBottom: metrics.marginLarge }} />
          </TouchableOpacity>
        ))}
      </View>
      <View style={{ position: 'absolute', bottom: 50, width: '100%', alignItems: 'center' }}>
        <TouchableOpacity onPress={handleNext} style={{ backgroundColor: colors.primary, paddingVertical: metrics.paddingMedium, paddingHorizontal: 50, borderRadius: metrics.radiusMedium }}>
          {currentIndex === slides.length - 1 ? <Text style={globalStyles.buttonText}>Get Started</Text> : <Ionicons name="arrow-forward" size={24} color={colors.white} />}
        </TouchableOpacity>
      </View>
    </View>
  )
}
