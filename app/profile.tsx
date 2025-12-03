import { useAccountType } from '@/src/context/AccountContext';
import colors from '@/src/styles/colors';
import globalStyles from '@/src/styles/globalStyles';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { router } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Modal,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { signOutUser } from '../src/api/authService';
import { auth, db } from '../src/api/firebaseConfig';
import CustomBottomNavbar from '../src/components/common/CustomBottomNavbar';
import CustomHeader from '../src/components/common/CustomHeader';

type RootStackParamList = {
  SignInScreen: undefined;
};

interface Post {
  id: string;
  username: string;
  description: string;
  imageUrl: string;
  audioUrl: string;
  category: 'shared' | 'saved' | 'liked' | 'commented';
}

const DUMMY_PROFILE_POSTS: Post[] = [
  {
    id: '1',
    username: 'CreatorUser1',
    description: 'My shared post content.',
    imageUrl: 'https://picsum.photos/seed/picsum1/700/400',
    audioUrl: 'test_audio_1.mp3',
    category: 'shared',
  },
  {
    id: '2',
    username: 'AudioArtist',
    description: 'A post I saved.',
    imageUrl: 'https://picsum.photos/seed/picsum2/700/400',
    audioUrl: 'test_audio_2.mp3',
    category: 'saved',
  },
  {
    id: '3',
    username: 'MusicMaker',
    description: 'A post I liked.',
    imageUrl: 'https://picsum.photos/seed/picsum3/700/400',
    audioUrl: 'test_audio_3.mp3',
    category: 'liked',
  },
  {
    id: '4',
    username: 'SoundWaves',
    description: 'A post I commented on.',
    imageUrl: 'https://picsum.photos/seed/picsum4/700/400',
    audioUrl: 'test_audio_4.mp3',
    category: 'commented',
  },
];

const ModalPostCard = ({ post }: { post: Post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this post by ${post.username}: ${post.description}`,
      });
    } catch (error: any) {
      console.log(error.message);
    }
  };
  
  const onPlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <View style={globalStyles.postContainer}>
      <View style={globalStyles.postHeaderContainer}>
        <Text style={globalStyles.postUsername}>{post.username}</Text>
        <Text style={globalStyles.postAccountType}>(creator)</Text>
      </View>
      
      <Text style={globalStyles.postDescription}>{post.description}</Text>

      <View style={globalStyles.postImageContainer}>
        <Image source={{ uri: post.imageUrl }} style={globalStyles.postImage} />
        <TouchableOpacity style={globalStyles.playButtonOverlay} onPress={onPlayPause}>
          <Image
            source={
              isPlaying
                ? require('../assets/icons/pause-button-icon.png')
                : require('../assets/icons/play-button-icon.png')
            }
            style={globalStyles.playButtonIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={globalStyles.postActionsContainer}>
        <View style={globalStyles.postActionsLeftGroup}>
          <TouchableOpacity 
            style={globalStyles.postActionButton}
            onPress={() => setIsLiked(!isLiked)}
          >
            <Image
              source={
                isLiked
                  ? require('../assets/icons/like-fill-icon.png')
                  : require('../assets/icons/like-icon.png')
              }
              style={globalStyles.postActionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={globalStyles.postActionButton}>
            <Image
              source={require('../assets/icons/comment-icon.png')}
              style={globalStyles.postActionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={globalStyles.postActionButton}
            onPress={handleShare}
          >
            <Image
              source={require('../assets/icons/share-icon.png')}
              style={globalStyles.postActionIcon}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={globalStyles.postActionButton}
          onPress={() => setIsSaved(!isSaved)}
        >
          <Image
            source={
              isSaved
                ? require('../assets/icons/bookmark-fill-icon.png')
                : require('../assets/icons/bookmark-icon.png')
            }
            style={globalStyles.postActionIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};


export default function ProfileScreen() {
  const accountType = useAccountType();
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [username, setUsername] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          setUsername('Guest');
          setLoading(false);
          return;
        }

        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const data = userDoc.data();
          setUsername(data.username || 'Unnamed User');
        } else {
          setUsername('Unknown User');
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        setUsername('Error loading user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOutUser();
              router.replace('/signin');
            } catch (error: any) {
              console.error('SignOut Error:', error.message);
              Alert.alert('SignOut Failed', error.message);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const listenerCategories = ['saved', 'liked', 'commented'];
  const creatorCategories = ['shared', 'saved', 'liked', 'commented'];
  const categories = accountType === 'creator' ? creatorCategories : listenerCategories;

  const [selectedCategory, setSelectedCategory] = useState(
    accountType === 'creator' ? 'shared' : 'saved'
  );

  const openPost = (post: Post) => {
    setSelectedPost(post);
    setModalVisible(true);
  };

  const closePost = () => {
    setModalVisible(false);
    setSelectedPost(null);
  };

  const renderGridItem = ({ item }: { item: Post }) => (
    <TouchableOpacity 
      style={globalStyles.savedGridItem} 
      onPress={() => openPost(item)}
    >
      <Image source={{ uri: item.imageUrl }} style={globalStyles.savedGridImage} />
      <View style={globalStyles.savedGridOverlay}>
        <Text style={globalStyles.savedGridUsername}>{item.username}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderContent = () => {
    const filteredPosts = DUMMY_PROFILE_POSTS.filter(
      (post) => post.category === selectedCategory
    );

    if (filteredPosts.length === 0) {
      return (
        <View style={globalStyles.emptyContentContainer}>
          <Text style={globalStyles.emptyContentText}>No posts found.</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={filteredPosts}
        renderItem={renderGridItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        style={globalStyles.savedGridContainer}
      />
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={globalStyles.container}>
        <CustomHeader />
        
        <View style={globalStyles.profileInfoContainer}>
          <View style={globalStyles.userInfo}>
            <Text style={globalStyles.username}>
              {loading ? 'Loading...' : username}
            </Text>
            <Text style={globalStyles.accountType}>({accountType})</Text>
          </View>
          <TouchableOpacity onPress={handleSignOut} style={globalStyles.signOutButton}>
            <Text style={globalStyles.signOutButtonText}>Sign Out</Text>
          </TouchableOpacity>
        </View>

        <View style={globalStyles.categoriesContainer}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              onPress={() => setSelectedCategory(category)}
              style={[
                globalStyles.categoryButton,
                selectedCategory === category && globalStyles.activeCategoryButton,
              ]}
            >
              <Text
                style={[
                  globalStyles.categoryText,
                  selectedCategory === category && globalStyles.activeCategoryText,
                ]}
              >
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {renderContent()}
        
        <CustomBottomNavbar />
      </View>

      <Modal 
        visible={modalVisible} 
        transparent={true} 
        animationType="fade"
        onRequestClose={closePost}
      >
        <View style={globalStyles.modalOverlay}>
          <View style={globalStyles.modalContentContainer}>
            <ScrollView> 
              {selectedPost && <ModalPostCard post={selectedPost} />}
            </ScrollView>
            <TouchableOpacity onPress={closePost} style={globalStyles.closeModalButton}>
              <Text style={globalStyles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}