import React, { useRef, useEffect } from "react";
import * as d3 from "d3";
import cloud from "d3-cloud";

/**
 * PUBLIC_INTERFACE
 * Renders a word cloud using d3-cloud with given words.
 * @param {Array<{text: string, value: number}>} words - List of word objects for the cloud.
 * @param {number} [height] - Height for the word cloud.
 * @param {number} [width] - Width for the word cloud.
 * @param {string[]} [colors] - Array of colors to use for words.
 */
const SimpleD3WordCloud = ({ words, width=600, height=300, colors=["#1976d2", "#29b6f6", "#424242", "#fbc02d", "#388e3c", "#d32f2f"] }) => {
  const ref = useRef();

  useEffect(() => {
    if (!words || words.length === 0) {
      return;
    }

    // Clear previous rendering
    d3.select(ref.current).selectAll("*").remove();

    // Configure cloud layout
    cloud()
      .size([width, height])
      .words(words.map(d => ({ ...d })))
      .padding(5)
      .font("sans-serif")
      .fontSize(d => d.value)
      .rotate(() => ~~(Math.random() * 3) * 60)
      .on("end", draw)
      .start();

    function draw(wordsArr) {
      d3.select(ref.current)
        .append("g")
        .attr("transform", `translate(${width/2},${height/2})`)
        .selectAll("text")
        .data(wordsArr)
        .enter().append("text")
        .style("font-size", d => `${d.size}px`)
        .style("font-family", "sans-serif")
        .style("fill", (d, i) => colors[i % colors.length])
        .attr("text-anchor", "middle")
        .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
        .text(d => d.text);
    }
  }, [words, width, height, colors]);

  if (!words || words.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2em", color: "#aaa" }}>
        No data for word cloud.
      </div>
    );
  }

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      style={{ background: "#fafafa", border: "1px solid #e0e0e0", borderRadius: "8px", margin: "auto", width: width, height: height }}
      data-testid="simple-d3-word-cloud"
    >
    </svg>
  );
};

export default SimpleD3WordCloud;
