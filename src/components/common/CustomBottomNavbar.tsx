import { useAccountType } from '@/src/context/AccountContext'
import colors from '@/src/styles/colors'
import globalStyles from '@/src/styles/globalStyles'
import { Ionicons } from '@expo/vector-icons'
import { usePathname, useRouter } from 'expo-router'
import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'

type TabKey = 'home' | 'search' | 'saved' | 'edit' | 'profile'
type TabRoute = '/home' | '/search' | '/saved' | '/edit' | '/profile'

export default function CustomBottomNavbar() {
  const router = useRouter()
  const pathname = usePathname() as TabRoute
  const accountType = useAccountType()

  const dynamicTab: { key: TabKey; label: string; icon: string; route: TabRoute } =
    accountType === 'listener'
      ? { key: 'saved', label: 'Saved', icon: 'bookmark-outline', route: '/saved' }
      : { key: 'edit', label: 'Edit', icon: 'create-outline', route: '/edit' }

  const tabs: { key: TabKey; label: string; icon: string; route: TabRoute }[] = [
    { key: 'home', label: 'Home', icon: 'home-outline', route: '/home' },
    dynamicTab,
    { key: 'profile', label: 'Profile', icon: 'person-outline', route: '/profile' },
    { key: 'search', label: 'Search', icon: 'search-outline', route: '/search' },
  ]

  return (
    <View style={globalStyles.bottomNavbarContainer}>
      {tabs.map((tab, index) => {
        const isActive = pathname === tab.route
        const showDivider = tab.key === 'profile'
        return (
          <React.Fragment key={tab.key}>
            <TouchableOpacity
              style={globalStyles.tabButton}
              onPress={() => router.push(tab.route)}
            >
              <Ionicons
                name={tab.icon as keyof typeof Ionicons.glyphMap}
                size={24}
                color={isActive ? colors.primary : colors.textSecondary}
              />
              <Text
                style={{
                  color: isActive ? colors.primary : colors.textSecondary,
                  fontSize: isActive ? 15 : 13,
                  fontWeight: isActive ? '800' : '700',
                }}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
            {showDivider && <View style={globalStyles.navDivider} />}
          </React.Fragment>
        )
      })}
    </View>
  )
}
