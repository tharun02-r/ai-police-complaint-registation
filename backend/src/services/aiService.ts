/**
 * AI Service for Complaint Validation, Translation, and Extraction
 * Since we don't have an AI API key yet, these are mocked implementations.
 * We can easily swap these out with OpenAI/Gemini SDK calls later.
 */

// Types of intent we can extract
export type ComplaintCategory = 'Theft' | 'Harassment' | 'Cybercrime' | 'Assault' | 'Fraud' | 'Other';
export type PriorityLevel = 'URGENT' | 'HIGH' | 'NORMAL';

export interface AnalyzedComplaint {
  translatedText: string;
  category: ComplaintCategory;
  priority: PriorityLevel;
  extractedLocation: string | null;
  missingFields: string[];
}

/**
 * Mocks the AI pipeline analyzing a user's raw text complaint.
 */
export async function analyzeComplaint(rawText: string, language: string): Promise<AnalyzedComplaint> {
  // Simulate AI latency
  await new Promise(resolve => setTimeout(resolve, 1500));

  const lowerText = rawText.toLowerCase();
  let category: ComplaintCategory = 'Other';
  let priority: PriorityLevel = 'NORMAL';
  let missingFields: string[] = [];

  // Simple keyword-based mock analysis
  if (lowerText.includes('stolen') || lowerText.includes('theft') || lowerText.includes('choori')) {
    category = 'Theft';
  } else if (lowerText.includes('harass') || lowerText.includes('stalk') || lowerText.includes('pareshan')) {
    category = 'Harassment';
    priority = 'HIGH';
  } else if (lowerText.includes('hack') || lowerText.includes('money') || lowerText.includes('scam')) {
    category = 'Cybercrime';
  } else if (lowerText.includes('kidnap') || lowerText.includes('weapon') || lowerText.includes('murder')) {
    category = 'Assault';
    priority = 'URGENT';
  }

  // Location missing mock logic
  let location = null;
  const wordCount = rawText.split(/\s+/).length;
  
  // If the user provided a detailed account (>20 words), the mock AI assumes details exist
  if (wordCount > 20) {
    location = "Extracted intelligently";
  } else {
    if (!lowerText.includes('at ') && !lowerText.includes('in ') && !lowerText.includes('near ')) {
      missingFields.push('location');
    } else {
      location = "Extracted Location (Mock)";
    }

    if (!lowerText.includes('yesterday') && !lowerText.includes('today') && !lowerText.includes('time')) {
      missingFields.push('time_of_incident');
    }
  }

  return {
    translatedText: `(Mock Translated from ${language}): ${rawText}`,
    category,
    priority,
    extractedLocation: location,
    missingFields
  };
}
