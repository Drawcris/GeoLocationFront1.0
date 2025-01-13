import React, { useState, useEffect, useRef } from "react"; 
import { services } from "@tomtom-international/web-sdk-services";
import tt from "@tomtom-international/web-sdk-maps";
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import "../App.css";

const API_KEY = "A7x2Co2slX6ap1HDQbdUUcG3rJyKYaRA";
const Zywiec = [19.19243, 49.68529];


const Search = () => {
  const mapElement = useRef();
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const initializeMap = () => {
      const mapInstance = tt.map({
        key: API_KEY,
        container: mapElement.current,
        center: [19.945, 50.0647],
        zoom: 12,
      });
      setMap(mapInstance);
    };

    initializeMap();

    return () => {
      if (map) {
        map.remove();
      }
    };
  }, []);

  const handleSearch = () => {
    if (!searchQuery) return;

    services
      .fuzzySearch({
        key: API_KEY,
        query: searchQuery,
      })
      .then((response) => {
        const results = response.results;
        setSearchResults(results);

        markers.forEach((marker) => marker.remove());
        setMarkers([]);

        const newMarkers = results.map((result) => {
          const marker = new tt.Marker().setLngLat(result.position).addTo(map);
          const popup = new tt.Popup({ offset: [0, -30], closeButton: true })
            .setHTML(`
              <div>
                <strong>${result.poi?.name || "Brak nazwy"}</strong>
                <p>${result.address.freeformAddress}</p>
              </div>
            `);

          marker.setPopup(popup);
          return marker;
        });
        setMarkers(newMarkers);

        if (results.length > 0) {
          map.flyTo({ center: results[0].position, zoom: 14 });
        }
      })
      .catch((err) => console.error(err));
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);

    markers.forEach((marker) => marker.remove());
    setMarkers([]);
  };

  return (
    <>
      <div className="relative h-full">
        <div className="absolute top-4 left-4 z-10 bg-white p-4 rounded shadow-md flex">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Szukaj lokalizacji..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
            className="p-2 border rounded w-64"
          />
          <div className="flex space-x-4 mt-2">
            <button onClick={handleSearch} className="p-2 bg-blue-500 text-white rounded">
              <i className="bi bi-search"></i>
            </button>
            <button onClick={handleClearSearch} className="p-2 bg-red-500 text-white rounded">
              <i className="bi bi-x-square"></i>
            </button>
          </div>
        </div>
        <div className="SearchmapDiv h-full" ref={mapElement}></div>
      </div>
    </>
  );
};

export default Search;