import React, { useState, useEffect } from 'react';
import axiosInstance from '@/axiosInstance'; 
import { Dialog, DialogTrigger, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext'; 
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';

function ProfileInfo() {
  const { user } = useAuth(); 
  const [userData, setUserData] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [routes, setRoutes] = useState([]);

  useEffect(() => {
    if (user && user.email) {
      axiosInstance.get(`/api/Account/users/email/${encodeURIComponent(user.email)}`)
        .then(response => {
          setUserData(response.data);
        })
        .catch(error => {
          console.error('Error fetching user data:', error);
        });

      axiosInstance.get(`/api/Routes?driverEmail=${encodeURIComponent(user.email)}`)
        .then(response => {
          setRoutes(response.data);
        })
        .catch(error => {
          console.error('Error fetching routes:', error);
        });
    }
  }, [user]);

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      setError("Hasła się nie zgadzają!");
      return;
    }

    const payload = {
      currentPassword,
      newPassword
    };

    axiosInstance.put(`/api/Account/users/change-password`, payload)
      .then(() => {
        setError('');
        setOpenDialog(false);
        alert('Hasło zostało zmienione');
      })
      .catch(error => {
        console.error('Error changing password:', error);
        setError('Błąd podczas zmiany hasła');
      });
  };

  if (!userData) {
    return <div className="flex justify-center items-center h-screen">Ładowanie...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Profil użytkownika</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p><strong>Email:</strong> {userData.email}</p>
            <p><strong>Imię:</strong> {userData.fullName}</p>
          </div>
          <Button className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => setOpenDialog(true)}>
            Zmień hasło
          </Button>
        </CardContent>
      </Card>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Zmień hasło</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Aktualne hasło"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full"
            />
            <Input
              type="password"
              placeholder="Nowe hasło"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full"
            />
            <Input
              type="password"
              placeholder="Potwierdź nowe hasło"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full"
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpenDialog(false)}>
              Anuluj
            </Button>
            <Button className="bg-blue-500" onClick={handleChangePassword}>
              Zmień hasło
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default ProfileInfo;