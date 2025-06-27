import axios from "axios";

export const getPlacesData = async () => {
    try {
        const {data : {data}} = await axios.get(`https://travel-advisor.p.rapidapi.com/restaurants/list-in-boundary`,
            {
                params: {
                    bl_latitude: '52.01477165373726',
                    tr_latitude: '52.12853683254968',
                    bl_longitude: '4.196710389479046',
                    tr_longitude: '4.42302629668355',
                    limit: '30',
                    currency: 'USD',
                    lunit: 'km',
                    lang: 'en_US'
                },
                headers: {
                    'x-rapidapi-key': 'd3083dcd03mshf7970377bcc4ec1p1ce5f8jsn917f9341cee3',
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