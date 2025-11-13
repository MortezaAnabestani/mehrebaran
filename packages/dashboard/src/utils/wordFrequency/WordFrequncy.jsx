import stopWords from "./StopWords";

function WordFrequency(text) {
  let frequencyArray;
  try {
    const words = text
      .replace(/[.,;؛،]/g, "")
      .split(/\s+/)
      .filter((word) => word.length > 2 && !stopWords.has(word));
    const frequency = {};
    words.forEach((word) => {
      word = word.toLowerCase();
      frequency[word] = (frequency[word] || 0) + 1;
    });
    frequencyArray = Object.keys(frequency).map((word) => {
      return { word: word, count: frequency[word] };
    });
    frequencyArray.sort((a, b) => b.count - a.count);
    return frequencyArray.slice(0, 20); // فقط 80 کلمه پربسامد را برگرداند
  } catch (e) {
    console.log(e.message);
    throw e;
  }
}

export default WordFrequency;
