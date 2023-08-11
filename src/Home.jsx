import React, { useEffect, useState } from "react";
import clear from "../src/images/clear.png";
import humidity from "../src/images/humidity.png";
import wind from "../src/images/wind.png";
import rain from "../src/images/rain.png";
import drizzle from "../src/images/drizzle.png";
import mist from "../src/images/mist.png";
import cloud from "../src/images/cloud.png";
import axios from "axios";

const Home = () => {
  const [data, setData] = useState({
    celcius: 10,
    name: "Mumbai",
    humidity: 95,
    speed: 2,
    image: cloud,
  });



  
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(()=>{
    function onlineHandler(){
      setIsOnline(true);
    }
    function offlineHandler(){
      setIsOnline(false);
    }
    window.addEventListener("online", onlineHandler);
    window.addEventListener("offline", offlineHandler);
  })





  const handleClick = () => {
    if (name !== "") {
      const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${name}&appid=b1329d776939ddf5ad5ff41d01befdf7&&units=metric`;
      axios
        .get(apiUrl)
        .then((res) => {
          console.log(res);
          let imagePath = "";

          if (res.data.weather[0].main == "Clouds") {
            imagePath = clear;
          } else if (res.data.weather[0].main == "Rain") {
            imagePath = rain;
          } else if (res.data.weather[0].main == "Drizzle") {
            imagePath = drizzle;
          } else if (res.data.weather[0].main == "Mist") {
            imagePath = mist;
          } else {
            imagePath = cloud;
          }

          setData({
            ...data,
            celcius: res.data.main.temp,
            name: res.data.name,
            humidity: res.data.main.humidity,
            speed: res.data.wind.speed,
            image: imagePath,
          });
        })
        .catch((err) => {
          if (err.response.status == 404) {
            setError("Invalid City Name!!!");
          } else {
            setError("");
          }
          console.log(err);
        });
    }
  };


  return (
    <div className="container">
      {isOnline?(
      <div className="weather">
        
        <div className="search">
          <input
            type="text"
            placeholder="Enter city name..."
            onChange={(e) => setName(e.target.value)}
          />
          <button className="button" onClick={handleClick}>
            search
          </button>
        </div>
        <div className="error">{error}</div>
        <div className="info">
          <img src={data.image} alt="" />
          <h1>
            {Math.round(data.celcius)}
            <sup>o</sup>C
          </h1>
          <h2 className="city">{data.name}</h2>
        </div>
        <div className="details">
          <div className="col">
            <img src={wind} alt="" />
            <div className="data">
              <div>{data.speed}km/h</div>
              <div>Wind</div>
            </div>
          </div>
          <div className="col">
            <img src={humidity} alt="" />
            <div className="data">
              <div className="humidityData">{Math.round(data.humidity)}%</div>
              <div className="humidityWord">Humidity</div>
            </div>
            
          </div>
        </div>
        
      
      </div>
      ):(<h2>Oops! Your internet is not connected!!!</h2>)}
    </div>
  );
};

export default Home;
