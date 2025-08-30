import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const ELEVATEAI_BASE_URL = 'https://api.elevateai.com/v1';
const API_TOKEN = process.env.ELEVATEAI_API_TOKEN;

interface TranscriptionResult {
  success: boolean;
  interactionId?: string;
  transcript?: string;
  summary?: string;
  error?: string;
  wordCount?: number;
  duration?: number;
  confidence?: number;
  speakers?: Array<{
    id: string;
    segments: Array<{
      text: string;
      startTime: number;
      endTime: number;
    }>;
  }>;
}

interface InteractionStatus {
  status: 'uploaded' | 'processing' | 'processed' | 'failed';
  progress?: number;
  error?: string;
}

export class TranscriptionService {
  private apiToken: string;

  constructor() {
    this.apiToken = API_TOKEN || '';
    if (!this.apiToken) {
      console.warn('ElevateAI API token not configured. Transcription features will be disabled.');
    }
  }

  /**
   * Declare a new audio interaction with ElevateAI
   */
  async declareInteraction(
    languageTag: string = 'en-us',
    transcriptionMode: 'highAccuracy' | 'fast' = 'highAccuracy'
  ): Promise<{ interactionId: string }> {
    const response = await fetch(`${ELEVATEAI_BASE_URL}/interactions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        languageTag,
        version: 'default',
        transcriptionMode,
        verticalSpecific: 'legal', // Optimize for legal terminology
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to declare interaction: ${response.statusText}`);
    }

