import { useMemo, useRef } from "react";
import * as d3 from "d3";
import styles from "./d.css";

const data = [
    { name: "A", value: 100 },
    { name: "B", value: 200 },
    { name: "C", value: 300 },
    { name: "D", value: 400 },
];

const width = 500;
const height = 500;


const MARGIN_X = 150;
const MARGIN_Y = 50;
const INFLEXION_PADDING = 20; // space between donut and label inflexion point

const colors = [
  "#e0ac2b",
  "#e85252",
  "#6689c6",
  "#9a6fb0",
  "#a53253",
  "#69b3a2",
];

const DonutChart = () => {
  const ref = useRef(null);

  
};

export default DonutChart;