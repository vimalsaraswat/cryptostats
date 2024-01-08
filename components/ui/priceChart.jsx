"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  TimeScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
);

const PriceChart = ({ data }) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [chartOptions, setChartOptions] = useState(null);

  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) {
      return;
    }
    const chartData = {
      labels: data.labels,
      datasets: [
        {
          label: "Token Price",
          data: data.prices,
          backgroundColor: createGradient(chart.ctx, chart.chartArea),
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          tension: 0,
          fill: true,
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
          grid: {
            display: false,
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
          grid: {
            display: false,
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
    setChartData(chartData);
    setChartOptions(chartOptions);
  }, []);

  return <Line ref={chartRef} data={chartData} options={chartOptions} />;
};

function createGradient(ctx, area) {
  const colorStart = "rgba(75, 192, 192, 0.8)";
  const colorMid = "rgba(75, 192, 192, 0.4)";
  const colorEnd = "rgb(0,0,0,0)";

  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);

  gradient.addColorStop(1, colorStart);
  gradient.addColorStop(0.5, colorMid);
  gradient.addColorStop(0, colorEnd);

  return gradient;
}

export default PriceChart;
