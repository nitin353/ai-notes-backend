const fs = require('fs');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

async function parseFile(filePath, mimetype) {
  const buffer = fs.readFileSync(filePath);
  if (mimetype === 'application/pdf') {
    const data = await pdfParse(buffer);
    return data.text;
  }
  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimetype === 'application/msword') {
    const result = await mammoth.extractRawText({ buffer });
    return result.value;
  }
  // fallback: return stringified buffer
  return buffer.toString('utf8');
}

module.exports = { parseFile };