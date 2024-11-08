import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Presets } from '@/data/PresetData';

interface PresetProps {
  onTabPress: (content: React.ReactNode) => void;
}

const Preset: React.FC<PresetProps> = ({ onTabPress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {Presets.map((preset) => (
          <View key={preset.id} style={styles.presetBox}>
            <Image source={preset.image} style={styles.presetImage} />
            <TouchableOpacity
              style={styles.titleContainer}
              onPress={() => onTabPress(<Text>Nội dung {preset.name}</Text>)}
            >
              <Text style={styles.presetName}>{`${preset.name}`}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  grid: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between', 
  },
  presetBox: {
    width: '48%', 
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  presetImage: {
    width: '100%',
    height: 180,
    borderRadius: 10,
    resizeMode: 'cover',
  },
  titleContainer: {
    position: 'absolute',
    bottom: 8,
    left: 0,
    right: 0,
    borderRadius: 10,
    alignItems: 'center',
  },
  presetName: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding:6,
    borderRadius: 10,
  },
});

export default Preset;