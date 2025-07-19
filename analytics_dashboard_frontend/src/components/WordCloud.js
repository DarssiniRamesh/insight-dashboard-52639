import React from "react";
import PropTypes from "prop-types";
import WordCloud from "react-wordcloud";

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

  // react-wordcloud expects [{text, value}], we provide words prop in this format
  const options = {
    rotations: 3,
    rotationAngles: [0, 60, 90],
    fontSizes: [18, 60],
    fontFamily: isPhraseCloud ? "Georgia,serif" : "sans-serif",
    colors: isPhraseCloud ? ["#1976d2", "#29b6f6", "#424242"] : ["#1976d2", "#fbc02d", "#388e3c", "#d32f2f"],
    enableTooltip: true,
  };

  return (
    <div style={{
      width: width,
      height: height,
      margin: "auto",
      background: "#fafafa",
      border: "1px solid #e0e0e0",
      borderRadius: "8px"
    }}>
      <WordCloud words={words} options={options} />
    </div>
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
