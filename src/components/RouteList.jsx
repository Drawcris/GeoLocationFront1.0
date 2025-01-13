import React, { useEffect, useState } from 'react'; 
import axiosInstance from "../axiosInstance";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

function RouteList() {
  const [routes, setRoutes] = useState([]);
  const [users, setUsers] = useState([]);
  const [newRoute, setNewRoute] = useState({
    driverId: '',
    driverEmail: '',
    name: '',
    status: 'Nowa',
    date: new Date().toISOString(),
    locations: []
  });
  const [newLocations, setNewLocations] = useState([{ address: '', city: '', zipCode: '' }]);
  const [error, setError] = useState('');

  useEffect(() => {
    axiosInstance.get('/api/Routes')
      .then(response => {
        setRoutes(response.data);
      })
      .catch(error => console.error('Error fetching routes:', error));

    axiosInstance.get('/api/Account/users')
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  const handleDeleteRoute = (routeId) => {
    axiosInstance.delete(`/api/Routes/${routeId}`)
      .then(() => {
        axiosInstance.get('/api/Routes')
          .then(response => setRoutes(response.data))
          .catch(error => console.error('Error fetching updated routes:', error));
      })
      .catch(error => {
        console.error('Nie udało się usunąć trasy:', error);
        alert('Nie udało się usunąć trasy');
      });
  };

  const handleAddRoute = () => {
    if (!newRoute.driverId || !newRoute.name.trim()) {
      setError('Wybór użytkownika i nazwa trasy są wymagane.');
      return;
    }

    setError(''); 

    const routeToAdd = { ...newRoute, locations: newLocations };
    axiosInstance.post('/api/Routes', routeToAdd)
      .then(() => {
        axiosInstance.get('/api/Routes')
          .then(response => setRoutes(response.data))
          .catch(error => console.error('Error fetching updated routes:', error));
      })
      .catch(error => {
        console.error('Nie udało się dodać trasy:', error);
        alert('Nie udało się dodać trasy');
      });
  };

  const handleAddLocation = () => {
    if (newLocations.length < 6) {
      setNewLocations([...newLocations, { address: '', city: '', zipCode: '' }]);
    }
  };

  const handleLocationChange = (index, field, value) => {
    const updatedLocations = newLocations.map((location, i) => (
      i === index ? { ...location, [field]: value } : location
    ));
    setNewLocations(updatedLocations);
  };

  return (
    <div className="min-h-screen bg-gray-100 ">
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-4">Trasy</h2>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4 bg-blue-500 hover:bg-blue-800">Dodaj Trasę</Button>
        </DialogTrigger>
        <DialogContent>
          <VisuallyHidden>
            <DialogTitle>Dodaj Trase</DialogTitle>
          </VisuallyHidden>
          <DialogHeader>
            <h3 className="text-lg font-semibold">Dodaj Trasę</h3>
            <p className='text-sm text-red-500'>Dodawaj adresy w kolejności, w której powinny zostać odwiedzone</p>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            <div className="space-y-4">
              <div>
                <Select onValueChange={(value) => {
                  const user = users.find((user) => user.id.toString() === value);
                  setNewRoute({ ...newRoute, driverId: user.id, driverEmail: user.email });
                }}>
                  <SelectTrigger className="mb-4">
                    <SelectValue placeholder="Wybierz użytkownika" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id.toString()}>
                        {user.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Input
                  type="text"
                  value={newRoute.name}
                  onChange={(e) => setNewRoute({ ...newRoute, name: e.target.value })}
                  placeholder="Nazwa trasy"
                  className="w-full"
                />
              </div>
              {newLocations.map((location, index) => (
                <div key={index} className="space-y-1">
                  <Input
                    type="text"
                    value={location.address}
                    onChange={(e) => handleLocationChange(index, 'address', e.target.value)}
                    placeholder="Adres"
                    className="w-full"
                  />
                  <Input
                    type="text"
                    value={location.city}
                    onChange={(e) => handleLocationChange(index, 'city', e.target.value)}
                    placeholder="Miasto"
                    className="w-full"
                  />
                  <Input
                    type="text"
                    value={location.zipCode}
                    onChange={(e) => handleLocationChange(index, 'zipCode', e.target.value)}
                    placeholder="Kod pocztowy"
                    className="w-full"
                  />
                </div>
              ))}
              {newLocations.length < 6 && (
                <Button className="mt-2" onClick={handleAddLocation}>Dodaj kolejną lokalizację</Button>
              )}
            </div>
          </ScrollArea>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <DialogFooter>
            <Button className="bg-blue-500 hover:bg-blue-800" onClick={handleAddRoute}>Dodaj</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Table className="w-full bg-white shadow-md rounded-lg">
        <TableHeader>
          <TableRow>
            <TableHead className="text-left">Nazwa trasy</TableHead>
            <TableHead className="text-left">Email kierowcy</TableHead>
            <TableHead className="text-left">Status</TableHead>
            <TableHead className="text-left">Data</TableHead>
            <TableHead className="text-left">Lokalizacje</TableHead>
            <TableHead className="text-center">Akcje</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {routes.map(route => (
            <TableRow key={route.id}>
              <TableCell>{route.name}</TableCell>
              <TableCell>{route.driverEmail}</TableCell>
              <TableCell>{route.status}</TableCell>
              <TableCell>{new Date(route.date).toLocaleDateString()}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="mt-2 ml-2 hover:bg-blue-500 hover:text-white">
                      Szczegóły
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <h3 className="text-lg font-semibold">Szczegóły lokalizacji</h3>
                    </DialogHeader>
                    <ScrollArea className="max-h-96">
                      <div className="space-y-4">
                        {route.locations.map((location, index) => (
                          <div key={index}>
                            <p><b>Adres:</b> {location.address || "brak"}</p>
                            <p><b>Miasto:</b> {location.city || "brak"}</p>
                            <p><b>Kod Pocztowy:</b> {location.zipCode || "brak"}</p>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <DialogFooter>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </TableCell>
              <TableCell className="text-center">
                <Button variant="outline" color="red" onClick={() => handleDeleteRoute(route.id)} className="mt-2 ml-2 hover:bg-red-500 hover:text-white">
                  Usuń
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    </div>
  );
}

export default RouteList;
