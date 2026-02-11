const socket  = io();

 // check if geolocation is supported
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position) => {
        const {latitude, longitude} = position.coords ;
        socket.emit("send-location", {latitude, longitude});
    } , (error) => {
         console.log("Error getting location:", error);
    },{
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
    });
}

const map = L.map("map").setView([0,0] , 15 );
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
 attribution: "openstreastmap"
}).addTo(map);

const markers = {};

socket.on("recive-location" , (data) => {
  const {id , latitude , longitude} = data ;
  map.setView([latitude, longitude]);
  if(markers[id]){
    markers[id].setLatLng([latitude, longitude]);
  }else{
    markers[id] = L.marker([latitude, longitude]).addTo(map);
  }
});

socket.on("user-disconnected" , (id) => {
  if(markers[id]){
    map.removeLayer(markers[id]);
    delete markers[id];
  }
});