import axios from "axios";
import Constants from 'expo-constants';

export const getPlacesData = async (bl_lat, bl_lng, tr_lat, tr_lng, type) => {
    try {
        const RAPID_API_KEY = Constants.expoConfig.extra.RAPID_API_KEY;
        console.log(RAPID_API_KEY);
        const {data : {data}} = await axios.get(`https://travel-advisor.p.rapidapi.com/${type}/list-in-boundary`,
            {
                params: {
                    bl_latitude: bl_lat ? bl_lat : '52.01477165373726',
                    tr_latitude: tr_lat ? tr_lat : '52.12853683254968',
                    bl_longitude: bl_lng ? bl_lng : '4.196710389479046',
                    tr_longitude: tr_lng ? tr_lng : '4.42302629668355',
                    limit: '30',
                    currency: 'EUR',
                    lunit: 'km',
                    lang: 'en_US'
                },
                headers: {
                    'x-rapidapi-key': RAPID_API_KEY,
                    'x-rapidapi-host': 'travel-advisor.p.rapidapi.com'
                }
            }
        );

        return data;
    }
    catch (error) {
        return null;
    }
}