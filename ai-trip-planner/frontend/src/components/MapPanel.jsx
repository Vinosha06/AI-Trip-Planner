import {MapContainer,TileLayer,Marker,Popup} from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
L.Marker.prototype.options.icon=L.icon({iconUrl,shadowUrl,iconAnchor:[12,41]})
export default function MapPanel({items=[]}){const first=items[0];return <div className="min-h-[420px] overflow-hidden rounded-3xl border bg-slate-100"><MapContainer center={[first?.lat||6.92,first?.lng||80.65]} zoom={9} scrollWheelZoom className="min-h-[420px] w-full"><TileLayer attribution='&copy; OpenStreetMap contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>{items.filter(i=>i.lat&&i.lng).map((i,idx)=><Marker key={idx} position={[i.lat,i.lng]}><Popup><b>{i.title}</b><br/>{i.time} · {i.duration_min} min</Popup></Marker>)}</MapContainer></div>}
