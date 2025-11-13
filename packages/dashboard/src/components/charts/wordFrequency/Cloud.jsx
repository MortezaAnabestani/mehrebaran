import { useEffect, useState } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";
import WordFrequency from "../../../utils/wordFrequency/WordFrequncy";

function Cloud({ data }) {
  const [dimensions, setDimensions] = useState({ width: 300, height: 300 });
  useEffect(() => {
    function updateDimensions() {
      const container = document.getElementById("cloudChartContainer");
      if (container) {
        const width = 400;
        const height = 400;
        setDimensions({ width, height });
      }
    }

    window.addEventListener("resize", updateDimensions);
    updateDimensions(); // در اولین رندر

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!data) return;

    try {
      const frequencyData = WordFrequency(data);

      const { width, height } = dimensions;

      d3.select("#cloudChart").selectAll("*").remove(); // حذف SVG قبلی

      const maxCount = d3.max(frequencyData, (d) => d.count) || 1;

      const fontSizeScale = d3
        .scaleSqrt()
        .domain([0, maxCount])
        .range([15, Math.min(width, height) / 5]); // اندازه فونت متناسب با صفحه

      const colorScale = d3.scaleOrdinal(d3.schemeSet3);

      const layout = cloud()
        .size([width, height])
        .words(
          frequencyData.map((d) => ({
            text: d.word,
            size: fontSizeScale(d.count),
            color: colorScale(d.word),
          }))
        )
        .padding(5)
        .rotate(() => (Math.random() > 0.7 ? 90 : 0))
        .font("Vazirmatn, Arial, sans-serif")
        .fontSize((d) => d.size)
        .on("end", draw);

      layout.start();

      function draw(words) {
        try {
          const svg = d3
            .select("#cloudChart")
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform", `translate(${width / 2},${height / 2})`);

          const texts = svg
            .selectAll("text")
            .data(words)
            .enter()
            .append("text")
            .style("font-family", "Vazirmatn, Arial, sans-serif")
            .style("font-size", (d) => `${d.size}px`)
            .style("fill", (d) => d.color)
            .attr("text-anchor", "middle")
            .attr("transform", (d) => `translate(${d.x},${d.y}) rotate(${d.rotate})`)
            .text((d) => d.text)
            .style("cursor", "pointer")
            .on("mouseover", function (event, d) {
              d3.select(this)
                .transition()
                .duration(300)
                .style("font-size", d.size * 1.2 + "px")
                .style("fill", "#ff5722");

              texts
                .filter((t) => t !== d)
                .transition()
                .duration(300)
                .style("opacity", 0.3);
            })
            .on("mouseout", function (event, d) {
              d3.select(this)
                .transition()
                .duration(300)
                .style("font-size", d.size + "px")
                .style("fill", d.color);

              texts.transition().duration(300).style("opacity", 1);
            });
        } catch (e) {
          console.error("Error in draw: ", e.message);
        }
      }
    } catch (e) {
      console.error("General error: ", e.message);
    }
  }, [data, dimensions]);

  return (
    <div>
      <h1 className="text-md text-center font-bold my-8">نمودار ابری</h1>

      <div id="cloudChartContainer">
        <div id="cloudChart" className="word-cloud"></div>
      </div>
    </div>
  );
}

export default Cloud;
