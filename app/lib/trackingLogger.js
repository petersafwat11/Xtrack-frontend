import Cookies from 'js-cookie';
import api from './axios';

export const logTrackingSearch = async ({ menu_id, api_request, api_status = 'S', api_error = null }) => {
    try {
        const user = JSON.parse(Cookies.get('user'));
        const response = await api.post('/api/tracking', {
            user_id: user?.user_id,
            menu_id,
            api_request,
            api_status,
            api_error
        });
        return response.data;
    } catch (error) {
        console.error('Error logging tracking:', error);
    }
};
