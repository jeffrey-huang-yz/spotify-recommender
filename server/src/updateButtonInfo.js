const { buttonsCollection } = require('./db');

async function updateButtonInfo(buttonId, newMaxValue, newMinValue) {
  try {
    const result = await buttonsCollection.updateOne(
      { buttonId },
      { $set: { maxValue: newMaxValue, minValue: newMinValue } }
    );
    console.log(`${result.modifiedCount} button updated`);
  } catch (error) {
    console.error('Error updating button info:', error);
    throw error;
  }
}

