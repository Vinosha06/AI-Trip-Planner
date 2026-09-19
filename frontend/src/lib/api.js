const BASE=import.meta.env.VITE_API_BASE_URL||'http://localhost:8000/api'
async function request(path,options={}){const res=await fetch(`${BASE}${path}`,{headers:{'Content-Type':'application/json',...(options.headers||{})},...options});if(!res.ok)throw new Error((await res.json().catch(()=>({detail:'Request failed'}))).detail||'Request failed');return res.json()}
export const generateItinerary=profile=>request('/itinerary/generate',{method:'POST',body:JSON.stringify(profile)})
export const rerouteItinerary=body=>request('/itinerary/reroute',{method:'POST',body:JSON.stringify(body)})
export const chat=(question,destination)=>request('/chat',{method:'POST',body:JSON.stringify({question,destination})})
