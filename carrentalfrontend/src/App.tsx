import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { render } from '@testing-library/react';

function App() {
  const [data, setData] = useState<any[]>([] as any);
  const [responseMessage, setResponseMessage] = useState('');


  useEffect(() => { fetchData() }, [])
  useEffect(() => { console.log(data) }, [data])

  async function fetchData() {
    const response = await fetch('http://localhost:3000/api/cars')
    const responseJson = await response.json()
    await setData(responseJson)
  }

  async function rentCar(id: number){
    const response = await fetch(`http://localhost:3000/api/cars/${id}/rent`, {method: 'POST'})
    const responseJson = await response.json();
    console.log(responseJson)
    if(responseJson.statusCode == 409){
      setResponseMessage('Az autó már ki van kölcsönözve')
    }
    if(responseJson.statusCode == 404){
      setResponseMessage('Nincs ilyen autó')
    }
    if(responseJson.statusCode == null){
      setResponseMessage('Sikeres kölcsönzés')
    }
  }

  function loadCards() {
    let cards = []
    for (let i = 0; i < data.length; i++) {
      cards.push(
        <div className="card col-xl-4 col-lg-4 col-md-6 col-sm-12 col-xs-12">
          <div className="card-body">
            <h1 className="card-title">{data[i].license_plate_number}</h1>
            <p className='card-text'>Márka: {data[i].brand} <br /> Modell: {data[i].model} <br /> Napidíj: {data[i].daily_cost} Ft</p>
            <img id="card-img" src={"assets/" + data[i].brand.toLowerCase() + "_" + data[i].model.toLowerCase() + ".png"} alt="" />
            {/* <button onClick={()=>{addMember(members[i].id)}}>Tagdíj fizetés</button> */}
            <button onClick={()=>{rentCar(data[i].id)}}> Kölcsönzés </button>
          </div>
        </div>
      )
    }
    return cards
  }

  return (
    <div className='container'>
      <header>
        <h1>Petrik autókölcsönző</h1>
        <a href="">Új autó felvétele</a>
        <span> </span>
        <a href="petrik.hu">Petrik honlap</a>
        <p>{responseMessage}</p>
      </header>

      <div className="row">
          {loadCards()}
      </div>

      <footer>készítette: én</footer>
    </div>
  )
}

export default App;
