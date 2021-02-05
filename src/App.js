import React, { useState, useEffect } from 'react';
import { MenuItem, FormControl, Select, Card, CardContent } from '@material-ui/core';
import './App.css';
import InfoBox from './InfoBox';
import Map from "./Map";
import Table from './Table';
import LineGraph from './LineGraph';
import { sortData, prettyPrintStat } from './util';
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";


function App() {
  const [countries, setCountries] = useState([]);
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 20, lng: 77 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  const casesTypeColors = {
    cases: {
      hex: "#CC1034",
      rgb: "rgb(204, 16, 52)",
      half_op: "rgba(204, 16, 52, 0.5)",
      multiplier: 200,
      color: "pink"
    },
    recovered: {
      hex: "#7dd71d",
      rgb: "rgb(125, 215, 29)",
      half_op: "rgba(125, 215, 29, 0.5)",
      multiplier: 300,
      color: "green"
    },
    deaths: {
      hex: "#fb4443",
      rgb: "rgb(251, 68, 67)",
      half_op: "rgba(251, 68, 67, 0.5)",
      multiplier: 500,
      color: "red"
    },
  }

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then(response => response.json())
      .then((data) => {
        setCountryInfo(data);

      })

  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch('https://disease.sh/v3/covid-19/countries')
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2,
            }
          ));

          setTableData(sortData(data));
          setMapCountries(data)
          setCountries(countries)
          // console.log(data)
        });
    };
    getCountriesData();

  }, []);


  const onCountryChange = async (event) => {

    const countryCode = event.target.value;

    const url = countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then(response => response.json())
      .then(data => {
        setInputCountry(countryCode);
        setCountryInfo(data);
        setMapCenter({ lat: data.countryInfo.lat, lng: data.countryInfo.long });
        setMapZoom(4);
        console.log(data.countryInfo.lat, data.countryInfo.long);
      })



  }

  const showDataOnMap = (data, casesType) => {
    // console.log(casesType);
    console.log(casesTypeColors[casesType].color);
    return data.map(country =>
      <Circle
        center={[country.countryInfo.lat, country.countryInfo.long]}
        fillOpacity={0.4}

        color={casesTypeColors[casesType].color}
        fillColor={casesTypeColors[casesType].hex}
        radius={
          Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
        }
      >
        <Popup>
          <div className='info-container'>
            <div className="info-flag"
              style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
            />
            <div className="info-name">
              {country.country}
            </div>

            <div className="info-confirmed">
              Cases: {numeral(country.cases).format("0,0")}
            </div>

            <div className="info-recovered">
              Recovered: {numeral(country.recovered).format("0,0")}
            </div>

            <div className="info-deaths">
              Deaths: {numeral(country.deaths).format("0,0")}
            </div>

          </div>
        </Popup>
      </Circle>
    );
  }

  //console.log("country Info >>>",countryInfo);

  return (
    <div className="app">
      <div className='app__left'>
        <div className='app__header'>
          <h1>COVID-19 Tracker</h1>
          <FormControl className='app__dropdown'>
            <Select variant='outlined'
              onChange={onCountryChange}
              value={country}>
              <MenuItem value="worldwide">worldwide</MenuItem>
              {countries.map((country) =>
                (<MenuItem value={country.value}>{country.name}</MenuItem>)
              )}

            </Select>
          </FormControl>
        </div>

        <div className='app__stats'>
          <InfoBox
            isRed={true}
            active={casesType === "cases"}
            onClick={e => setCasesType('cases')}
            title='Coronavirus Cases'
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            isRed={false}
            active={casesType === "recovered"}
            onClick={e => setCasesType('recovered')}
            title='Recovered'
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            isRed={true}
            active={casesType === "deaths"}
            onClick={e => setCasesType('deaths')}
            title='Deaths'
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />

        </div>

        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
          showDataOnMap={() => showDataOnMap(mapCountries, casesType)}
          
        >
          {console.log("clicked map")}
      
        </Map>  

      </div>

      <Card className='app__right'>
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} />
            <h3 className="app__graphTitle">Worldwide new {casesType}</h3>
            <LineGraph className="app__graph" casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;

