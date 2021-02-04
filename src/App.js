import React, {useState, useEffect} from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import './App.css';
import Infobox from './Infobox';
import Map from "./Map";
import Table from './Table';
import LineGraph from './LineGraph';
import  { sortData, showDataOnMap } from './util';
import "leaflet/dist/leaflet.css";


function App() {
  const [countries,setCountries]= useState([]);
  const [country,setCountry]= useState("worldwide");
  const [countryInfo,setCountryInfo]= useState({});
  const [tableData,setTableData]= useState([]);
  const [mapCenter,setMapCenter]= useState({lat:34.80746,lng: -40.4796});
  const [mapZoom,setMapZoom]= useState(3);
  const [mapCountries,setMapCountries]= useState([]);


  useEffect(()=>{
    fetch('https://disease.sh/v3/covid-19/all')
    .then(response=> response.json())
    .then((data)=>{
      setCountryInfo(data);
      
    })
    
  },[]);

  useEffect(()=>{
    const getCountriesData = async () =>{
      await fetch('https://disease.sh/v3/covid-19/countries')
      .then((response)=>response.json())
      .then((data)=>{
        const countries = data.map((country) =>(
          {
            name: country.country,
            value:country.countryInfo.iso2,
          }
        ));
        
        setTableData(sortData(data));
        setMapCountries(data)
        setCountries(countries)
        // console.log(data)
      });
    };
    getCountriesData();

  },[countries]);

  const onCountryChange = async (event)=>{
    const countryCode = event.target.value;

    const url = countryCode ==="worldwide"
      ? "https://disease.sh/v3/covid-19/all"
      :`https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
    .then(response =>response.json())
    .then (data =>{
      setCountry(countryCode);
      setCountryInfo(data);
      

      setMapCenter([data.countryInfo.lat, data.countryInfo.long])
      setMapZoom(4);
    })

      

  }

  //console.log("country Info >>>",countryInfo);

  return (
    <div className="app">
      <div className='app__left'>
        <div className='app__header'>
          <h1>I am covid-19 Trackor</h1>
          <FormControl className='app__dropdown'>
            <Select variant='outlined' 
              onChange={onCountryChange} 
              value={country}>
              <MenuItem value="worldwide">{country}</MenuItem>
              {countries.map((country)=>
                (<MenuItem value={country.value}>{country.name}</MenuItem>)
              )}
              
            </Select>
          </FormControl> 
        </div>

        <div className='app__stats'>
          <Infobox title='Coronavirus Cases' cases={countryInfo.todayCases} total={countryInfo.cases}/>
          <Infobox title='Recovered' cases={countryInfo.todayRecovered} total={countryInfo.recovered}/>
          <Infobox title='Deaths' cases={countryInfo.todayDeaths} total={countryInfo.deaths}/>
        </div>

        <Map
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
          casesType="cases"
        />

      </div>

      <Card className='app__right'>
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}/>
          <h3>World Wide New cases</h3>
          <LineGraph />

        </CardContent>

      </Card>

    </div>
  );
}

export default App;

