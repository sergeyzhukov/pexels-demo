import React, {useCallback, useEffect, useMemo} from 'react';
import {
  FlatList,
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useUnit} from 'effector-react';
import FastImage from 'react-native-fast-image';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {curatedPhotosStore, fetchCuratedImagesFx, resetPhotos} from '../stores';
import {Photo} from '../types';

type ProfileScreenNavigationProp = NativeStackNavigationProp<
  RouteParams,
  'Main'
>;

import {RouteParams} from '../Navigation';

const DEVICE_WIDTH = Dimensions.get('window').width;
const PADDING = 4;
const PADDING_BOTTOM = 8;
const LIST_PADDING = 16;
const ITEM_WIDTH = Math.floor(
  (DEVICE_WIDTH - LIST_PADDING * 2) / 3 - PADDING * 2,
);

const styles = StyleSheet.create({
  footer: {
    height: 48,
  },
  list: {
    flexGrow: 1,
    backgroundColor: '#fff',
    paddingTop: LIST_PADDING,
    paddingHorizontal: LIST_PADDING,
  },
  itemContainer: {
    padding: PADDING,
    paddingBottom: PADDING_BOTTOM,
  },
  imageContainer: {
    shadowRadius: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowColor: '#000',
  },
  itemTitle: {
    height: 16,
    lineHeight: 16,
    fontSize: 12,
    width: ITEM_WIDTH,
    fontWeight: '500',
    marginTop: 6,
    textAlign: 'center',
  },
  image: {
    width: ITEM_WIDTH,
    height: ITEM_WIDTH,
    borderRadius: 8,
    overflow: 'hidden',
  },
});

function MainScreen(): React.JSX.Element {
  const {navigate} = useNavigation<ProfileScreenNavigationProp>();
  const [curatedPhotos, isLoading] = useUnit([
    curatedPhotosStore,
    fetchCuratedImagesFx.pending,
  ]);

  useEffect(() => {
    fetchCuratedImagesFx({page: 1});
  }, []);

  const renderFooter = useMemo(
    () => (
      // to avoid jumping on activity indicator appear
      <View style={styles.footer}>
        <ActivityIndicator animating={isLoading} size="large" />
      </View>
    ),
    [isLoading],
  );

  const renderItem = useCallback(
    ({item}: {item: Photo}) => {
      return (
        <TouchableOpacity
          style={styles.itemContainer}
          onPress={() => {
            navigate('Details', {id: item.id});
          }}>
          <View shouldRasterizeIOS>
            <View style={styles.imageContainer}>
              <FastImage
                source={{uri: item.src.medium}}
                resizeMode={FastImage.resizeMode.cover}
                style={styles.image}
              />
            </View>
            <Text numberOfLines={1} style={styles.itemTitle}>
              {item.photographer}
            </Text>
          </View>
        </TouchableOpacity>
      );
    },
    [navigate],
  );

  const handleRefresh = useCallback(() => {
    resetPhotos();
  }, []);

  const handleEndReached = useCallback(() => {
    if (isLoading) {
      return;
    }
    const nextPage = curatedPhotos.lastPageLoaded + 1;

    if (nextPage <= curatedPhotos.totalPages) {
      fetchCuratedImagesFx({page: nextPage});
    }
  }, [curatedPhotos.lastPageLoaded, isLoading, curatedPhotos.totalPages]);

  return (
    <FlatList
      data={curatedPhotos.photos}
      numColumns={3}
      ListFooterComponent={renderFooter}
      contentContainerStyle={styles.list}
      renderItem={renderItem}
      keyExtractor={item => String(item.id)}
      onRefresh={handleRefresh}
      getItemLayout={(_, index) => ({
        length: ITEM_WIDTH + (PADDING + PADDING_BOTTOM) + 22,
        offset: (ITEM_WIDTH + PADDING + PADDING_BOTTOM + 22) * index,
        index,
      })}
      refreshing={isLoading}
      onEndReached={handleEndReached}
      onEndReachedThreshold={0.01}
    />
  );
}

export default MainScreen;
