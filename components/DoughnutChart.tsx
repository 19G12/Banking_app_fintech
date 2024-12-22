"use client";
import { Doughnut } from "react-chartjs-2";
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js'

ChartJS.register(ArcElement,Tooltip,Legend); 

const DoughnutChart = ({accounts}:DoughnutChartProps) => {
    
    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: false,
            },
        },
        cutout: '70%',
    };
    
    const data = {
        labels: ["Bank1", "Bank2", "Bank3"],
        datasets: 
        [
            {
              label: 'Banks',
              data: [1250, 2500, 3750],
              backgroundColor: [
                "#0747b6", "#2265d8", "#2f91fa"
              ],
            },
        ]
    }
    
    return(
        <Doughnut data={data} options={options}/>
    )
}

export default DoughnutChart;