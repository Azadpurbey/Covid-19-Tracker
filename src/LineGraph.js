import React,{useEffect, useState} from 'react'
import {Line} from "react-chartjs-2";
import numeral from "numeral";
import { rgbToHex } from '@material-ui/core';

const options = {
    legend:{
        display: false,
    },
    elements:{
        points:{
            radius:0,
        },
    },
    maintainAspectRatio: false,

    scales: {
        xAxes: [{
            type:'time',
            time:{
                format:"MM/DD/YY",
                tooltipFormat: "ll",
            },
        }],
        yAxes: [{
            gridLines:{
                display:false,
            },
            ticks: {
                callback: function (value,index,values){
                    return numeral(value).format("0a");
                },
            },
        }],
    }  
}

function LineGraph({casesType='cases'}) {
    const [data, setData] =useState({});

    const buildCharData = (data ,casesType)=>{
        const chartData = [];
        let lastDataPoint;
        for(let date in data[casesType]){
            if(lastDataPoint){
                const newDataPoint = {
                    x:date,
                    y: data[casesType][date]-lastDataPoint
                }
                chartData.push(newDataPoint)
            }
            lastDataPoint=data[casesType][date];
        }
        return chartData;
    }
    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=120')
        .then(response=>response.json())
        .then(data =>{
            const charData = buildCharData(data,casesType);
            setData(charData);
        
        })
        
    }, [])

     
    return (
        <div>
            {data?.length >0 && (
                <Line 
                    options={options}
                    data={{
                        datasets: [{
                            backgroundColor:"rgb(204,16,52,0.5)",
                            borderColor:"#CC1034",
                            data:data,
                        }]
                    }}
                    
                />
            )}
            
        </div>
    )
}

export default LineGraph
