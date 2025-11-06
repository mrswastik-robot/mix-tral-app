// Mistral Agent setup and management

import { Mistral } from '@mistralai/mistralai';
import { codeAnalyzerTool, analyzeCodeComplexity } from './code-analyzer';

export function getMistralClient() {
  const apiKey = process.env.MISTRAL_API_KEY;
  
  if (!apiKey) {
    throw new Error('MISTRAL_API_KEY is not set in environment variables');
  }

  return new Mistral({ apiKey });
}

// agent instructions
export const CODE_REVIEW_AGENT_INSTRUCTIONS = `You are an expert code reviewer with deep knowledge of software engineering best practices, security, and performance optimization.

Your role is to:
1. Analyze code for potential bugs, vulnerabilities, and issues
2. Suggest improvements for code quality, readability, and maintainability
3. Check adherence to best practices and coding standards
4. Identify performance optimization opportunities

When reviewing code:
- Be constructive and specific in your feedback
- Provide examples where helpful
- Prioritize issues by severity (Critical, High, Medium, Low)
- Highlight what's done well, not just problems
- Structure your response with clear sections

Format your response with these sections (in this exact order):
 **Issues Found** - List any bugs or potential problems
 **Suggestions** - Improvements for code quality
 **Performance** - Optimization opportunities
 **Good Practices** - What's done well

IMPORTANT: Do NOT include a Metrics section - metrics will be displayed separately by the system.`;

export async function getCodeReviewAgent(client: Mistral) {
  try {
    return {
      model: 'mistral-small-latest',
      instructions: CODE_REVIEW_AGENT_INSTRUCTIONS,
      tools: [codeAnalyzerTool],
    };
  } catch (error) {
    console.error('Error setting up agent:', error);
    throw error;
  }
}


export async function reviewCode(code: string, language: string) {
  const client = getMistralClient();
  const agent = await getCodeReviewAgent(client);

  try {
    const metrics = analyzeCodeComplexity(code, language);

    const response = await client.chat.complete({
      model: agent.model,
      messages: [
        {
          role: 'system',
          content: agent.instructions,
        },
        {
          role: 'user',
          content: `Please review this ${language} code and provide detailed feedback:\n\n\`\`\`${language}\n${code}\n\`\`\``,
        },
      ],
      temperature: 0.3,
    });

    const choice = response.choices?.[0];
    if (!choice) {
      throw new Error('No response from agent');
    }

    const content = choice.message.content;
    const review = typeof content === 'string' ? content : 'No review generated';
    
    // return both review and metrics
    return {
      review,
      metrics,
    };
  } catch (error) {
    console.error('Error during code review:', error);
    throw error;
  }
}

