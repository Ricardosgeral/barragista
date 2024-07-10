// app/page.tsx
"use client";
import { useState, useEffect } from "react";

type CityData = {
  [key: string]: any;
};

export default function GeolocationPage() {
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [data, setData] = useState<CityData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (city.trim() !== "" && country.trim() !== "") {
        try {
          const response = await fetch(
            `/api/geocoding?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}`,
            {
              headers: {
                "Ninja-Api-Key": process.env.API_NINJAS_API_SECRET || "",
              },
            },
          );
          if (response.ok) {
            const result = await response.json();
            setData(result.data);
            setError(null);
          } else {
            const errorData = await response.json();
            setError(errorData.error || "Failed to fetch data");
            setData(null);
          }
        } catch (error) {
          console.error("Fetch error:", error);
          setError("An error occurred while fetching data");
          setData(null);
        }
      }
    };

    fetchData();
  }, [city, country]);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCountry(e.target.value);
  };

  return (
    <div>
      <form>
        <input
          type="text"
          value={city}
          onChange={handleCityChange}
          placeholder="Enter city name"
          required
        />
        <input
          type="text"
          value={country}
          onChange={handleCountryChange}
          placeholder="Enter country name"
          required
        />
      </form>
      {error && <p>Error: {error}</p>}
      {data && (
        <div>
          <h3>City Data:</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
