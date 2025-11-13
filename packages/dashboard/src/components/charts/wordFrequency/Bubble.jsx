import { useEffect } from "react";
import * as d3 from "d3";
import WordFrequency from "../../../utils/wordFrequency/WordFrequncy";

function Bubble({ data }) {
  useEffect(() => {
    try {
      // دریافت بسامد واژه‌ها
      const frequencyData = WordFrequency(data);
      // تنظیمات نمودار حبابی
      const width = 400;
      const height = 400;

      // ایجاد نمودار حبابی
      const svg = d3
        .select("#bubbleChart")
        .append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      const bubble = d3.pack().size([width, height]).padding(3);

      const root = d3.hierarchy({ children: frequencyData }).sum((d) => d.count);

      bubble(root);

      const nodes = svg
        .selectAll("g")
        .data(root.children)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${d.x - width / 2},${d.y - height / 2})`);

      nodes
        .append("circle")
        .attr("r", (d) => d.r)
        .attr("fill", "#ffffff")
        .attr("stroke", "#333")
        .attr("stroke-width", 1)
        .attr("cursor", "pointer")
        .on("mouseover", function (event, d) {
          d3.select(this)
            .transition()
            .duration(200)
            .attr("r", d.r * 1.1)
            .attr("filter", "url(#drop-shadow)");

          d3.select(this.parentNode)
            .transition()
            .duration(200)
            .attr("transform", (d) => `translate(${d.x - width / 2},${d.y - height / 2 - 10})`);

          d3.select(this.parentNode).select("text").transition().duration(200).attr("font-weight", "light");
        })
        .on("mouseout", function (event, d) {
          d3.select(this).transition().duration(200).attr("r", d.r).attr("filter", "none");

          d3.select(this.parentNode)
            .transition()
            .duration(200)
            .attr("transform", (d) => `translate(${d.x - width / 2},${d.y - height / 2})`);

          d3.select(this.parentNode).select("text").transition().duration(200).attr("font-weight", "normal");
        });

      nodes
        .append("text")
        .attr("dy", "0.3em")
        .style("text-anchor", "middle")
        .text((d) => d.data.word)
        .attr("font-size", (d) => Math.min(d.r / 2, 24));

      // Drop shadow filter
      const defs = svg.append("defs");
      const filter = defs.append("filter").attr("id", "drop-shadow").attr("height", "130%");
      filter.append("feGaussianBlur").attr("in", "SourceAlpha").attr("stdDeviation", 3);
      filter.append("feOffset").attr("dx", 2).attr("dy", 2).attr("result", "offsetblur");
      filter.append("feComponentTransfer").append("feFuncA").attr("type", "linear").attr("slope", 0.5);
      const feMerge = filter.append("feMerge");
      feMerge.append("feMergeNode");
      feMerge.append("feMergeNode").attr("in", "SourceGraphic");
    } catch (e) {
      console.log(e.message);
    }
  }, []);

  return (
    <div>
      <h1 className="text-base font-bold my-8 text-center">نمودار حبابی</h1>
      <div id="bubbleChart" className="bubble-chart"></div>
    </div>
  );
}

export default Bubble;
