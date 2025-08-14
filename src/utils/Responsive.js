// src/utils/responsive.js

import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width, height } = Dimensions.get('window');

// Referans boyutlar (örnek iPhone 11)
const guidelineBaseWidth = 375;
const guidelineBaseHeight = 812;


const scaleSize = (size) => {
  const scale = width / guidelineBaseWidth;
  const newSize = size * scale;

  if (Platform.OS === 'android') {
    // Android'de pixel ratio ile yuvarla
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    
    return Math.round(newSize);
  }
};

const verticalScale = (size) => (height / guidelineBaseHeight) * size;

const moderateScale = (size, factor = 0.5) => {
  const scaledSize = scaleSize(size);
  return size + (scaledSize - size) * factor;
};

export { scaleSize as scale, verticalScale, moderateScale };
