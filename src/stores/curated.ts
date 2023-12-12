import {createEffect, createEvent, createStore} from 'effector';
import {DEFAULT_PER_PAGE, fetchCuratedPhotos} from '../api/pexels';
import {Photo} from '../types';

interface CuratedPhotosStore {
  photos: Photo[];
  lastPageLoaded: number;
  totalPages: number;
}

export const fetchCuratedImagesFx = createEffect(async ({page = 1}) =>
  fetchCuratedPhotos(page),
);

export const resetPhotos = createEvent<void>();

const INITIAL_STATE: CuratedPhotosStore = {
  photos: [],
  lastPageLoaded: 0,
  totalPages: 1,
};

export const curatedPhotosStore = createStore<CuratedPhotosStore>(INITIAL_STATE)
  .on(fetchCuratedImagesFx.doneData, (state, newPhotosResponse) => {
    const {photos, page, total_results} = newPhotosResponse;

    // Check if the page is already loaded
    if (page <= state.lastPageLoaded) {
      return state;
    }

    return {
      photos: page === 1 ? photos : [...state.photos, ...photos],
      lastPageLoaded: page,
      totalPages: Math.ceil(total_results / DEFAULT_PER_PAGE),
    };
  })
  .reset(resetPhotos);
