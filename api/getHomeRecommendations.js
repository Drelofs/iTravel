import { getPlacesData } from './index';

/** Delta for bounding box around user (~few km). */
const DELTA = 0.04;

/**
 * Fetch nearby POIs using the same list-in-boundary API as MapScreen.
 * Returns restaurants, hotels, and attractions in separate arrays.
 *
 * @param {number} latitude - User latitude
 * @param {number} longitude - User longitude
 * @returns {Promise<{ restaurants: array, hotels: array, attractions: array }>}
 */
export async function getHomeRecommendations(latitude, longitude) {
  try {
    const bl_lat = latitude - DELTA;
    const bl_lng = longitude - DELTA;
    const tr_lat = latitude + DELTA;
    const tr_lng = longitude + DELTA;

    const [restaurants, attractions, hotels] = await Promise.all([
      getPlacesData(bl_lat, bl_lng, tr_lat, tr_lng, 'restaurants'),
      getPlacesData(bl_lat, bl_lng, tr_lat, tr_lng, 'attractions'),
      getPlacesData(bl_lat, bl_lng, tr_lat, tr_lng, 'hotels'),
    ]);

    return {
      restaurants: Array.isArray(restaurants) ? restaurants : [],
      attractions: Array.isArray(attractions) ? attractions : [],
      hotels: Array.isArray(hotels) ? hotels : [],
    };
  } catch (error) {
    console.error('getHomeRecommendations error:', error?.message ?? error);
    return { restaurants: [], hotels: [], attractions: [] };
  }
}
