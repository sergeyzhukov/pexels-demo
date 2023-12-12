import React from 'react';
import {View, StyleSheet, ActivityIndicator, Dimensions} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';

import {useUnit} from 'effector-react';
import Zoom from 'react-native-zoom-reanimated';
import FastImage from 'react-native-fast-image';
import {curatedPhotosStore} from '../stores';
import {RouteParams} from '../Navigation';

const DEVICE_WIDTH = Dimensions.get('window').width;

function DetailsScreen(): React.JSX.Element | null {
  // if we want to have swiping between different photo better to have info about all of them rather than passing data directly using route
  const curatedPhotos = useUnit(curatedPhotosStore);
  const [loading, setLoading] = React.useState(false);

  const route = useRoute<RouteProp<RouteParams, 'Details'>>();
  const photoId = route.params.id;

  const item = React.useMemo(() => {
    return curatedPhotos.photos.find(photo => photo.id === photoId);
  }, [curatedPhotos.photos, photoId]);

  if (!item) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Zoom>
        <FastImage
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          style={{
            width: DEVICE_WIDTH,
            height: (item.height * DEVICE_WIDTH) / item.width,
          }}
          source={{uri: item.src.original}}
          resizeMode={FastImage.resizeMode.contain}
        />
      </Zoom>
      <View pointerEvents="none" style={styles.loadingOverlay}>
        <ActivityIndicator animating={loading} size="large" color="#000" />
      </View>
    </View>
  );
}

export default DetailsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});
