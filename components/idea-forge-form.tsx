"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { BlueprintOutput } from "@/components/blueprint-output"
import { Loader2, ArrowLeft, ArrowRight, Info } from "lucide-react"
import { generateBlueprint, type BlueprintData } from "@/app/actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const industries = [
  "Technology",
  "Healthcare",
  "Finance",
  "Education",
  "E-commerce",
  "Entertainment",
  "Food & Beverage",
  "Travel",
  "Real Estate",
  "Other",
]

const techOptions = [
  { id: "web", label: "Web" },
  { id: "ios", label: "iOS" },
  { id: "android", label: "Android" },
  { id: "windows", label: "Windows" },
  { id: "mac", label: "Mac" },
  { id: "not-sure", label: "Not sure" },
]

type FormData = {
  ideaDescription: string
  industry: string
  targetAudience: string
  teamSize: string
  budget: string
  techPreferences: string[]
  milestones: string
  risks: string
}

const initialFormData: FormData = {
  ideaDescription: "",
  industry: "",
  targetAudience: "",
  teamSize: "",
  budget: "",
  techPreferences: [],
  milestones: "",
  risks: "",
}

type FormErrors = {
  [K in keyof FormData]?: string
}

export function IdeaForgeForm() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState("")
  const [blueprint, setBlueprint] = useState<BlueprintData | null>(null)
  const [showAiNotice, setShowAiNotice] = useState(true)

  const loadingMessages = [
    "Forging your blueprint...",
    "Calculating market-fit magic...",
    "Analyzing industry trends...",
    "Crafting your business model...",
    "Finishing touches...",
  ]

  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {}

    if (step === 1) {
      if (!formData.ideaDescription.trim()) {
        newErrors.ideaDescription = "Please describe your idea"
      } else if (formData.ideaDescription.length > 500) {
        newErrors.ideaDescription = "Description must be 500 characters or less"
      }
    } else if (step === 2) {
      if (!formData.industry) {
        newErrors.industry = "Please select an industry"
      }
      if (!formData.targetAudience.trim()) {
        newErrors.targetAudience = "Please describe your target audience"
      }
      if (!formData.teamSize.trim()) {
        newErrors.teamSize = "Please provide your team size"
      }
      if (!formData.budget.trim()) {
        newErrors.budget = "Please provide your budget"
      }
      if (formData.techPreferences.length === 0) {
        newErrors.techPreferences = "Please select at least one technology preference"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1)
  }

  const handleSubmit = async () => {
    if (currentStep === 3 || validateStep(2)) {
      setIsLoading(true)

      // Simulate loading with changing messages
      let messageIndex = 0
      const messageInterval = setInterval(() => {
        setLoadingMessage(loadingMessages[messageIndex % loadingMessages.length])
        messageIndex++
      }, 1500)

      try {
        // Call the server action to generate the blueprint
        const generatedBlueprint = await generateBlueprint({
          ideaDescription: formData.ideaDescription,
          industry: formData.industry,
          targetAudience: formData.targetAudience,
          teamSize: formData.teamSize,
          budget: formData.budget,
          techPreferences: formData.techPreferences,
          milestones: formData.milestones,
          risks: formData.risks,
        })

        // Ensure minimum loading time of 3 seconds for better UX
        setTimeout(() => {
          clearInterval(messageInterval)
          setBlueprint(generatedBlueprint)
          setIsLoading(false)
        }, 3000)
      } catch (error) {
        console.error("Error generating blueprint:", error)
        clearInterval(messageInterval)

        setTimeout(() => {
          setIsLoading(false)
        }, 2000)
      }
    }
  }

  const handleInputChange = (field: keyof FormData, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleCheckboxChange = (id: string, checked: boolean) => {
    setFormData((prev) => {
      const newPreferences = checked
        ? [...prev.techPreferences, id]
        : prev.techPreferences.filter((item) => item !== id)

      return { ...prev, techPreferences: newPreferences }
    })

    // Clear error when user selects
    if (errors.techPreferences) {
      setErrors((prev) => ({ ...prev, techPreferences: undefined }))
    }
  }

  if (blueprint) {
    return (
      <>
        {showAiNotice && (
          <Alert className="mb-6" variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>Demo Mode</AlertTitle>
            <AlertDescription className="flex items-center justify-between">
              <span>
                This blueprint was generated using our template engine. AI-powered generation will be available soon.
              </span>
              <Button variant="outline" size="sm" onClick={() => setShowAiNotice(false)}>
                Dismiss
              </Button>
            </AlertDescription>
          </Alert>
        )}
        <BlueprintOutput blueprint={blueprint} />
      </>
    )
  }

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>Step {currentStep} of 3</span>
          <span>{Math.round((currentStep / 3) * 100)}%</span>
        </div>
        <Progress value={(currentStep / 3) * 100} className="h-2" />
      </div>

      {/* Step 1 */}
      {currentStep === 1 && (
        <div className="space-y-4 transition-all duration-300">
          <h2 className="text-2xl font-bold text-blue-900">Let Your Idea Come to the Board!</h2>
          <p className="text-gray-600">
            Describe your startup idea in detail. What problem does it solve? What makes it unique?
          </p>

          <div className="space-y-2">
            <Label htmlFor="ideaDescription">Idea Description</Label>
            <Textarea
              id="ideaDescription"
              placeholder="Describe your startup idea here..."
              rows={6}
              value={formData.ideaDescription}
              onChange={(e) => handleInputChange("ideaDescription", e.target.value)}
              className={errors.ideaDescription ? "border-red-500" : ""}
            />
            <div className="flex justify-between">
              <p className={`text-xs ${errors.ideaDescription ? "text-red-500" : "text-gray-500"}`}>
                {errors.ideaDescription || `${formData.ideaDescription.length}/500 characters`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step 2 */}
      {currentStep === 2 && (
        <div className="space-y-4 transition-all duration-300">
          <h2 className="text-2xl font-bold text-blue-900">Tell us more about your project</h2>
          <p className="text-gray-600">These details will help us tailor the blueprint to your specific needs.</p>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="industry">Industry</Label>
              <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                <SelectTrigger id="industry" className={errors.industry ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select industry" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.industry && <p className="text-xs text-red-500">{errors.industry}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetAudience">Target Audience</Label>
              <Input
                id="targetAudience"
                placeholder="Who will use your product?"
                value={formData.targetAudience}
                onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                className={errors.targetAudience ? "border-red-500" : ""}
              />
              {errors.targetAudience && <p className="text-xs text-red-500">{errors.targetAudience}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="teamSize">Team Size</Label>
              <Input
                id="teamSize"
                placeholder="How many people on your team?"
                value={formData.teamSize}
                onChange={(e) => handleInputChange("teamSize", e.target.value)}
                className={errors.teamSize ? "border-red-500" : ""}
              />
              {errors.teamSize && <p className="text-xs text-red-500">{errors.teamSize}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="budget">Budget</Label>
              <Input
                id="budget"
                placeholder="What's your budget range?"
                value={formData.budget}
                onChange={(e) => handleInputChange("budget", e.target.value)}
                className={errors.budget ? "border-red-500" : ""}
              />
              {errors.budget && <p className="text-xs text-red-500">{errors.budget}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tech Preferences</Label>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              {techOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={option.id}
                    checked={formData.techPreferences.includes(option.id)}
                    onCheckedChange={(checked) => handleCheckboxChange(option.id, checked as boolean)}
                  />
                  <Label htmlFor={option.id} className="cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </div>
            {errors.techPreferences && <p className="text-xs text-red-500">{errors.techPreferences}</p>}
          </div>
        </div>
      )}

      {/* Step 3 */}
      {currentStep === 3 && (
        <div className="space-y-4 transition-all duration-300">
          <h2 className="text-2xl font-bold text-blue-900">Additional Information (Optional)</h2>
          <p className="text-gray-600">These details will help us create a more comprehensive blueprint.</p>

          <div className="space-y-2">
            <Label htmlFor="milestones">Milestones & Timeline</Label>
            <Textarea
              id="milestones"
              placeholder="What are your key milestones and timeline?"
              rows={4}
              value={formData.milestones}
              onChange={(e) => handleInputChange("milestones", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="risks">Key Risks or Unknowns</Label>
            <Textarea
              id="risks"
              placeholder="What are the main risks or unknowns for your project?"
              rows={4}
              value={formData.risks}
              onChange={(e) => handleInputChange("risks", e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Loading state */}
      {isLoading && (
        <div className="space-y-4 py-8 text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <h3 className="text-xl font-medium text-blue-900">{loadingMessage}</h3>
          <Progress value={Math.random() * 100} className="h-2" />
        </div>
      )}

      {/* Navigation buttons */}
      {!isLoading && (
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack} disabled={currentStep === 1} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          {currentStep < 3 ? (
            <Button onClick={handleNext} className="gap-2">
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
              Generate Blueprint
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
