const { buttonsCollection } = require('./db');

async function getButtonInfo(buttonId) {
  try {
    const button = await buttonsCollection.findOne({ buttonId });
    return button;
  } catch (error) {
    console.error('Error fetching button info:', error);
    throw error;
  }
}
