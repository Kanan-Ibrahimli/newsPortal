// services/pvgisService.js
const axios = require('axios');

const fetchPVGISData = async (latitude, longitude) => {
  try {
    const url = `https://re.jrc.ec.europa.eu/api/seriescalc?lat=${latitude}&lon=${longitude}&outputformat=csv&startyear=2005&endyear=2016&browser=0`;

    const response = await axios.get(url);

    // Log the first part of the response for debugging
    console.log(
      'Full PVGIS response data (first 500 characters):',
      response.data.slice(0, 500)
    );

    // Split the response data by line breaks
    const lines = response.data.split('\n');

    // Filter lines to start from the first data row
    const dataStartIndex = lines.findIndex((line) =>
      /^\d{8}:\d{4},/.test(line)
    );
    if (dataStartIndex === -1) {
      console.error('No valid CSV data found in the response.');
      throw new Error('Failed to retrieve CSV data from PVGIS API');
    }

    // Join only the data rows back into a CSV string
    const csvData = lines.slice(dataStartIndex).join('\n');
    console.log(
      'Parsed CSV data (first 500 characters):',
      csvData.slice(0, 500)
    );

    return csvData;
  } catch (error) {
    console.error('Error fetching PVGIS data:', error.message);
    throw new Error('Failed to fetch PVGIS data');
  }
};

module.exports = { fetchPVGISData };
