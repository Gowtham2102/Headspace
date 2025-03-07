import { useState, useEffect } from 'react';
import { Text, View, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router'; // ✅ Use useRouter
import { Audio } from 'expo-av';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { SafeAreaView } from 'react-native-safe-area-context';
import Slider from '@react-native-community/slider';
import { meditations } from '@/data';
import AnimatedBackground from '@/components/AnimatedBackground';


export default function MeditationDetails() {
  const router = useRouter(); // ✅ Initialize router
  const audioFile = require('@assets/meditations/audio1.mp3');
  const { id } = useLocalSearchParams<{ id: string }>();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const meditation = meditations.find((m) => m.id === Number(id));

  useEffect(() => {
    async function loadAudio() {
      const { sound } = await Audio.Sound.createAsync(audioFile);
      setSound(sound);

      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setDuration(status.durationMillis || 0);
          setCurrentTime(status.positionMillis || 0);
          setIsPlaying(status.isPlaying);
        }
      });
    }

    loadAudio();

    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, []);

  const togglePlayback = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = async (value: number) => {
    if (sound) {
      await sound.setPositionAsync(value);
    }
  };

  const formatSeconds = (milliseconds: number) => {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!meditation) {
    return <Text>Meditation not found!</Text>;
  }

  return (
    <SafeAreaView className="bg-orange-400 flex-1 p-2 justify-between">
      {/* Header */}
      <AnimatedBackground />
      <View className="flex-1">
      <View className="flex-1">
      <View className="flex-row items-center justify-between p-10">
        <AntDesign name="infocirlceo" size={24} color="black" />
        <View className="bg-zinc-800 p-2 rounded-md">
          <Text className="text-zinc-100 font-semibold">Today's meditation</Text>
        </View>
        <AntDesign
  onPress={async () => {
    if (sound) {
      await sound.stopAsync(); // Stop playback
      await sound.unloadAsync(); // Unload sound to free resources
    }
    router.back(); // Navigate back
  }}
  name="close"
  size={26}
  color="black"
/>
      </View>

      {/* Title */}
      <Text className="text-3xl mt-20 text-center text-zinc-800 font-semibold">
        {meditation?.title}
      </Text>
</View>
      {/* Play/Pause Button */}
      <Pressable
        onPress={togglePlayback}
        className="bg-zinc-800 self-center w-20 aspect-square rounded-full items-center justify-center"
      >
        <FontAwesome6 name={isPlaying ? 'pause' : 'play'} size={24} color="snow" />
      </Pressable>
      <View className="flex-1">
      {/* Playback Controls */}
      <View className="p-5 mt-auto gap-5">
      <View className="flex-row justify-between">
              <MaterialIcons name="airplay" size={24} color="#3A3937" />
              <MaterialCommunityIcons
                name="cog-outline"
                size={24}
                color="#3A3937"
              />
            </View>
        {/* Seek Slider */}
        <Slider
          style={{ width: '100%', height: 3 }}
          value={currentTime}
          onSlidingComplete={handleSeek}
          minimumValue={0}
          maximumValue={duration}
          minimumTrackTintColor="#3A3937"
          maximumTrackTintColor="#3A393755"
          thumbTintColor="#3A3937"
        />

        {/* Time Display */}
        <View className="flex-row justify-between">
          <Text>{formatSeconds(currentTime)}</Text>
          <Text>{formatSeconds(duration)}</Text>
        </View>
      </View>
    </View>
    </View>
    </SafeAreaView>
  );
}
