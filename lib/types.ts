export type WeatherData = {
  MinTemp: number
  MaxTemp: number
  Rainfall: number
  Evaporation: number
  Sunshine: number
  WindGustDir: string
  WindGustSpeed: number
  WindDir9am: string
  WindDir3pm: string
  WindSpeed9am: number
  WindSpeed3pm: number
  Humidity9am: number
  Humidity3pm: number
  Pressure9am: number
  Pressure3pm: number
  Cloud9am: number
  Cloud3pm: number
  Temp9am: number
  Temp3pm: number
  RainToday: number | string
  RISK_MM: number
  RainTomorrow: number | string
}

export type HousePriceData = {
  price: number
  area: number
  bedrooms: number
  bathrooms: number
  stories: number
  mainroad: string
  guestroom: string
  basement: string
  hotwaterheating: string
  airconditioning: string
  parking: string
  prefarea: string
  furnishingstatus: string
  id?: number
}

export type FlightData = {
  FL_DATE: string
  DEP_DELAY: number
  ARR_DELAY: number
  AIR_TIME: number
  DISTANCE: number
  DEP_TIME: number | string
  ARR_TIME: number | string
}
