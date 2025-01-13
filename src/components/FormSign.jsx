import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function FormSign() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phonenumber, setPhoneNumber] = useState("");

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    } else if (name === "fullName") {
      setFullName(value);
    } else if (name === "phonenumber") {
      setPhoneNumber(value);
    }
  }; 

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password || !fullName || !phonenumber) {
      setError("Wszystkie pola są wymagane");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Niepoprawny email");
    } else {
      setError("");
      try {
        const response = await axios.post("https://localhost:7213/api/account/register", {
          email,
          password,
          fullName,
          phonenumber,
        });

        if (response.status === 200) {
          setError("");
          navigate("/loginpage");
        }
      } catch (error) {
        setError("Rejestracja nie powiodła się");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Rejestracja</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Label htmlFor="fullName">Imię i nazwisko</Label>
              <Input
                type="text"
                name="fullName"
                value={fullName}
                onChange={handleChange}
                placeholder="Wprowadź imię i nazwisko"
                className="mt-1 block w-full"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Wprowadź email"
                className="mt-1 block w-full"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="phonenumber">Numer Telefonu</Label> 
              <Input
                type="tel"
                name="phonenumber" 
                value={phonenumber}
                onChange={handleChange}
                placeholder="Wprowadź Numer Telefonu"
                className="mt-1 block w-full"
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="password">Hasło</Label>
              <Input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Wprowadź hasło"
                className="mt-1 block w-full"
              />
            </div>
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Zarejestruj się
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p>
            Masz już konto?{" "}
            <Link to="/loginpage" className="text-blue-500 hover:underline">
              Zaloguj się
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default FormSign;
