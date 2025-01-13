
{/* Funkcjonalność ta została porzucona */}

import React, { useRef, useEffect, useState } from "react"; 
import { GoogleMap, LoadScript, Marker, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";
import axiosInstance from "../axiosInstance";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogTitle, DialogContent, DialogFooter, DialogHeader } from '@/components/ui/dialog';
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const API_KEY = "AIzaSyCAqf_KI9iRz7ROJWMvwxJHM-vjhpLBa5g";
const Zywiec = { lat: 49.68529, lng: 19.19243 };

function GoogleRouting() {
  const { user } = useAuth();
  const [map, setMap] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);
  const [routeDistance, setRouteDistance] = useState(null);
  const [routeDuration, setRouteDuration] = useState(null);
  const [locationsWithCoordinates, setLocationsWithCoordinates] = useState([]);
  const [directions, setDirections] = useState(null);
  const [routeType, setRouteType] = useState("normal"); 

  const fetchRoutes = async () => {
    try {
      const response = await axiosInstance.get(`/api/Routes/email/${user.email}`);
      setRoutes(response.data);
    } catch (error) {
      console.error("Error fetching routes from API:", error);
    }
  };

  const fetchCoordinates = async (address, city, zipCode) => {
    if (!address && !city && !zipCode) {
      console.error("Address, city, and zip code are empty or invalid");
      return null;
    }

    const fullAddress = `${address ? address + ', ' : ''}${city ? city + ', ' : ''}${zipCode ? zipCode : ''}`;
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${API_KEY}`;

    try {
      const response = await axios.get(geocodeUrl);
      if (response.data.status === "OK") {
        const location = response.data.results[0]?.geometry?.location;
        if (location) {
          return { lat: location.lat, lng: location.lng };
        }
      } else {
        console.error("Geocode failed: " + response.data.status);
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
    }

    return null;
  };

  useEffect(() => {
    if (user) {
      fetchRoutes();
    }
  }, [user]);

  useEffect(() => {
    if (locationsWithCoordinates.length > 1 && selectedRoute) {
      const origin = locationsWithCoordinates[0];
      const destination = locationsWithCoordinates[locationsWithCoordinates.length - 1];
      const waypoints = locationsWithCoordinates.slice(1, -1).map(location => ({
        location: { lat: location.lat, lng: location.lng },
        stopover: true
      }));

      setDirections({
        origin: { lat: origin.lat, lng: origin.lng },
        destination: { lat: destination.lat, lng: destination.lng },
        waypoints: waypoints,
        travelMode: 'DRIVING',
        optimizeWaypoints: routeType === "optimized", 
      });
    }
  }, [locationsWithCoordinates, routeType, selectedRoute]);

  const handleRouteTypeChange = (value) => {
    setRouteType(value);  
  };

  const handleCompleteRoute = async () => {
    if (!selectedRoute) return;

    try {
      await axiosInstance.put(`/api/Routes/${selectedRoute.id}/complete`);
      window.location.reload();
    } finally {
      alert('Trasa została oznaczona jako ukończoną');
    }
  };

  const openGoogleMaps = () => {
    if (locationsWithCoordinates.length < 2) {
      alert("Trasa musi zawierać co najmniej dwa punkty!");
      return;
    }
  
    const origin = locationsWithCoordinates[0];
    const destination = locationsWithCoordinates[locationsWithCoordinates.length - 1];
    const waypoints = locationsWithCoordinates.slice(1, -1).map(location => `${location.lat},${location.lng}`).join('|');
  
    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&waypoints=${waypoints}`;
  
    window.open(googleMapsUrl, "_blank");
  };

  return (
    <LoadScript googleMapsApiKey={API_KEY}>
      <div className="App flex flex-col md:flex-row space-x-0 md:space-x-8 px-4">
        <div className="flex-1 md:w-1/4 max-h-[80vh] overflow-y-auto rounded-md border mt-8 mb-4 md:mb-0">
          <ScrollArea className="h-full p-4">
            <div className=" text-center mb-5 space-x-5">
              <DropdownMenu>
                <DropdownMenuTrigger className="bg-green-600 hover:bg-green-800 mt-1 rounded-sm h-10 w-full text-white">
                  Wyznacz Trase <span className="bi bi-sign-turn-slight-right-fill"></span>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Opcje Trasy</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleRouteTypeChange("normal")}>Normalna</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleRouteTypeChange("optimized")}>Optymalizowana</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="text-center mb-5">
              <p><b>Aktualny rodzaj trasy:</b> <br /> {routeType === "normal" ? "Normalna" : "Optymalizowana"}</p>
            </div>

            <Select onValueChange={(value) => {
              const route = routes.find((route) => route.id.toString() === value);
              setSelectedRoute(route);
              const coordinates = route.locations.map(location => fetchCoordinates(location.address, location.city, location.zipCode));
              Promise.all(coordinates).then(setLocationsWithCoordinates);
            }}>
              <SelectTrigger className="mb-4 w-full">
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
                <div className="text-center mt-4">
                  {routeDistance && (
                    <div>
                      <p><b>Długość trasy:</b> {routeDistance}</p>
                      <p><b>Czas przejazdu:</b> {routeDuration}</p>
                    </div>
                  )}

                  <Button className="bg-green-700 mt-2" onClick={() => setIsCompleteDialogOpen(true)}>
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

                <div className="text-center">
                <Button className="bg-blue-600 mt-2" onClick={openGoogleMaps}>
                  Otwórz w Google Maps
                  <i className="bi bi-google"></i>
                </Button>
                </div>
              </div>
            )}
          </ScrollArea>
        </div>

        <div className="flex-1 w-full rounded-lg mt-4 md:mt-0">
          <GoogleMap
            mapContainerStyle={{ height: "100%", width: "100%" }}
            center={Zywiec}
            zoom={12}
            onLoad={map => setMap(map)}
          >
            {locationsWithCoordinates.map((location, index) => (
              <Marker
                key={index}
                position={{ lat: location.lat, lng: location.lng }}
                
              />
            ))}

            {directions && locationsWithCoordinates.length > 0 && (
              <DirectionsService
                options={directions}
                callback={(result, status) => {
                  if (status === 'OK') {
                    setDirections(result);
                    const route = result.routes[0];
                    let totalDistance = 0;
                    let totalDuration = 0;
                    route.legs.forEach((leg) => {
                      totalDistance += leg.distance.value;
                      totalDuration += leg.duration.value;
                    });

                    const routeDistance = (totalDistance / 1000).toFixed(2) + " km";
                    const routeDuration = (totalDuration / 60).toFixed(2) + " min";
                    setRouteDistance(routeDistance);
                    setRouteDuration(routeDuration);
                  } else {
                    console.error(`Error fetching directions: ${result}`);
                  }
                }}
              />
            )}

            {directions && (
              <DirectionsRenderer
                options={{
                  directions: directions
                }}
              />
            )}
          </GoogleMap>
        </div>
      </div>
    </LoadScript>
  );
}

export default GoogleRouting;