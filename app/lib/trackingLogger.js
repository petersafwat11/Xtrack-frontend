import Cookies from 'js-cookie';
import api from './axios';

// export const logTrackingSearch = async ({ menu_id, api_request, api_status = 'S', api_error = null }) => {
//     try {
//         const user = Cookies.get('user')? JSON.parse(Cookies.get('user')):null;
//         const response = await api.post('/api/tracking', {
//             user_id: user?.user_id|| "iframe",
//             menu_id,
//             api_request,
//             api_status,
//             api_error
//         });
//         return response.data;
//     } catch (error) {
//         console.error('Error logging tracking:', error);
//     }
// };
export const logTrackingSearch = async ({ menu_id, api_request, api_status = 'S', api_error = null }) => {
  try {
      let user = null;
      try {
          const userCookie = Cookies.get('user');
          user = userCookie ? JSON.parse(userCookie) : null;
      } catch (parseError) {
          console.error('Error parsing user cookie:', parseError);
      }

      const response = await api.post('/api/tracking', {
          user_id: user?.user_id || "iframe", // Use "iframe" if no user
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

export const getExternalAPILink = async (menu_id) => {
    try {
      // Using node-fetch on server side
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_SERVER }/api/endpoints/${menu_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // cache: 'no-store' // Disable caching for this request
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching endpoint data:', error);
      return null;
    }
  };
  
  