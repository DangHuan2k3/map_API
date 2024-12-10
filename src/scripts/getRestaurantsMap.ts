import axios from 'axios';
import { getPlaceDetails, searchPlacesInDaNang } from '../helper/place';
import fs from 'fs';
import path from 'path';
import { db } from '../firebase/config';

axios.defaults.baseURL = 'http://localhost:8080';

async function getRestaurants() {
    try {
        const response = await axios.get('/data/restaurants');
        return response.data;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        throw error; // Optionally rethrow the error if you want to handle it elsewhere
    }
}

export default async () => {
    try {
        const restaurants = await getRestaurants();

        const restaurants_new = await Promise.all(
            restaurants.map(async (restaurant: any) => {
                return searchPlacesInDaNang(restaurant.restaurant_name)
                .then(async (results) => {
                    const firstSearchedResult = results[0];
                    const { placeId } = firstSearchedResult;
                    const restaurantInfo = await getPlaceDetails(placeId);
                    
                    return restaurantInfo;
                }).catch((err) => {
                    console.error('Error fetching place details:', err);
                    return null; // Return null to handle errors gracefully
                });
            })
        );
        // Filter out any null values from the result
        const filteredRestaurants = restaurants_new.filter(Boolean);


        // Save the result to a JSON file
        fs.writeFileSync(
            path.join(__dirname, 'restaurants_new.json'),
            JSON.stringify(filteredRestaurants, null, 2),
            'utf-8'
        );
        
        const batch = db.batch();
        filteredRestaurants.forEach((restaurantInfo) => {
            const docRef = db.collection('restaurants_new').doc(); // Automatically generate an ID
            batch.set(docRef, restaurantInfo);
        });

        console.log('Data saved to Firestore collection "restaurants_new" successfully.');

        // Commit the batch write
        await batch.commit();

        return filteredRestaurants;
    } catch (error) {
        console.error('Failed to fetch restaurants:', error);
    }
};
