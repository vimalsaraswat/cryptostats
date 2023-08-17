"use client";

import "chartjs-adapter-luxon";
import {
  Chart as ChartJS,
  LineElement,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const PriceChart = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Token Price",
        data: data.prices,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        tension: 0,
      },
    ],
  };

  const chartOptions = {
    radius: 0,
    hitRadius: 40,
    scales: {
      x: {
        type: "time",
        time: {
          unit: "minute",
          tooltipFormat: "HH:mm",
        },
        title: {
          display: false,
          text: "Date",
        },
      },
      y: {
        title: {
          display: false,
          text: "Price",
        },
        ticks: {
          callback: function (value) {
            return "$" + value;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Set this to false to hide the legend
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default PriceChart;
