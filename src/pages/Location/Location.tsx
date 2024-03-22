import React, { useEffect, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
} from "@ionic/react";
import { Geolocation } from "@ionic-native/geolocation";
import axios from "axios";
import "./Location.css"; // Archivo CSS para estilos personalizados

const Location: React.FC = () => {
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [locationDetails, setLocationDetails] = useState<any>({});
  const [nearbyPlaces, setNearbyPlaces] = useState<string[]>([]);

  useEffect(() => {
    Geolocation.getCurrentPosition()
      .then((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
        fetchLocationDetails(
          position.coords.latitude,
          position.coords.longitude
        );
      })
      .catch((error) => {
        console.error("Error getting location", error);
      });
  }, []);

  const fetchLocationDetails = async (lat: number, lng: number) => {
    const radius = 500; // Radio en metros
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&radius=${radius}&zoom=18`;

    try {
      const response = await axios.get(url);
      setLocationDetails(response.data.address);

      // Llama a la función para buscar lugares cercanos
      fetchNearbyPlaces(lat, lng);
    } catch (error) {
      console.error("Error fetching location details", error);
    }
  };

  const fetchNearbyPlaces = async (lat: number, lng: number) => {
    const radius = 500; // Radio en metros
    const url = `https://nominatim.openstreetmap.org/search?format=json&lat=${lat}&lon=${lng}&radius=${radius}`;

    try {
      const response = await axios.get(url);
      const places = response.data.map((place: any) => place.display_name);
      setNearbyPlaces(places);
    } catch (error) {
      console.error("Error fetching nearby places", error);
    }
  };

  const handleShareLocation = () => {
    if (latitude !== null && longitude !== null) {
      const mapLink = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}&zoom=15`;
      window.open(mapLink, "_blank");
    }
  };

  const handleSearchNearbyStores = () => {
    if (latitude !== null && longitude !== null) {
      const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=stores&query_place_id&location=${latitude},${longitude}&radius=500`;
      window.open(googleMapsLink, "_blank");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Encuentra lugares</IonTitle>
        </IonToolbar>
      </IonHeader>
      <div className="content">
        <div className="container">
          <div className="location-info">
            <p><strong>Tu ubicación:</strong></p>
            <p>Latitud: {latitude}</p>
            <p>Longitud: {longitude}</p>
            <p>País: {locationDetails?.country}</p>
            <p>Ciudad: {locationDetails?.city || locationDetails?.town}</p>
          </div>
          <IonList className="nearby-places">
            {nearbyPlaces.map((place: string, index: number) => (
              <IonItem key={index} lines="none" className="place-item">
                <IonLabel>{place}</IonLabel>
              </IonItem>
            ))}
          </IonList>
          <div className="button-container">
            <IonButton onClick={handleShareLocation} expand="block" color="secondary">
              Compartir ubicación
            </IonButton>
            <IonButton onClick={handleSearchNearbyStores} expand="block" color="tertiary">
              Buscar tiendas cercanas
            </IonButton>
          </div>
        </div>
      </div>
    </IonPage>
  );
};

export default Location;
