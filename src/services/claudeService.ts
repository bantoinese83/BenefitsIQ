import axios from 'axios'
import { logger } from '../utils/logger'
import { config } from '../lib/config'

const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const API_KEY = config.claude.apiKey

export interface ClaudeInsightRequest {
  scenarioName: string
  baselineCost: number
  projectedCost: number
  adjustments: string[]
}

export class ClaudeService {
  /**
   * Generates a narrative explanation for a given scenario result.
   * Keeps AI separate from deterministic logic.
   */
  static async generateScenarioInsight(data: ClaudeInsightRequest): Promise<string> {
    if (!API_KEY) {
      logger.warn('Claude API key missing. Returning fallback insight.', { scenario: data.scenarioName })
      return `This scenario for ${data.scenarioName} projects a ${data.projectedCost > data.baselineCost ? 'increase' : 'decrease'} in total costs. Key drivers include: ${data.adjustments.join(', ')}.`
    }

    try {
      logger.info('Generating AI insight from Claude', { scenario: data.scenarioName })
      const response = await axios.post(
        CLAUDE_API_URL,
        {
          model: 'claude-3-5-sonnet-20240620',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: `As an HR Benefits Analyst, explain this scenario to an executive.
              Scenario: ${data.scenarioName}
              Baseline Cost: ${data.baselineCost}
              Projected Cost: ${data.projectedCost}
              Key Adjustments: ${data.adjustments.join(', ')}
              
              Provide a professional, data-driven narrative that highlights the financial impact and strategic considerations. Keep it under 150 words.`
            }
          ]
        },
        {
          headers: {
            'x-api-key': API_KEY,
            'anthropic-version': '2023-06-01',
            'content-type': 'application/json'
          }
        }
      )

      return response.data.content[0].text
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error'
      logger.error('Error fetching insight from Claude', { error: errorMessage, scenario: data.scenarioName })
      throw new Error('Failed to generate AI insight')
    }
  }
}
