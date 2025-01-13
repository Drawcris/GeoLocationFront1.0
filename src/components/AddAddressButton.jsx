import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function AddAddressButton({ fetchAddresses }) {
  const [newAddress, setNewAddress] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newZipCode, setNewZipCode] = useState("");

  const handleAddAddress = async () => {
    try {
      await axios.post("https://localhost:7213/api/Adresses", {
        address: newAddress,
        city: newCity,
        zipCode: newZipCode,
      });
      setNewAddress("");
      setNewCity("");
      setNewZipCode("");
      fetchAddresses(); 
    } catch (error) {
      console.error("Error adding address:", error);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger className="bg-blue-500 hover:bg-blue-800 text-white" asChild>
          <Button variant="outline">Dodaj adres </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Dodaj nowy adres</DialogTitle>
            <DialogDescription>Wprowadź szczegóły nowego adresu</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="address" className="text-right">Adres</Label>
              <Input
                id="address"
                value={newAddress}
                onChange={(e) => setNewAddress(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="city" className="text-right">Miasto</Label>
              <Input
                id="city"
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="zipCode" className="text-right">Kod pocztowy</Label>
              <Input
                id="zipCode"
                value={newZipCode}
                onChange={(e) => setNewZipCode(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button className="bg-blue-500 hover:bg-blue-800" type="submit" onClick={handleAddAddress}>Dodaj adres  <i className="bi bi-plus-circle-fill"></i></Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AddAddressButton;