    const data = await response.json() as any;
    return { interactionId: data.interactionIdentifier };
  }

  /**
   * Upload audio file to ElevateAI for transcription
   */
  async uploadAudioFile(
    interactionId: string,
    filePath: string,
    fileName: string
  ): Promise<boolean> {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath), fileName);

    const response = await fetch(
      `${ELEVATEAI_BASE_URL}/interactions/${interactionId}/upload`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
        body: formData,
      }
    );

    return response.ok;
  }

  /**
   * Upload audio from URL to ElevateAI
   */
  async uploadAudioFromUrl(
    interactionId: string,
    audioUrl: string
  ): Promise<boolean> {
    const response = await fetch(
      `${ELEVATEAI_BASE_URL}/interactions/${interactionId}/uploadFromUrl`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: audioUrl }),
      }
    );

    return response.ok;
  }

  /**
   * Check the status of a transcription
   */
  async getInteractionStatus(interactionId: string): Promise<InteractionStatus> {
    const response = await fetch(
      `${ELEVATEAI_BASE_URL}/interactions/${interactionId}/status`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get interaction status: ${response.statusText}`);
    }

    const data = await response.json() as any;
    return {
      status: data.status,
      progress: data.progress,
      error: data.error,
    };
  }

  /**
   * Get the transcript for a processed interaction
   */
  async getTranscript(interactionId: string): Promise<any> {
    const response = await fetch(
      `${ELEVATEAI_BASE_URL}/interactions/${interactionId}/transcript`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get transcript: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get AI-generated summary for the interaction
   */
  async getAutoSummary(interactionId: string): Promise<any> {
    const response = await fetch(
      `${ELEVATEAI_BASE_URL}/interactions/${interactionId}/autosummary`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get summary: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get AI analysis results including sentiment, topics, etc.
   */
  async getAIResults(interactionId: string): Promise<any> {
    const response = await fetch(
      `${ELEVATEAI_BASE_URL}/interactions/${interactionId}/airesults`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to get AI results: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Wait for transcription to complete (polling)
   */
  async waitForCompletion(
    interactionId: string,
    maxWaitTime: number = 300000, // 5 minutes
    pollInterval: number = 5000 // 5 seconds
  ): Promise<boolean> {
    const startTime = Date.now();

    while (Date.now() - startTime < maxWaitTime) {
      const status = await this.getInteractionStatus(interactionId);

      if (status.status === 'processed') {
        return true;
      }

      if (status.status === 'failed') {
        throw new Error(`Transcription failed: ${status.error || 'Unknown error'}`);
      }

      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Transcription timeout');
  }

  /**
   * Full transcription workflow - from file to results
   */
  async transcribeAudioFile(
    filePath: string,
    options: {
      languageTag?: string;
      transcriptionMode?: 'highAccuracy' | 'fast';
      includeAISummary?: boolean;
      includeAIAnalysis?: boolean;
    } = {}
  ): Promise<TranscriptionResult> {
    try {
      if (!this.apiToken) {
        return {
          success: false,
          error: 'ElevateAI API token not configured',
        };
      }

      // Step 1: Declare interaction
      const { interactionId } = await this.declareInteraction(
        options.languageTag || 'en-us',
        options.transcriptionMode || 'highAccuracy'
      );

      // Step 2: Upload file
      const fileName = path.basename(filePath);
      const uploaded = await this.uploadAudioFile(interactionId, filePath, fileName);
      
      if (!uploaded) {
        throw new Error('Failed to upload audio file');
      }

      // Step 3: Wait for processing
      await this.waitForCompletion(interactionId);

      // Step 4: Get transcript
      const transcriptData = await this.getTranscript(interactionId);
      
      // Parse transcript to extract text
      let fullTranscript = '';
      let speakers: any[] = [];
      let wordCount = 0;
      let duration = 0;
      let confidence = 0;

      if (transcriptData && transcriptData.segments) {
        // Process segments to build full transcript
        const segments = transcriptData.segments;
        const speakerMap = new Map();

        segments.forEach((segment: any) => {
          fullTranscript += segment.text + ' ';
          wordCount += segment.text.split(' ').length;
          
          if (segment.speakerId) {
            if (!speakerMap.has(segment.speakerId)) {
              speakerMap.set(segment.speakerId, []);
            }
            speakerMap.get(segment.speakerId).push({
              text: segment.text,
              startTime: segment.startTime,
              endTime: segment.endTime,
            });
          }

          if (segment.confidence) {
            confidence += segment.confidence;
          }

          duration = Math.max(duration, segment.endTime || 0);
        });

        // Convert speaker map to array
        speakerMap.forEach((segments, id) => {
          speakers.push({ id, segments });
        });

        if (segments.length > 0) {
          confidence = confidence / segments.length;
        }
      }

      // Step 5: Get optional AI features
      let summary = '';
      if (options.includeAISummary) {
        try {
          const summaryData = await this.getAutoSummary(interactionId);
          summary = summaryData.summary || '';
        } catch (error) {
          console.error('Failed to get AI summary:', error);
        }
      }

      return {
        success: true,
        interactionId,
        transcript: fullTranscript.trim(),
        summary,
        wordCount,
        duration: Math.round(duration),
        confidence: Math.round(confidence * 100) / 100,
        speakers,
      };
    } catch (error) {
      console.error('Transcription error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Transcribe audio from URL
   */
  async transcribeAudioFromUrl(
    audioUrl: string,
    options: {
      languageTag?: string;
      transcriptionMode?: 'highAccuracy' | 'fast';
      includeAISummary?: boolean;
    } = {}
  ): Promise<TranscriptionResult> {
    try {
      if (!this.apiToken) {
        return {
          success: false,
          error: 'ElevateAI API token not configured',
        };
      }

      // Step 1: Declare interaction
      const { interactionId } = await this.declareInteraction(
        options.languageTag || 'en-us',
        options.transcriptionMode || 'highAccuracy'
      );

      // Step 2: Upload from URL
      const uploaded = await this.uploadAudioFromUrl(interactionId, audioUrl);
      
      if (!uploaded) {
        throw new Error('Failed to upload audio from URL');
      }

      // Step 3: Wait for processing
      await this.waitForCompletion(interactionId);

      // Step 4: Get transcript
      const transcriptData = await this.getTranscript(interactionId);
      
      let fullTranscript = '';
      if (transcriptData && transcriptData.segments) {
        transcriptData.segments.forEach((segment: any) => {
          fullTranscript += segment.text + ' ';
        });
      }

      // Step 5: Get optional AI summary
      let summary = '';
      if (options.includeAISummary) {
        try {
          const summaryData = await this.getAutoSummary(interactionId);
          summary = summaryData.summary || '';
        } catch (error) {
          console.error('Failed to get AI summary:', error);
        }
      }

      return {
        success: true,
        interactionId,
        transcript: fullTranscript.trim(),
        summary,
      };
    } catch (error) {
      console.error('Transcription error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Export singleton instance
export const transcriptionService = new TranscriptionService();