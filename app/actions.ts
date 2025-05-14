"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "")

export type BlueprintData = {
  name: string
  tagline: string
  problem: string
  solution: string
  industry: string
  targetAudience: string
  teamSize: string
  budget: string
  techPreferences: string[]
  milestones: string
  risks: string
  marketAnalysis: {
    industryOverview: string
    painPoints: string[]
  }
  product: {
    keyFeatures: string[]
    recommendedTech: string[]
  }
  business: {
    revenueStreams: string[]
    budgetBreakdown: {
      development: string
      marketing: string
      operations: string
      contingency: string
    }
  }
  goToMarket: {
    channels: string[]
    plan: {
      thirty: string
      sixty: string
      ninety: string
    }
  }
  team: {
    core: {
      roles: string[]
    }
    growth: {
      roles: string[]
    }
  }
  nextSteps: {
    immediateActions: string[]
    tip: string
  }
}

export async function generateBlueprint(formData: {
  ideaDescription: string
  industry: string
  targetAudience: string
  teamSize: string
  budget: string
  techPreferences: string[]
  milestones: string
  risks: string
}): Promise<BlueprintData> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" })

  const prompt = `Generate a detailed startup blueprint based on the following information:
    Idea: ${formData.ideaDescription}
    Industry: ${formData.industry}
    Target Audience: ${formData.targetAudience}
    Team Size: ${formData.teamSize}
    Budget: ${formData.budget}
    Tech Preferences: ${formData.techPreferences.join(", ")}
    Milestones: ${formData.milestones}
    Risks: ${formData.risks}

    Format the response as a JSON object with the following structure:
    {
      "name": "Project name based on idea",
      "tagline": "Catchy tagline",
      "problem": "Problem statement",
      "solution": "Solution description",
      "industry": "${formData.industry}",
      "targetAudience": "${formData.targetAudience}",
      "teamSize": "${formData.teamSize}",
      "budget": "${formData.budget}",
      "techPreferences": ${JSON.stringify(formData.techPreferences)},
      "milestones": "${formData.milestones}",
      "risks": "${formData.risks}",
      "marketAnalysis": {
        "industryOverview": "Industry analysis",
        "painPoints": ["Point 1", "Point 2", "Point 3"]
      },
      "product": {
        "keyFeatures": ["Feature 1", "Feature 2", "Feature 3", "Feature 4"],
        "recommendedTech": ["Tech 1", "Tech 2", "Tech 3", "Tech 4"]
      },
      "business": {
        "revenueStreams": ["Stream 1", "Stream 2", "Stream 3", "Stream 4"],
        "budgetBreakdown": {
          "development": "40%",
          "marketing": "30%",
          "operations": "20%",
          "contingency": "10%"
        }
      },
      "goToMarket": {
        "channels": ["Channel 1", "Channel 2", "Channel 3", "Channel 4"],
        "plan": {
          "thirty": "30-day plan",
          "sixty": "60-day plan",
          "ninety": "90-day plan"
        }
      },
      "team": {
        "core": {
          "roles": ["Role 1", "Role 2", "Role 3", "Role 4"]
        },
        "growth": {
          "roles": ["Role 1", "Role 2", "Role 3", "Role 4"]
        }
      },
      "nextSteps": {
        "immediateActions": ["Action 1", "Action 2", "Action 3", "Action 4"],
        "tip": "Strategic advice"
      }
    }
  `

  try {
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    return JSON.parse(text) as BlueprintData
  } catch (error) {
    console.error("Error generating blueprint:", error)
    throw new Error("Failed to generate blueprint. Please try again.")
  }
}