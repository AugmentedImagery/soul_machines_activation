// src/utils/feedbackExport.js
export const exportFeedbackToDatabase = async (feedbackData) => {
  try {
    console.log('🚀 Starting feedback export...');
    console.log('📝 Feedback data:', feedbackData);

    // Prepare data for database
    const exportData = {
      feedbackId: `feedback_${Date.now()}`,
      timestamp: new Date().toISOString(),
      rating: feedbackData.rating,
      ratingText: feedbackData.ratingText,
      writtenFeedback: feedbackData.writtenFeedback || '',
      hasWrittenFeedback: Boolean(feedbackData.writtenFeedback && feedbackData.writtenFeedback.trim()),
      submissionMethod: 'ENTER_KEY',
    };

    console.log('📤 Sending feedback to API:', exportData);

    // Send to your API endpoint
    const response = await fetch('http://localhost:5001/api/transcript/feedback', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exportData),
    });

    console.log('📨 Response status:', response.status);
    console.log('📨 Response ok:', response.ok);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
    }

    const result = await response.json();
    console.log('✅ Feedback exported successfully:', result);
    return result;
  } catch (error) {
    console.error('💥 Feedback export failed:', error);
    throw error;
  }
};