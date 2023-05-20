import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { render } from '@testing-library/react';

function App() {
  const [data, setData] = useState<any[]>([] as any);
  const [responseMessage, setResponseMessage] = useState('');

  const [licenseplate, setLicensePlate] = useState('')
  const [brandname, setBrand] = useState('')
  const [modelname, setModel] = useState('')
  const [dailycost, setDailyCost] = useState(0)
  const [errorMessage, setErrorMessage] = useState<any[]>([] as any);


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
            <button onClick={()=>{rentCar(data[i].id)}}> Kölcsönzés </button>
          </div>
        </div>
      )
    }
    return cards
  }

  async function addCar(){
    const request = {
      license_plate_number: licenseplate,
      brand: brandname,
      model: modelname,
      daily_cost: dailycost
    }

    const response = await fetch('http://localhost:3000/api/cars', {
      method: 'POST',
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(request)
    })
      
    const responseJson = await response.json()
    if(responseJson.statusCode = 400){
      setErrorMessage(responseJson.message)
    }
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

          <label>Rendszám:</label>
          <input type="text" maxLength={20} onChange={(e)=>{setLicensePlate(e.target.value);  console.log(e.target.value)}} />
          <br />
          <label>Gyártó:</label>
          <input type="text" maxLength={255} onChange={(e)=>{setBrand(e.target.value); console.log(e.target.value)}} />
          <br />
          <label>Modell:</label>
          <input type="text" maxLength={255} onChange={(e)=>{setModel(e.target.value); console.log(e.target.value)}} />
          <br />
          <label>Napidíj:</label>
          <input type="number" min={1} onChange={(e)=>{setDailyCost(parseInt(e.target.value)); console.log(e.target.value)}} />

          <button onClick={()=>{addCar()}}>Felvétel</button>
          <br />
          {errorMessage.map(x => <p>{x}</p> )}
      <footer>készítette: én</footer>
    </div>
  )
}

export default App;
