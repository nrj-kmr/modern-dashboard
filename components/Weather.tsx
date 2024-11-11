"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from 'lucide-react';
import axios from "axios";
import { useState, useCallback } from "react";
import debounce from "lodash.debounce";

const API_URL = process.env.NEXT_PUBLIC_WEATHER_API_URL || "";
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY || "";

interface WeatherData {
  city: {
    name: string;
    country: string;
    sunrise: number;
    sunset: number;
  };
  list: {
    main: {
      temp: string;
      feels_like: string;
      humidity: string;
    };
    wind: {
      speed: string;
    };
    weather: {
      description: string;
      icon: string;
    }[];
  }[];
}

const cache: { [key: string]: WeatherData | null } = {};

async function handleGetWeather(city: string): Promise<WeatherData | null> {
  if (cache[city]) {
    return cache[city];
  }

  try {
    const response = await axios.get(API_URL, {
      params: { q: city, appid: API_KEY, units: "metric" },
    });
    cache[city] = response.data;
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return null;
  }
}

function formatTime(unixTimestamp: number): string {
  const date = new Date(unixTimestamp * 1000);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

export default function Weather() {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);

  const debouncedFetchWeather = useCallback(
    debounce(async (city: string) => {
      setLoading(true);
      const data = await handleGetWeather(city);
      setWeatherData(data);
      setLoading(false);
    }, 500),
    []
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCity(event.target.value);
    debouncedFetchWeather(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const data = await handleGetWeather(city);
    setWeatherData(data);
    setLoading(false);
  };

  return (
    <div className="h-full pb-5">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <CardTitle>How's the weather today?</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-auto">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col sm:flex-row w-full max-w-sm items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <Input
                type="text"
                placeholder="Enter your city name"
                value={city}
                onChange={handleChange}
                className="w-full"
                required
              />
              <Button type="submit" className="w-full sm:w-auto">Get Weather</Button>
            </div>
          </form>
          {loading ? (
            <div className="flex justify-center items-center mt-4">
              <Loader2 className="animate-spin" size={24} />
            </div>
          ) : (
            weatherData && (
              <div className="mt-4">
                <h1 className="scroll-m-20 text-2xl font-semibold tracking-tight text-center">
                  {weatherData.city.name}, {weatherData.city.country}
                </h1>
                <p className="-scroll-ms-4 text-sm text-muted-foreground text-center">
                  {weatherData.list[0].weather[0].description}
                </p>
                <div className="flex justify-center mt-4">
                  <img
                    src={`http://openweathermap.org/img/wn/${weatherData.list[0].weather[0].icon}@2x.png`}
                    alt={weatherData.list[0].weather[0].description}
                    className="w-20 h-20 md:w-24 md:h-24 lg:w-32 lg:h-32"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 m-3">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">{weatherData.list[0].main.temp}°C</CardTitle>
                      <CardDescription className="text-center">Current Temperature</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">{weatherData.list[0].main.feels_like}°C</CardTitle>
                      <CardDescription className="text-center">Feels Like</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">{weatherData.list[0].main.humidity}%</CardTitle>
                      <CardDescription className="text-center">Humidity</CardDescription>
                    </CardHeader>
                  </Card>
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-center">{weatherData.list[0].wind.speed} m/s</CardTitle>
                      <CardDescription className="text-center">Wind Speed</CardDescription>
                    </CardHeader>
                  </Card>
                </div>
                <p className="text-center">
                  <b>Sunrise</b>: {formatTime(weatherData.city.sunrise)}
                </p>
                <p className="text-center">
                  <b>Sunset</b>: {formatTime(weatherData.city.sunset)}
                </p>
              </div>
            )
          )}
        </CardContent>
      </Card>
    </div>
  );
}