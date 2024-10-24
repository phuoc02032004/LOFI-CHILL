import React, { useRef, useState, useEffect } from 'react';
import { View, Dimensions, Text, StyleSheet } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import Loading from '../Loading/Loading';
import Header from '../Header/Header';

const ChillScreen = () => {
  const { height, width } = Dimensions.get('window');
  const videoRef = useRef<Video>(null);
  const [status, setStatus] = useState<AVPlaybackStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVideo = async () => {
      if (videoRef.current) {
        try {
          await videoRef.current.playAsync();
          setIsLoading(false);
        } catch (error) {
          console.error('Error playing video:', error);
          setIsLoading(false); 
        }
      }
    };

    setIsLoading(true);
    loadVideo();
  }, []);

  return (
    <View style={styles.container}>
      <Header />
      {isLoading && <Loading />}
      <Video
        ref={videoRef}
        source={require('../../assets/videos/bk.mp4')} 
        style={[styles.video, { height, width }]}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
        usePoster={require('../../assets/images/imgCampfire.jpg')} 
        onPlaybackStatusUpdate={(status) => setStatus(status as AVPlaybackStatus)}
        onError={(error) => console.error('Video Error:', error)}
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>This is Chill Screen</Text> 
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', 
  },
  text: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: 'white'
  },
});

export default ChillScreen;