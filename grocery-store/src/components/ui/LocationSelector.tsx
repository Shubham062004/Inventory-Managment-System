
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
// import { Map, MapPin, Search, X } from 'lucide-react';
import { MapPin, Search, X } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbHYyc2EwZnQwMTBtMmxudjRtN3NnYWJlIn0.a_wHqgYr4ok3gFR5ygBK8g';

interface LocationSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation: (location: string) => void;
}

interface PopularLocation {
  id: number;
  name: string;
  coordinates: [number, number]; // Explicitly typed as tuple
}

const popularLocations: PopularLocation[] = [
  { id: 1, name: 'Sector 12, Dwarka', coordinates: [77.0421, 28.5921] },
  { id: 2, name: 'Mayur Vihar', coordinates: [77.2921, 28.6091] },
  { id: 3, name: 'Saket', coordinates: [77.2177, 28.5244] },
  { id: 4, name: 'Vasant Kunj', coordinates: [77.1499, 28.5401] },
  { id: 5, name: 'Janakpuri', coordinates: [77.0833, 28.6283] },
  { id: 6, name: 'Laxmi Nagar', coordinates: [77.2759, 28.6362] },
  { id: 7, name: 'Rohini', coordinates: [77.1152, 28.7386] },
  { id: 8, name: 'Pitampura', coordinates: [77.1340, 28.6917] },
];

const LocationSelector: React.FC<LocationSelectorProps> = ({ isOpen, onClose, onSelectLocation }) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [customLocation, setCustomLocation] = useState('');
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markerRef = useRef<mapboxgl.Marker | null>(null);
  
  // Filter locations based on search query
  const filteredLocations = popularLocations.filter(location => 
    location.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Initialize map when component mounts
  useEffect(() => {
    if (isOpen && mapContainerRef.current && !mapRef.current) {
      // Initialize map
      const map = new mapboxgl.Map({
        container: mapContainerRef.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [77.2090, 28.6139], // Delhi coordinates
        zoom: 10
      });
      
      mapRef.current = map;
      
      // Create a default marker
      const marker = new mapboxgl.Marker({
        color: "#0EA75A"
      })
        .setLngLat([77.2090, 28.6139])
        .addTo(map);
      
      markerRef.current = marker;
      
      // Add click event to map
      map.on('click', (e) => {
        const { lng, lat } = e.lngLat;
        
        // Update marker position
        if (markerRef.current) {
          markerRef.current.setLngLat([lng, lat]);
        }
        
        // Get location name from coordinates (in a real app, you'd use reverse geocoding)
        setCustomLocation(`Location at ${lng.toFixed(4)}, ${lat.toFixed(4)}`);
        setSelectedLocation(null);
      });
      
      // Clean up on unmount
      return () => {
        map.remove();
        mapRef.current = null;
      };
    }
  }, [isOpen]);
  
  // When a location is selected
  const handleSelectLocation = (locationName: string, coordinates?: [number, number]) => {
    setSelectedLocation(locationName);
    setCustomLocation('');
    
    // If coordinates are provided, update the marker and center the map
    if (coordinates && mapRef.current && markerRef.current) {
      markerRef.current.setLngLat(coordinates);
      mapRef.current.flyTo({ center: coordinates, zoom: 13 });
    }
  };
  
  // When submitting the form
  const handleSubmit = () => {
    const location = selectedLocation || customLocation;
    if (location) {
      onSelectLocation(location);
      toast.success(`Your delivery location is now set to ${location}.`);
      onClose();
    } else {
      toast.error("Please select or enter a delivery location.");
    }
  };
  
  
  const clearSearch = () => {
    setSearchQuery('');
  };

  const content = (
    <>
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search for your locality..."
            className="pl-10 pr-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button 
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              onClick={clearSearch}
            >
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className="border rounded-lg overflow-hidden h-60">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>
        
        <div>
          <Label>Popular Locations</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {filteredLocations.map((location) => (
              <Button
                key={location.id}
                variant="outline"
                className={`justify-start ${selectedLocation === location.name ? 'border-primary text-primary' : ''}`}
                onClick={() => handleSelectLocation(location.name, location.coordinates)}
              >
                <MapPin className="mr-2 h-4 w-4" />
                {location.name}
              </Button>
            ))}
          </div>
        </div>
        
        {customLocation && (
          <div>
            <Label>Selected Custom Location</Label>
            <div className="border rounded-md p-3 mt-2 bg-muted/20">
              <div className="flex items-center">
                <MapPin className="mr-2 h-4 w-4 text-primary" />
                {customLocation}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );

  return isMobile ? (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Select Delivery Location</SheetTitle>
          <SheetDescription>
            Choose your delivery location to see product availability
          </SheetDescription>
        </SheetHeader>
        
        {content}
        
        <SheetFooter className="mt-4">
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
          <Button onClick={handleSubmit}>Confirm Location</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ) : (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Delivery Location</DialogTitle>
          <DialogDescription>
            Choose your delivery location to see product availability
          </DialogDescription>
        </DialogHeader>
        
        {content}
        
        <DialogFooter className="gap-2 mt-4">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Confirm Location</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default LocationSelector;