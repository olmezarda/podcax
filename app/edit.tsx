import AudioEditorModal from '@/src/components/AudioEditorModal';
import CustomBottomNavbar from '@/src/components/common/CustomBottomNavbar';
import Header from '@/src/components/common/CustomHeader';
import { useAccountType } from '@/src/context/AccountContext';
import colors from '@/src/styles/colors';
import globalStyles from '@/src/styles/globalStyles';
import metrics from '@/src/styles/metrics';
import Slider from '@react-native-community/slider';
import { Audio, AVPlaybackStatus } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import React, { useState } from 'react';
import { Alert, Image, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

type AudioFile = { id: string; uri: string; name: string; sound?: Audio.Sound };
type ImageFile = { uri: string; name: string };

const EditScreen = () => {
  const accountType = useAccountType();

  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [selectedAudio, setSelectedAudio] = useState<AudioFile | null>(null);
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [description, setDescription] = useState('');
  const [editorVisible, setEditorVisible] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackPosition, setPlaybackPosition] = useState(0);
  const [playbackDuration, setPlaybackDuration] = useState(0);

  const recordingOptions: Audio.RecordingOptions = {
    android: {
      extension: '.m4a',
      outputFormat: 2,
      audioEncoder: 3,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
    },
    ios: {
      extension: '.m4a',
      audioQuality: 127,
      sampleRate: 44100,
      numberOfChannels: 2,
      bitRate: 128000,
      linearPCMBitDepth: 16,
      linearPCMIsBigEndian: false,
      linearPCMIsFloat: false,
    },
    web: { mimeType: 'audio/webm', bitsPerSecond: 128000 },
  };

  const formatMillis = (millis: number) => {
    if (!millis || millis < 0) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const seconds = totalSeconds % 60;
    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) {
      setIsPlaying(false);
      setPlaybackPosition(0);
      setPlaybackDuration(0);
      if (selectedAudio) {
        setSelectedAudio(prev => ({ ...prev!, sound: undefined }));
      }
      return;
    }

    setPlaybackPosition(status.positionMillis);
    setPlaybackDuration(status.durationMillis || 0);
    setIsPlaying(status.isPlaying);

    if (status.didJustFinish) {
      setIsPlaying(false);
      setPlaybackPosition(0);
      selectedAudio?.sound?.setPositionAsync(0);
      selectedAudio?.sound?.stopAsync();
    }
  };

  const pickAudio = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'audio/*', copyToCacheDirectory: true });
      if (!result.canceled && result.assets.length > 0) {
        const asset = result.assets[0];
        setSelectedAudio({
          uri: asset.uri,
          name: asset.name || `audio-${Date.now()}.mp3`,
          id: Date.now().toString(),
        });
      }
    } catch {
      Alert.alert('Error', 'Failed to pick audio.');
    }
  };

  const pickImage = async () => {
    try {
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permission required for photos.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });
      if (!result.canceled && result.assets.length > 0) {
        const file: ImageFile = {
          uri: result.assets[0].uri,
          name: result.assets[0].fileName || `image-${Date.now()}.jpg`,
        };
        setImageFile(file);
      }
    } catch {
      Alert.alert('Error', 'Failed to pick image.');
    }
  };

  const startRecording = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const rec = new Audio.Recording();
      await rec.prepareToRecordAsync(recordingOptions);
      await rec.startAsync();
      setRecording(rec);
    } catch {
      Alert.alert('Error', 'Failed to start recording.');
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    try {
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      if (uri)
        setSelectedAudio({
          uri,
          name: `recording-${Date.now()}.m4a`,
          id: Date.now().toString(),
        });
      setRecording(null);
    } catch {
      Alert.alert('Error', 'Failed to stop recording.');
    }
  };

  const deleteFile = async (file: AudioFile) => {
    Alert.alert('Confirm Delete', `Are you sure you want to delete "${file.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (file.sound) {
            await file.sound.unloadAsync();
          }
          setSelectedAudio(null);
          setIsPlaying(false);
          setPlaybackPosition(0);
          setPlaybackDuration(0);
          
          const docDir = (FileSystem as any).documentDirectory;
          if (docDir && file.uri.startsWith(docDir)) {
            try {
              await FileSystem.deleteAsync(file.uri, { idempotent: true });
            } catch (err) {
              console.error(err);
            }
          }
        },
      },
    ]);
  };

  const playAudio = async (file: AudioFile) => {
    try {
      if (file.sound && isPlaying) {
        await file.sound.pauseAsync();
        setIsPlaying(false);
      } else if (file.sound && !isPlaying) {
        await file.sound.playAsync();
        setIsPlaying(true);
      } else {
        const { sound, status } = await Audio.Sound.createAsync(
          { uri: file.uri },
          { shouldPlay: true }
        );
        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        setSelectedAudio(prev => ({ ...prev!, sound: sound }));
      }
    } catch (e) {
      console.error("Error playing audio", e);
      Alert.alert('Error', 'Failed to play audio.');
    }
  };

  const editFile = (file: AudioFile) => {
    if (file.sound) {
      file.sound.unloadAsync();
    }
    setIsPlaying(false);
    setPlaybackPosition(0);
    setPlaybackDuration(0);
    setEditorVisible(true);
  };

  const onScrub = async (value: number) => {
    if (selectedAudio && selectedAudio.sound) {
      await selectedAudio.sound.setPositionAsync(value);
      setPlaybackPosition(value);
    }
  };

  const uploadPost = async () => {
    if (!selectedAudio || !imageFile || !description) {
      Alert.alert('Missing Information', 'Please select an audio file, a cover image, and enter a description to share.');
      return;
    }
    Alert.alert('Success', 'Post uploaded successfully!');
    setSelectedAudio(null);
    setImageFile(null);
    setDescription('');
  };

  const handleSaveEdit = (volume: number, speed: number, editedUri: string | null) => {
    console.log('Vol:', volume, 'Speed:', speed, 'Yeni dosya:', editedUri);

    if (selectedAudio && editedUri) {
      setSelectedAudio(prev => {
        if (!prev) return null;
  
        const countRegex = /^edited\((\d+)\)-/;
        const simpleRegex = /^edited-/;
        let newName = '';
  
        const countMatch = prev.name.match(countRegex);
        const simpleMatch = prev.name.match(simpleRegex);
  
        if (countMatch) {
          const count = parseInt(countMatch[1], 10);
          newName = prev.name.replace(countRegex, `edited(${count + 1})-`);
        } else if (simpleMatch) {
          newName = prev.name.replace(simpleRegex, 'edited(2)-');
        } else {
          newName = `edited-${prev.name}`;
        }
  
        return {
          ...prev,
          uri: editedUri,
          name: newName,
        };
      });
    }
    setEditorVisible(false);
  };

  const renderAudioPreview = (file: AudioFile) => {
    const isFilePlaying = file.sound && isPlaying;
    
    return (
      <View style={globalStyles.audioPreviewCard}>
        <View style={globalStyles.audioPreviewHeader}>
          <Text style={globalStyles.audioPreviewName}>{file.name}</Text>
          <View style={globalStyles.audioPreviewActions}>
            <TouchableOpacity onPress={() => editFile(file)}>
              <Image source={require('@/assets/icons/edit-icon.png')} style={globalStyles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteFile(file)}>
              <Image source={require('@/assets/icons/delete-icon.png')} style={globalStyles.icon} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={globalStyles.playerBarContainer}>
          <TouchableOpacity onPress={() => playAudio(file)} style={globalStyles.playerPlayButton}>
            <Image
              source={
                isFilePlaying
                  ? require('@/assets/icons/pause-button-icon.png')
                  : require('@/assets/icons/play-button-icon.png')
              }
              style={globalStyles.icon}
            />
          </TouchableOpacity>
          <Text style={globalStyles.playerTimeText}>{formatMillis(playbackPosition)}</Text>
          <Slider
            style={globalStyles.playerSlider}
            minimumValue={0}
            maximumValue={playbackDuration || 1}
            value={playbackPosition}
            onSlidingComplete={onScrub}
            minimumTrackTintColor={colors.primary}
            maximumTrackTintColor={colors.border}
            thumbTintColor={colors.primary}
          />
          <Text style={globalStyles.playerTimeText}>{formatMillis(playbackDuration)}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={globalStyles.container}>
      <Header />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[globalStyles.row, { alignItems: 'center', marginBottom: metrics.marginMedium }]}>
          <Text style={[globalStyles.editTitle, { marginBottom: 0, marginLeft: 0 }]}>Create Post</Text>
          <View style={{ flex: 1, marginLeft: metrics.marginMedium }}>
            <Text style={[globalStyles.subtitle, { fontSize: 12, lineHeight: 18, backgroundColor: colors.border, paddingHorizontal: metrics.paddingMedium, borderRadius: metrics.radiusMedium, paddingVertical: metrics.paddingSmall }]}>
              Be kind and respectful. Please follow our community guidelines.
            </Text>
          </View>
        </View>

        <View style={globalStyles.row}>
          <TouchableOpacity style={globalStyles.editActionButton} onPress={pickAudio}>
            <Text style={globalStyles.editButtonText}>Select Audio</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={globalStyles.editActionButton}
            onPress={recording ? stopRecording : startRecording}>
            <Text style={globalStyles.editButtonText}>
              {recording ? 'Stop recording...' : 'Record Audio'}
            </Text>
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={globalStyles.coverButton} onPress={pickImage}>
          <Text style={globalStyles.editButtonText}>
            {imageFile ? 'Change Cover Image' : 'Select Cover Image'}
          </Text>
        </TouchableOpacity>

        {imageFile && <Image source={{ uri: imageFile.uri }} style={globalStyles.coverImage} />}

        <TextInput
          style={globalStyles.descriptionInput}
          placeholder="Enter description..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={5}
          maxLength={1000}
        />
        
        {selectedAudio && renderAudioPreview(selectedAudio)}

        <TouchableOpacity onPress={uploadPost} style={globalStyles.centeredShareButton}>
          <Image
            source={require('@/assets/icons/share-icon.png')}
            style={globalStyles.centeredShareButtonIcon}
          />
          <Text style={globalStyles.centeredShareButtonText}>Share Post</Text>
        </TouchableOpacity>

      </ScrollView>

      {selectedAudio && (
        <AudioEditorModal
          visible={editorVisible}
          fileUri={selectedAudio.uri || ''}
          onClose={() => setEditorVisible(false)}
          onSave={handleSaveEdit}
        />
      )}

      <CustomBottomNavbar />
    </View>
  );
};

export default EditScreen;