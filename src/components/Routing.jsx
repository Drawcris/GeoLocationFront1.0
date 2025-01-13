import React, { useRef, useEffect, useState } from "react"; 
import tt from "@tomtom-international/web-sdk-maps";
import { services } from "@tomtom-international/web-sdk-services";
import axiosInstance from "../axiosInstance"; 
import "@tomtom-international/web-sdk-maps/dist/maps.css";
import { ScrollArea } from "@/components/ui/scroll-area";  
import { Separator } from "@/components/ui/separator";  
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { useAuth } from '../context/AuthContext';
import { DialogTitle } from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

const API_KEY = "";
const Zywiec = [19.19243, 49.68529];

function Routing() {
  const { user } = useAuth();
  const mapElement = useRef();
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [routeLayer, setRouteLayer] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null); 
  const [orderedLocations, setOrderedLocations] = useState([]); 

  const fetchRoutes = async () => {
    try {
      const response = await axiosInstance.get(`/api/Routes/email/${user.email}`);
      setRoutes(response.data);
    } catch (error) {
      console.error("Error fetching routes from API:", error);
    }
  };

  useEffect(() => {
    const initializeMap = () => {
      const mapInstance = tt.map({
        key: API_KEY,
        container: mapElement.current,
        center: Zywiec,
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

  useEffect(() => {
    if (user) {
      fetchRoutes();
    }
  }, [user]);

  const createMarker = (position, index, address, totalAddresses) => {
    let markerElement = document.createElement("div");

    if (index === 0) {
      markerElement.className = "custom-marker";
      markerElement.innerHTML = `<i class="bi bi-cursor-fill"></i>`;
    } else if (index === totalAddresses - 1) {
      markerElement.className = "custom-marker";
      markerElement.innerHTML = '<i class="bi bi-flag"></i>';
    } else {
      markerElement.className = "custom-marker";
      markerElement.innerHTML = `<i class="bi bi-pin-map-fill"></i>`;
    }

    const marker = new tt.Marker({
      element: markerElement,
    })
      .setLngLat([position.lng, position.lat])
      .addTo(map);

    const popup = new tt.Popup({ offset: 30 }).setText(`${address.address}, ${address.city}`);
    marker.setPopup(popup);

    setMarkers((prevMarkers) => [...prevMarkers, marker]);
  };

  const handleRoute = async (computeBestOrder) => {
    if (!selectedRoute || !selectedRoute.locations || selectedRoute.locations.length < 2) {
      console.error("Brak wystarczających danych do wyznaczenia trasy.");
      return;
    }

    if (routeLayer) {
      map.removeLayer("route");
      map.removeSource("route");
      setRouteLayer(null);
    }

    markers.forEach((marker) => marker.remove());
    setMarkers([]);
    setRouteDistance(null); 
    setRouteDuration(null); 

    try {
      const coordinatesPromises = selectedRoute.locations.map(async (location, index) => {
        if (index > 0) await new Promise((resolve) => setTimeout(resolve, 1000));
        const response = await services.fuzzySearch({
          key: API_KEY,
          query: `${location.address}, ${location.city}`,
        });
        const position = response.results[0]?.position;
        if (!position) {
          throw new Error(`Nie znaleziono współrzędnych dla adresu: ${location.address}`);
        }

        createMarker(position, index, location, selectedRoute.locations.length);
        return { position, location };
      });

      const results = await Promise.all(coordinatesPromises);
      const coordinates = results.map(result => result.position);
      const orderedLocations = results.map(result => result.location);
      setOrderedLocations(orderedLocations);

      const routeResponse = await services.calculateRoute({
        key: API_KEY,
        locations: coordinates.map((coord) => `${coord.lng},${coord.lat}`),
        computeBestOrder,
        routeType: "fastest",
      });

      const geojson = routeResponse.toGeoJson();
      const distance = routeResponse.routes[0].summary.lengthInMeters; 
      const duration = routeResponse.routes[0].summary.travelTimeInSeconds; 
      setRouteDistance((distance / 1000).toFixed(2)); 
      setRouteDuration((duration / 60).toFixed(0)); 

      map.addSource("route", {
        type: "geojson",
        data: geojson,
      });

      map.addLayer({
        id: "route",
        type: "line",
        source: "route",
        paint: {
          "line-color": "#4a90e2",
          "line-width": 5,
        },
      });
      setRouteLayer("route");

      const bounds = new tt.LngLatBounds();
      coordinates.forEach((coord) => bounds.extend(coord));
      map.fitBounds(bounds, { padding: 50 });
    } catch (err) {
      console.error("Błąd przy obliczaniu trasy:", err);
    }
  };

  

  const handleCompleteRoute = async () => {
    if (!selectedRoute) return;

    try {
      await axiosInstance.put(`/api/Routes/${selectedRoute.id}/complete`);
      window.location.reload();
    } finally {
      alert('Trasa została oznaczona jako ukończona');
    }
  };

  const openInGoogleMaps = () => {
    if (!selectedRoute || !selectedRoute.locations || selectedRoute.locations.length === 0) {
      alert("Brak wystarczających danych do otwarcia trasy w Google Maps.");
      return;
    }
  
    const baseUrl = 'https://www.google.com/maps/dir/?api=1&travelmode=driving';
    const origin = `${selectedRoute.locations[0].address}, ${selectedRoute.locations[0].city}`;
    const destination = `${selectedRoute.locations[selectedRoute.locations.length - 1].address}, ${selectedRoute.locations[selectedRoute.locations.length - 1].city}`;
    const waypoints = selectedRoute.locations.slice(1, -1).map(location => `${location.address}, ${location.city}`).join('|');
  
    const url = `${baseUrl}&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&waypoints=${encodeURIComponent(waypoints)}`;
    window.open(url, '_blank');
  };
  return (
    <>
      <div className="App">
      <div className="min-h-screen bg-gray-100 ">
        <div className="flex space-x-24 ml-20">
          <ScrollArea className="h-1/1 w-1/5 rounded-md bg-white border ml-14 mt-9">
            <div className="p-4">
              <div className=" text-center mb-5 space-x-5">
                <DropdownMenu>
                  <DropdownMenuTrigger className="bg-blue-600 hover:bg-green-800 mt-5 rounded-sm h-10 w-60 text-white">
                    Wyznacz Trase <span className="bi bi-sign-turn-slight-right-fill"></span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>Opcje Trasy</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleRoute(true)}>Szybka</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRoute(false)}>Po kolei</DropdownMenuItem>
                    <DropdownMenuItem className="bg-green-500 hover:bg-green-300" onClick={() => openInGoogleMaps()}>Otwórz w Google Maps
                      <i className="bi bi-google"></i>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <Select onValueChange={(value) => {
                const route = routes.find((route) => route.id.toString() === value);
                setSelectedRoute(route);
              }}>
                <SelectTrigger className="mb-4">
                  <SelectValue placeholder="Wybierz trasę" />
                </SelectTrigger>
                <SelectContent>
                  {routes.map((route) => (
                    <SelectItem key={route.id} value={route.id.toString()}>
                      {route.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedRoute && (
                <div key={selectedRoute.id} className="mb-6">
                  <div className="text-sm">
                    <p><b>Nazwa trasy:</b> {selectedRoute.name}</p>
                    <p><b>Status: </b>{selectedRoute.status}</p><br />
                    {selectedRoute.locations.map((location, index) => (
                      <div key={index} className="mb-4">
                        <p><b>Adres:</b> {location.address || "brak"}</p>
                        <p><b>Miejscowość:</b> {location.city || "brak"}</p>
                        <p><b>Kod Pocztowy:</b> {location.zipCode || "brak"}</p>
                      </div>
                    ))}
                  </div>
                    {routeDistance && routeDuration && (
                      <div className="text-center mt-4">
                        <p><b>Długość trasy:</b> {routeDistance} km</p>
                        <p><b>Szacowany czas przejazdu:</b> {routeDuration} m</p>
                      </div>
                    )}
                  <div className="text-center">
                    <Button className="bg-blue-700" onClick={() => setIsCompleteDialogOpen(true)}>
                      Oznacz jako ukończoną
                    </Button>
                    <Dialog open={isCompleteDialogOpen} onOpenChange={setIsCompleteDialogOpen}>
                      <DialogContent>
                        <VisuallyHidden>
                          <DialogTitle>My Dialog Title</DialogTitle>
                        </VisuallyHidden>
                        <DialogHeader>
                          <h3 className="text-lg font-semibold">Potwierdzenie</h3>
                        </DialogHeader>
                        <p>Czy na pewno chcesz oznaczyć tę trasę jako ukończoną?</p>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsCompleteDialogOpen(false)}>
                            Anuluj
                          </Button>
                          <Button className="bg-orange-400 hover:bg-blue-800" onClick={handleCompleteRoute}>
                            Potwierdź
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    
                  </div>
                  <Separator className="my-2" />
                </div>
              )}
            </div>
          </ScrollArea>
          
          <div className="w-2/3 rounded-lg mt-10 RoutemapDiv" ref={mapElement}></div>
        </div>
      </div>
    </div>
    </>
  );
}

export default Routing;