// csvParser.js
const csv = require('csv-parser');
const { Readable } = require('stream');

const parsePVGISCSV = async (csvData) => {
  try {
    console.log('Starting CSV parsing');

    const results = [];
    const stream = Readable.from(csvData);

    await new Promise((resolve, reject) => {
      stream
        .pipe(
          csv({
            headers: ['time', 'G_i', 'T2m', 'WS10m', 'energy'], // Custom headers
            skipEmptyLines: true,
          })
        )
        .on('data', (data) => {
          console.log('CSV row data:', data); // Log each row
          results.push(data);
        })
        .on('end', () => {
          console.log('CSV parsing completed');
          resolve();
        })
        .on('error', (error) => {
          console.error('Error during CSV parsing:', error);
          reject(new Error('Failed to parse CSV data'));
        });
    });

    return results;
  } catch (error) {
    console.error('Exception in parsePVGISCSV:', error);
    throw new Error('Failed to parse CSV data');
  }
};

module.exports = {
  parsePVGISCSV,
};
