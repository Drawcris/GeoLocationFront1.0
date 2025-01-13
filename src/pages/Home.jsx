import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Link, useLocation } from 'react-router-dom';

function Home() {
  const location = useLocation();
  const message = location.state?.message;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="container mx-auto p-4 text-center">
        <img src="Koala.jpg" alt="Logo" className="mx-auto mb-6 w-32 h-32 rounded-2xl" />
        <h1 className="text-4xl font-bold mb-4">Witamy w Koala Express!</h1>
        <p className="text-lg text-gray-700 mb-8">Twoje ulubione miejsce do zarządzania trasami i użytkownikami.</p>
        {message && <div className="text-red-500 mb-4">{message}</div>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link to="/routingPage">
            <Card className="w-full h-full text-center hover:bg-gray-200 transition duration-300 shadow-lg">
              <CardHeader>
                <i className="bi bi-sign-turn-right-fill text-4xl mb-2"></i>
                <CardTitle>Trasa</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Przeglądaj dostępne trasy.</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/profilePage">
            <Card className="w-full h-full text-center hover:bg-gray-200 transition duration-300 shadow-lg">
              <CardHeader>
                <i className="bi bi-person-circle text-4xl mb-2"></i>
                <CardTitle>Profil</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Przeglądaj swój profil.</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/creatorPage">
            <Card className="w-full h-full text-center hover:bg-gray-200 transition duration-300 shadow-lg">
              <CardHeader>
                <i className="bi bi-person-fill text-4xl mb-2"></i>
                <CardTitle>Twórca</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Informacje o twórcy.</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/logout" onClick={() => {
            localStorage.removeItem('accessToken');
            window.location.href = '/loginpage';
          }}>
            <Card className="w-full h-full text-center hover:bg-gray-200 transition duration-300 shadow-lg">
              <CardHeader>
                <i className="bi bi-box-arrow-right text-4xl mb-2"></i>
                <CardTitle>Wyloguj</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Wyloguj się z konta.</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/addRoute">
            <Card className="w-full h-full text-center hover:bg-gray-200 transition duration-300 shadow-lg">
              <CardHeader>
                <i className="bi bi-geo-alt-fill text-4xl mb-2"></i>
                <CardTitle>Lista tras</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Wyświetl istniejące lub dodaj nową trasę.</p>
                <p className='text-red-500'>Tylko dla administratorów</p>
              </CardContent>
            </Card>
          </Link>
          <Link to="/userPage">
            <Card className="w-full h-full text-center hover:bg-gray-200 transition duration-300 shadow-lg">
              <CardHeader>
                <i className="bi bi-people-fill text-4xl mb-2"></i>
                <CardTitle>Użytkownicy</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Zarządzaj użytkownikami.</p>
                <p className='text-red-500'>Tylko dla administratorów</p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;