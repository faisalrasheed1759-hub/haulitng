const trucks = [
  {
    id: "TRK-001",
    plate: "PHC-123XY",
    driver: "Chidi Okonkwo",
    phone: "+2348031234567",
    status: "delivering",
    currentLat: 4.8156,
    currentLng: 7.0498,
    lastUpdate: new Date().toISOString(),
  },
  {
    id: "TRK-002",
    plate: "RVR-789AB",
    driver: "Emeka Nwosu",
    phone: "+2348067890123",
    status: "loading",
    currentLat: 4.8354,
    currentLng: 7.0512,
    lastUpdate: new Date().toISOString(),
  },
  {
    id: "TRK-003",
    plate: "ABJ-456CD",
    driver: "Musa Ibrahim",
    phone: "+2348094567890",
    status: "available",
    currentLat: 4.7982,
    currentLng: 7.0128,
    lastUpdate: new Date().toISOString(),
  },
];

const trips = [];

const customers = [];

const tripsCounter = { value: 0 };

export function getTrucks() {
  return trucks;
}

export function getTruck(id) {
  return trucks.find((t) => t.id === id);
}

export function updateTruckLocation(id, lat, lng) {
  const truck = trucks.find((t) => t.id === id);
  if (!truck) return null;
  truck.currentLat = lat;
  truck.currentLng = lng;
  truck.lastUpdate = new Date().toISOString();
  return truck;
}

export function updateTruckStatus(id, status) {
  const truck = trucks.find((t) => t.id === id);
  if (!truck) return null;
  truck.status = status;
  truck.lastUpdate = new Date().toISOString();
  return truck;
}

export function createTrip(truckId, customerName, destination, estimatedDelivery) {
  tripsCounter.value += 1;
  const trip = {
    id: `TRIP-${String(tripsCounter.value).padStart(3, "0")}`,
    truckId,
    customerName,
    destination,
    estimatedDelivery,
    status: "active",
    createdAt: new Date().toISOString(),
    checkins: [],
  };
  trips.push(trip);
  const truck = trucks.find((t) => t.id === truckId);
  if (truck) truck.status = "delivering";
  return trip;
}

export function getTrips() {
  return trips;
}

export function getTrip(id) {
  return trips.find((t) => t.id === id);
}

export function addCheckin(tripId, lat, lng, photo, note) {
  const trip = trips.find((t) => t.id === tripId);
  if (!trip) return null;
  const checkin = {
    id: `CHK-${Date.now()}`,
    tripId,
    lat,
    lng,
    photo: photo || null,
    note: note || "",
    timestamp: new Date().toISOString(),
  };
  trip.checkins.push(checkin);
  return checkin;
}

export function getCustomerTrips(phone) {
  return trips.filter((t) => {
    const cust = customers.find((c) => c.phone === phone);
    return cust && t.customerName === cust.name;
  });
}

export function addCustomer(name, phone, address) {
  customers.push({ name, phone, address, createdAt: new Date().toISOString() });
}
