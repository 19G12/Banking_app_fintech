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
    
    const accountNames = accounts.map((val) => val.name);
    const balances = accounts.map((val) => val.currentBalance.toString());
    
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
        labels: accountNames,
        datasets: 
        [
            {
              label: 'Banks',
              data: balances,
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