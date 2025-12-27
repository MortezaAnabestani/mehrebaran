import { useEffect, useRef } from "react";
import * as d3 from "d3";
import WordFrequency from "../../../utils/wordFrequency/WordFrequncy";

function Bubble({ data }) {
  const svgRef = useRef(null);

  useEffect(() => {
    if (!data) return;

    try {
      // پاکسازی نمودار قبلی برای جلوگیری از تکرار در رندر مجدد
      d3.select(svgRef.current).selectAll("*").remove();

      // دریافت بسامد واژه‌ها
      const frequencyData = WordFrequency(data);

      // تنظیمات ابعاد و حاشیه‌ها
      const width = 500;
      const height = 500;
      const padding = 4;

      // تعریف پالت رنگی بر اساس رنگ برند (#007acc)
      // کلمات پرتکرار تیره‌تر و کم‌تکرار روشن‌تر خواهند بود
      const colorScale = d3
        .scaleSequential()
        .domain([0, d3.max(frequencyData, (d) => d.count)])
        .interpolator(d3.interpolateRgb("#e1f5fe", "#007acc"));

      // ایجاد SVG اصلی
      const svg = d3
        .select(svgRef.current)
        .attr("width", width)
        .attr("height", height)
        .attr("viewBox", `0 0 ${width} ${height}`)
        .style("max-width", "100%")
        .style("height", "auto")
        .append("g")
        .attr("transform", `translate(${width / 2},${height / 2})`);

      // تعریف فیلتر سایه برای حالت Hover (Elevation Effect)
      const defs = svg.append("defs");
      const filter = defs.append("filter").attr("id", "m3-elevation").attr("height", "150%");

      filter
        .append("feGaussianBlur")
        .attr("in", "SourceAlpha")
        .attr("stdDeviation", 4)
        .attr("result", "blur");

      filter.append("feOffset").attr("in", "blur").attr("dx", 0).attr("dy", 4).attr("result", "offsetBlur");

      const feMerge = filter.append("feMerge");
      feMerge.append("feMergeNode").attr("in", "offsetBlur");
      feMerge.append("feMergeNode").attr("in", "SourceGraphic");

      // محاسبات Layout حبابی
      const bubble = d3.pack().size([width, height]).padding(padding);

      const root = d3.hierarchy({ children: frequencyData }).sum((d) => d.count);

      bubble(root);

      // رسم نودها (Nodes)
      const nodes = svg
        .selectAll("g")
        .data(root.children)
        .enter()
        .append("g")
        .attr("transform", (d) => `translate(${d.x - width / 2},${d.y - height / 2})`)
        .style("cursor", "pointer");

      // رسم دایره‌ها
      nodes
        .append("circle")
        .attr("r", (d) => d.r)
        .attr("fill", (d) => colorScale(d.data.count))
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 2)
        .style("transition", "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)") // M3 Easing
        .on("mouseover", function (event, d) {
          // انیمیشن بزرگ‌نمایی و سایه (Elevation Up)
          d3.select(this)
            .transition()
            .duration(300)
            .ease(d3.easeCubicOut)
            .attr("r", d.r * 1.15)
            .attr("filter", "url(#m3-elevation)")
            .attr("stroke", "#007acc")
            .attr("stroke-width", 3);

          // تغییر رنگ متن برای کنتراست بهتر
          d3.select(this.parentNode)
            .select("text")
            .transition()
            .duration(300)
            .style("font-weight", "700")
            .style("fill", "#000");

          // بالا آوردن عنصر در Z-index (با مرتب‌سازی مجدد در DOM)
          d3.select(this.parentNode).raise();
        })
        .on("mouseout", function (event, d) {
          // بازگشت به حالت اولیه
          d3.select(this)
            .transition()
            .duration(300)
            .ease(d3.easeCubicOut)
            .attr("r", d.r)
            .attr("filter", "null")
            .attr("stroke", "#ffffff")
            .attr("stroke-width", 2);

          d3.select(this.parentNode)
            .select("text")
            .transition()
            .duration(300)
            .style("font-weight", "400")
            .style("fill", (d) => (d.data.count > 5 ? "#fff" : "#333")); // کنتراست هوشمند
        });

      // افزودن متن
      nodes
        .append("text")
        .attr("dy", "0.3em")
        .style("text-anchor", "middle")
        .text((d) => d.data.word)
        .style("font-size", (d) => `${Math.min(d.r / 2, 20)}px`)
        .style("fill", (d) => {
          // اگر رنگ پس‌زمینه تیره است (بسامد بالا)، متن سفید باشد
          const bgColor = d3.rgb(colorScale(d.data.count));
          return bgColor.r * 0.299 + bgColor.g * 0.587 + bgColor.b * 0.114 > 140
            ? "#1f1f1f" // متن تیره برای پس‌زمینه روشن
            : "#ffffff"; // متن سفید برای پس‌زمینه تیره
        })
        .style("pointer-events", "none") // جلوگیری از تداخل موس با متن
        .style("user-select", "none");
    } catch (e) {
      console.error("Bubble Chart Error:", e.message);
    }
  }, [data]);

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      {/* M3 Card Container */}
      <div className="bg-white rounded-[28px] shadow-md p-6 w-full max-w-lg flex flex-col items-center transition-shadow hover:shadow-lg">
        {/* Header Section */}
        <div className="mb-6 text-center">
          <h2 className="text-xl font-medium text-gray-800 tracking-tight">تراکم واژگان</h2>
          <p className="text-sm text-gray-500 mt-1">نمایش بسامد کلمات به صورت حبابی</p>
        </div>

        {/* Chart Container */}
        <div className="relative w-full flex justify-center items-center overflow-hidden">
          <svg ref={svgRef}></svg>
        </div>
      </div>
    </div>
  );
}

export default Bubble;
