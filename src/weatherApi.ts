import axios from 'axios'

export async function weatherApi(city:string){
    try{
        const { data } = await axios.get(`https://api.weatherapi.com/v1/forecast.json`, {
            params: {
                key: 'f73e81c3de2849459a4140648250311',
                q: city,
                days: '3',
                aqi: 'no',
                alerts: 'no'
            }
        })
        return data
    } catch (e) {
        console.error('Problem with api', e)
        return null
    }
}