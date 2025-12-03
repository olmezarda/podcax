import colors from '@/src/styles/colors';
import globalStyles from '@/src/styles/globalStyles';
import Slider from '@react-native-community/slider';
import { Audio, AVPlaybackStatus } from 'expo-av';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Modal, Text, TouchableOpacity, View } from 'react-native';

interface Props {
  visible: boolean;
  fileUri: string;
  onClose: () => void;
  onSave: (volume: number, speed: number, editedUri: string | null) => void;
}

const AudioEditorModal = ({ visible, fileUri, onClose, onSave }: Props) => {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [volume, setVolume] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);

  const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (!status.isLoaded) return;
    if (status.didJustFinish) {
      setIsPlaying(false);
      sound?.setPositionAsync(0);
    }
  };

  const loadSound = async () => {
    setIsLoading(true);
    try {
      const { sound, status } = await Audio.Sound.createAsync(
        { uri: fileUri },
        { shouldPlay: false, volume: volume, rate: speed }
      );
      if (status.isLoaded) {
        sound.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate);
        setSound(sound);
      }
    } catch (error) {
      console.error('Failed to load sound', error);
      Alert.alert('Error', 'Failed to load sound file.');
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  const unloadSound = async () => {
    if (sound) {
      await sound.unloadAsync();
      setSound(null);
    }
    setIsLoading(true);
    setVolume(1);
    setSpeed(1);
    setIsPlaying(false);
  };

  useEffect(() => {
    if (visible && fileUri) {
      loadSound();
    } else {
      unloadSound();
    }
    return () => {
      unloadSound();
    };
  }, [visible, fileUri]);

  const handleVolumeChange = async (value: number) => {
    setVolume(value);
    if (sound) {
      await sound.setVolumeAsync(value);
    }
  };

  const handleSpeedChange = async (value: number) => {
    setSpeed(value);
    if (sound) {
      await sound.setRateAsync(value, true);
    }
  };

  const handlePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
      setIsPlaying(false);
    } else {
      await sound.playAsync();
      setIsPlaying(true);
    }
  };

  const handleSave = () => {
    const editedUri = fileUri; 
    onSave(volume, speed, editedUri);
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <View style={globalStyles.modalOverlay}>
        <View style={globalStyles.editorModalContainer}>
          <Text style={globalStyles.editorModalTitle}>Edit Audio</Text>
          
          {isLoading ? (
            <ActivityIndicator size="large" color={colors.primary} />
          ) : (
            <>
              <View style={globalStyles.editorPlayButtonContainer}>
                <TouchableOpacity onPress={handlePlayPause}>
                  <Image
                    source={
                      isPlaying
                        ? require('@/assets/icons/pause-button-icon.png')
                        : require('@/assets/icons/play-button-icon.png')
                    }
                    style={globalStyles.editorPlayIcon}
                  />
                </TouchableOpacity>
              </View>

              <Text style={globalStyles.editorLabel}>Volume</Text>
              <Slider
                style={globalStyles.editorSlider}
                minimumValue={0}
                maximumValue={1}
                value={volume}
                onValueChange={handleVolumeChange}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.primary}
              />

              <Text style={globalStyles.editorLabel}>Speed (Current: {speed.toFixed(1)}x)</Text>
              <Slider
                style={globalStyles.editorSlider}
                minimumValue={0.5}
                maximumValue={2.0}
                step={0.1}
                value={speed}
                onValueChange={handleSpeedChange}
                minimumTrackTintColor={colors.primary}
                maximumTrackTintColor={colors.border}
                thumbTintColor={colors.primary}
              />
              
              <View style={globalStyles.editorButtonRow}>
                <TouchableOpacity 
                  style={[globalStyles.editorButton, globalStyles.editorButtonSecondary]} 
                  onPress={onClose}
                >
                  <Text style={globalStyles.editorButtonTextSecondary}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[globalStyles.editorButton, globalStyles.editorButtonPrimary]} 
                  onPress={handleSave}
                >
                  <Text style={globalStyles.editorButtonTextPrimary}>Save</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default AudioEditorModal;