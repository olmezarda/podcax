import { db } from '@/src/api/firebaseConfig';
import CustomBottomNavbar from '@/src/components/common/CustomBottomNavbar';
import CustomHeader from '@/src/components/common/CustomHeader';
import colors from '@/src/styles/colors';
import globalStyles from '@/src/styles/globalStyles';
import { useRouter } from 'expo-router';
import { collection, getDocs, query, where } from 'firebase/firestore';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

interface User {
  uid: string;
  username: string;
  accountType: string;
  email: string;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const searchUsers = async (text: string) => {
    if (text.trim().length === 0) {
      setResults([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    try {
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('username', '>=', text),
        where('username', '<=', text + '\uf8ff')
      );
      
      const querySnapshot = await getDocs(q);
      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        users.push({ uid: doc.id, ...doc.data() } as User);
      });
      setResults(users);
    } catch (error) {
      console.error("Error searching users:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    searchUsers(text);
  };

  const navigateToProfile = (userId: string) => {
    router.push({
      pathname: '/userprofile',
      params: { userId: userId },
    });
  };

  const renderUserCard = ({ item }: { item: User }) => (
    <TouchableOpacity 
      style={globalStyles.searchCard} 
      onPress={() => navigateToProfile(item.uid)}
    >
      <View style={globalStyles.searchCardInfo}>
        <Text style={globalStyles.searchCardUsername}>{item.username}</Text>
        <Text style={globalStyles.searchCardAccountType}>{item.accountType}</Text>
        <Text style={globalStyles.searchCardEmail}>{item.email}</Text>
      </View>
      <Image
        source={require('../assets/icons/right-arrow-icon.png')}
        style={globalStyles.searchArrowIcon}
      />
    </TouchableOpacity>
  );

  return (
    <View style={globalStyles.container}>
      <CustomHeader />
      <View style={globalStyles.searchBarContainer}>
        <Image
          source={require('../assets/icons/search-icon.png')}
          style={globalStyles.searchIcon}
        />
        <TextInput
          style={globalStyles.searchInput}
          placeholder="Type a username..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={handleSearchChange}
          autoCapitalize="none"
        />
      </View>
      
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={results}
          renderItem={renderUserCard}
          keyExtractor={(item) => item.uid}
          ListEmptyComponent={
            searchQuery.length > 0 ? (
              <View style={globalStyles.emptyResultsContainer}>
                <Text style={globalStyles.emptyResultsText}>No users found.</Text>
              </View>
            ) : null
          }
        />
      )}
      
      <CustomBottomNavbar />
    </View>
  );
}