"use client";

import { currencyFormat } from "@/helpers";
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
          tooltipFormat: "t",
        },
        ticks: { display: false },
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
        position: "right",
        ticks: {
          callback: currencyFormat,
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Set this to false to hide the legend
      },
      tooltip: {
        yAlign: "bottom",
        displayColors: false,
        callbacks: {
          label: function (context) {
            let label = "";

            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              label += currencyFormat(context.parsed.y);
            }
            return label;
          },
        },
      },
    },
  };

  return <Line data={chartData} options={chartOptions} />;
};

export default PriceChart;
