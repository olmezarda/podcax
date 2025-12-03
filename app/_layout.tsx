import { auth, db } from '@/src/api/firebaseConfig';
import { AccountProvider } from '@/src/context/AccountContext';
import {
  PlayfairDisplay_400Regular, PlayfairDisplay_500Medium, PlayfairDisplay_700Bold
} from '@expo-google-fonts/playfair-display';
import {
  Poppins_400Regular, Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold
} from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';
import { Slot } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  const [accountType, setAccountType] = useState<'creator' | 'listener' | null>(null);
  const [loading, setLoading] = useState(true);

  const [fontsLoaded] = useFonts({
    PlayfairDisplay_400Regular,
    PlayfairDisplay_500Medium,
    PlayfairDisplay_700Bold,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setAccountType(data.accountType as 'creator' | 'listener');
          } else {
            setAccountType('listener');
          }
        } catch {
          setAccountType('listener');
        }
      } else {
        setAccountType('listener');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (!fontsLoaded || loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <AccountProvider accountType={accountType!}>
      <Slot />
    </AccountProvider>
  );
}