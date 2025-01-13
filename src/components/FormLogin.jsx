import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { decodeJwt } from 'jose';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';


function FormLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Wszystkie pola są wymagane");
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Niepoprawny email");
    } else {
      setError("");
      try {
        const response = await axios.post("https://localhost:7213/api/account/login", {
          email,
          password
        });

        if (response.status === 200) {
          const { token } = response.data;

          localStorage.setItem("accessToken", token);
          const decodedToken = decodeJwt(token);
          const roles = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];

          const user = { email, token, roles: Array.isArray(roles) ? roles : [roles] };
          setUser(user);

          setError("");
          console.log(user);
          navigate("/");
        }
      } catch (error) {
        setError("Niepoprawne dane logowania");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Logowanie</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
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
            <Button type="submit" className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Zaloguj się
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-center">
          <p>Nie masz konta? <Link to="/signpage" className="text-blue-500 hover:underline">Zarejestruj się</Link></p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default FormLogin;