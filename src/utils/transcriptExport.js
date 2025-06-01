// src/utils/transcriptExport.js
export const exportTranscriptToDatabase = async (transcript) => {
  try {
    // Filter transcript using the same logic as STTFeedback component
    const transcriptOnlyText = transcript.filter((t) => {
      if (!('text' in t) || !t.text) return false;

      const systemKeywords = [
        'PAGE_METADATA',
        'SYSTEM',
        'METADATA',
        'CONNECTION',
        'SESSION',
        '__system__',
        'sm-',
        'soul-',
      ];

      const isSysMsg = systemKeywords.some((kw) => 
        t.text.toLowerCase().includes(kw.toLowerCase())
      );

      return !isSysMsg && t.text.trim().length > 0;
    });

    // Prepare data for database
    const exportData = {
      sessionId: `session_${Date.now()}`, // You might want to use a proper session ID
      timestamp: new Date().toISOString(),
      messages: transcriptOnlyText.map(entry => ({
        source: entry.source,
        text: entry.text,
        timestamp: entry.timestamp || new Date().toISOString(),
      })),
      messageCount: transcriptOnlyText.length,
      sessionDuration: null, // You can add session duration if needed
      exitMethod: 'unknown', // Will be set by caller (ESC key, timer, etc.)
    };

    // Send to your API endpoint
    const response = await fetch('http://localhost:5001/api/transcript/save', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exportData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('Transcript exported successfully:', result);
    return result;
  } catch (error) {
    console.error('Failed to export transcript:', error);
    throw error;
  }
};