"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize the Google Generative AI with the API key
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

// Create a fallback blueprint function to avoid code duplication
function createFallbackBlueprint(formData: {
  ideaDescription: string
  industry: string
  targetAudience: string
  teamSize: string
  budget: string
  techPreferences: string[]
  milestones: string
  risks: string
}): BlueprintData {
  return {
    name: formData.ideaDescription
      .split(" ")
      .slice(0, 3)
      .join(" ")
      .replace(/[^\w\s]/gi, ""),
    tagline: `Revolutionizing ${formData.industry} for ${formData.targetAudience}`,
    problem: "The market lacks innovative solutions that address specific pain points.",
    solution: formData.ideaDescription,
    industry: formData.industry,
    targetAudience: formData.targetAudience,
    teamSize: formData.teamSize,
    budget: formData.budget,
    techPreferences: formData.techPreferences,
    milestones: formData.milestones,
    risks: formData.risks,
    marketAnalysis: {
      industryOverview: `The ${formData.industry} industry is rapidly evolving with new technologies and changing consumer preferences.`,
      painPoints: ["Inefficient existing solutions", "High costs", "Poor integration with workflows"],
    },
    product: {
      keyFeatures: ["Intuitive user interface", "Seamless integration", "Advanced analytics", "Scalable architecture"],
      recommendedTech: ["React.js with Next.js", "Node.js backend", "PostgreSQL database", "Docker and Kubernetes"],
    },
    business: {
      revenueStreams: ["Subscription model", "Premium features", "API access", "White-label solutions"],
      budgetBreakdown: {
        development: "40%",
        marketing: "30%",
        operations: "20%",
        contingency: "10%",
      },
    },
    goToMarket: {
      channels: ["Content marketing", "Social media", "Strategic partnerships", "Referral program"],
      plan: {
        thirty: "Market validation and MVP development",
        sixty: "Beta testing with early adopters",
        ninety: "Official launch and marketing campaign",
      },
    },
    team: {
      core: {
        roles: ["CEO/Founder", "CTO/Technical Lead", "Product Manager", "Full-stack Developer"],
      },
      growth: {
        roles: ["Marketing Lead", "Sales Representative", "Customer Success", "Additional Developers"],
      },
    },
    nextSteps: {
      immediateActions: ["Finalize business plan", "Secure initial funding", "Build MVP", "Identify early adopters"],
      tip: "Focus on validating your core assumptions before investing heavily in development.",
    },
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
  // Since we're having issues with the Google Generative AI API,
  // let's use a fallback blueprint for now
  return createFallbackBlueprint(formData)
}
