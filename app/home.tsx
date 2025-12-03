import React, { useState } from 'react';
import {
  FlatList,
  Image,
  Share,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import CustomBottomNavbar from '../src/components/common/CustomBottomNavbar';
import CustomHeader from '../src/components/common/CustomHeader';
import globalStyles from '../src/styles/globalStyles';

const DUMMY_POSTS = [
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
];

interface Post {
  id: string;
  username: string;
  description: string;
  imageUrl: string;
  audioUrl: string;
}

const PostCard = ({ post }: { post: Post }) => {
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

export default function HomeScreen() {
  return (
    <View style={globalStyles.container}>
      <CustomHeader />
      <FlatList
        data={DUMMY_POSTS}
        renderItem={({ item }) => <PostCard post={item} />}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
      <CustomBottomNavbar />
    </View>
  );
}