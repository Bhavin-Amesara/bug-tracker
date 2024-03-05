import React from 'react';
import { Animate } from 'react-move';
// import d3
import * as d3 from 'd3';

const DonutChart = () => {
    const data = [10, 20, 30, 40];
    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;
    
    const color = d3.scaleOrdinal()
        .range(["$3f51b5", "#5196f3", "#03f9f4", "#20bcd4"]);
    
    const pie = d3.pie()
        .sort(null)
        .value(function (d) { return d; });
    
    const arc = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(radius - 70);
    
    const arcs = pie(data);
    
    return (
        <div>
        <svg width={width} height={height}>
            <g transform={`translate(${width / 2},${height / 2})`}>
            {arcs.map((d, i) => (
                <path key={i} d={arc(d)} fill={color(i)} />
            ))}
            </g>
        </svg>
        </div>
    );
    }

export default DonutChart;