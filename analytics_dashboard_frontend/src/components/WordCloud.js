import React from "react";
import PropTypes from "prop-types";
import SimpleD3WordCloud from "./SimpleD3WordCloud";

/**
 * PUBLIC_INTERFACE
 * Renders a word cloud using given words and their frequencies.
 * @param {Array<{text: string, value: number}>} words - List of word objects for the cloud.
 * @param {number} [height] - Optional height for the word cloud.
 * @param {number} [width] - Optional width for the word cloud.
 * @param {boolean} [isPhraseCloud] - Display options for phrases (sentence cloud).
 */
const CustomWordCloud = ({ words, height=300, width=600, isPhraseCloud=false }) => {
  if (!words || words.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "2em", color: "#aaa" }}>
        {isPhraseCloud ? "No challenges found." : "No integration data found."}
      </div>
    );
  }

  // d3-cloud expects [{text, value}], we provide words prop in this format
  // Use colors based on isPhraseCloud for compatibility with prior visual style
  const colors = isPhraseCloud ? ["#1976d2", "#29b6f6", "#424242"] : ["#1976d2", "#fbc02d", "#388e3c", "#d32f2f"];

  return (
    <SimpleD3WordCloud words={words} width={width} height={height} colors={colors} />
  );
};

CustomWordCloud.propTypes = {
  words: PropTypes.arrayOf(PropTypes.shape({
    text: PropTypes.string.isRequired,
    value: PropTypes.number.isRequired,
  })).isRequired,
  height: PropTypes.number,
  width: PropTypes.number,
  isPhraseCloud: PropTypes.bool,
};

export default CustomWordCloud;
