import { useAccountType } from '@/src/context/AccountContext';
import colors from '@/src/styles/colors';
import globalStyles from '@/src/styles/globalStyles';
import metrics from '@/src/styles/metrics';
import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Modal,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CustomBottomNavbar from '../src/components/common/CustomBottomNavbar';
import CustomHeader from '../src/components/common/CustomHeader';

interface Post {
  id: string;
  username: string;
  description: string;
  imageUrl: string;
  audioUrl: string;
}

const DUMMY_SAVED_POSTS: Post[] = [
  {
    id: '1',
    username: 'CreatorUser1',
    description: 'This is my first audio post! Hope you like it. Check out this new track.',
    imageUrl: 'https://picsum.photos/seed/picsum1/700/400',
    audioUrl: 'test_audio_1.mp3',
  },
  {
    id: '2',
    username: 'AudioArtist',
    description: 'Fresh beats from the studio. Let me know what you think in the comments below.',
    imageUrl: 'https://picsum.photos/seed/picsum2/700/400',
    audioUrl: 'test_audio_2.mp3',
  },
  {
    id: '3',
    username: 'MusicMaker',
    description: 'Another one. 🔥',
    imageUrl: 'https://picsum.photos/seed/picsum3/700/400',
    audioUrl: 'test_audio_3.mp3',
  },
  {
    id: '4',
    username: 'SoundWaves',
    description: 'Vibes for the weekend.',
    imageUrl: 'https://picsum.photos/seed/picsum4/700/400',
    audioUrl: 'test_audio_4.mp3',
  },
];

const ModalPostCard = ({ post }: { post: Post }) => {
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
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


export default function SavedScreen() {
  const accountType = useAccountType();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

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

  return (
    <View style={globalStyles.container}>
      <CustomHeader />
      
      <View style={[globalStyles.row, { alignItems: 'center', marginBottom: metrics.marginMedium }]}>
        <Text style={[globalStyles.editTitle, { marginBottom: 0, marginLeft: 0 }]}>Your Saveds</Text>
        <View style={{ flex: 1, marginLeft: metrics.marginMedium }}>
          <Text style={[globalStyles.subtitle, { fontSize: 12, lineHeight: 18, backgroundColor: colors.border, paddingHorizontal: metrics.paddingMedium, borderRadius: metrics.radiusMedium, paddingVertical: metrics.paddingSmall }]}>
            Your collection. Ready to play. Save once, listen anytime.
          </Text>
        </View>
      </View>
      
      <FlatList
        data={DUMMY_SAVED_POSTS}
        renderItem={renderGridItem}
        keyExtractor={(item) => item.id}
        numColumns={2}
        style={globalStyles.savedGridContainer}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
      />
      
      <CustomBottomNavbar />

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