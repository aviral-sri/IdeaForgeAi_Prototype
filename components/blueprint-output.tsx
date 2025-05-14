"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Printer, Share2 } from "lucide-react"
import type { BlueprintData } from "@/app/actions"
import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

type BlueprintProps = {
  blueprint: BlueprintData
}

export function BlueprintOutput({ blueprint }: BlueprintProps) {
  const [activeTab, setActiveTab] = useState("all")

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = async () => {
    const element = document.getElementById('blueprint-content')
    if (!element) return

    try {
      const canvas = await html2canvas(element)
      const pdf = new jsPDF('p', 'mm', 'a4')
      const imgData = canvas.toDataURL('image/png')
      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
      pdf.save(`${blueprint.name}-blueprint.pdf`)
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate PDF. Please try again.')
    }
  }

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: blueprint.name,
          text: `Check out my startup blueprint for ${blueprint.name}`,
          url: window.location.href
        })
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }
    } catch (error) {
      console.error('Error sharing:', error)
      alert('Failed to share. Please try again.')
    }
  }

  return (
    <div className="space-y-6 print:p-8">
      <div className="flex items-center justify-between print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Your Startup Blueprint</h1>
          <p className="text-gray-600">Here's your professional startup blueprint based on your inputs</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> Download
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" /> Share
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="print:hidden">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto">
          <TabsTrigger value="all">All Sections</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="product">Product & Tech</TabsTrigger>
          <TabsTrigger value="business">Business Model</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <BlueprintContent blueprint={blueprint} />
        </TabsContent>
        <TabsContent value="market">
          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-xl font-bold text-blue-900">Market Analysis</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Industry Overview</h3>
                  <p className="text-gray-700">{blueprint.marketAnalysis.industryOverview}</p>
                </div>
                <div>
                  <h3 className="font-semibold">Target Audience & Pain Points</h3>
                  <p className="text-gray-700">
                    <strong>Primary audience:</strong> {blueprint.targetAudience}
                  </p>
                  <ul className="ml-5 mt-2 list-disc text-gray-700">
                    {blueprint.marketAnalysis.painPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="product">
          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-xl font-bold text-blue-900">Product & Tech Stack</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Key Features</h3>
                  <ul className="ml-5 list-disc text-gray-700">
                    {blueprint.product.keyFeatures.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold">Recommended Technologies</h3>
                  <p className="text-gray-700">
                    Based on your preferences ({blueprint.techPreferences.join(", ")}), we recommend:
                  </p>
                  <ul className="ml-5 mt-2 list-disc text-gray-700">
                    {blueprint.product.recommendedTech.map((tech, index) => (
                      <li key={index}>{tech}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="business">
          <Card>
            <CardContent className="pt-6">
              <h2 className="mb-4 text-xl font-bold text-blue-900">Business Model & Financials</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold">Revenue Streams</h3>
                  <ul className="ml-5 list-disc text-gray-700">
                    {blueprint.business.revenueStreams.map((stream, index) => (
                      <li key={index}>{stream}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold">Budget Breakdown</h3>
                  <p className="text-gray-700">
                    <strong>Total budget:</strong> {blueprint.budget}
                  </p>
                  <ul className="ml-5 mt-2 list-disc text-gray-700">
                    <li>Development: {blueprint.business.budgetBreakdown.development}</li>
                    <li>Marketing & Sales: {blueprint.business.budgetBreakdown.marketing}</li>
                    <li>Operations: {blueprint.business.budgetBreakdown.operations}</li>
                    <li>Contingency: {blueprint.business.budgetBreakdown.contingency}</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div id="blueprint-content" className="hidden print:block">
        <BlueprintContent blueprint={blueprint} />
      </div>
    </div>
  )
}

function BlueprintContent({ blueprint }: BlueprintProps) {
  return (
    <div className="space-y-8 rounded-lg border p-6 print:border-none">
      {/* Cover */}
      <div className="border-b pb-6 text-center">
        <div className="mb-4 flex justify-center">
          <img src="/logo.png" alt="IdeaForge AI Logo" className="h-16 w-16" />
        </div>
        <h1 className="mb-2 text-3xl font-bold text-blue-900">{blueprint.name}</h1>
        <p className="text-xl text-gray-600">{blueprint.tagline}</p>
      </div>

      {/* Executive Summary */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-900">Executive Summary</h2>
        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="mb-2 font-semibold">Problem Statement</h3>
          <p className="text-gray-700">{blueprint.problem}</p>
        </div>
        <div className="rounded-lg bg-orange-50 p-4">
          <h3 className="mb-2 font-semibold">Your Proposed Solution</h3>
          <p className="text-gray-700">{blueprint.solution}</p>
        </div>
      </div>

      {/* Market Analysis */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-900">Market Analysis</h2>
        <div>
          <h3 className="font-semibold">Industry Overview</h3>
          <p className="text-gray-700">{blueprint.marketAnalysis.industryOverview}</p>
        </div>
        <div>
          <h3 className="font-semibold">Target Audience & Pain Points</h3>
          <p className="text-gray-700">
            <strong>Primary audience:</strong> {blueprint.targetAudience}
          </p>
          <ul className="ml-5 mt-2 list-disc text-gray-700">
            {blueprint.marketAnalysis.painPoints.map((point, index) => (
              <li key={index}>{point}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Product & Tech Stack */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-900">Product & Tech Stack</h2>
        <div>
          <h3 className="font-semibold">Key Features</h3>
          <ul className="ml-5 list-disc text-gray-700">
            {blueprint.product.keyFeatures.map((feature, index) => (
              <li key={index}>{feature}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Recommended Technologies</h3>
          <p className="text-gray-700">
            Based on your preferences ({blueprint.techPreferences.join(", ")}), we recommend:
          </p>
          <ul className="ml-5 mt-2 list-disc text-gray-700">
            {blueprint.product.recommendedTech.map((tech, index) => (
              <li key={index}>{tech}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Business Model & Financials */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-900">Business Model & Financials</h2>
        <div>
          <h3 className="font-semibold">Revenue Streams</h3>
          <ul className="ml-5 list-disc text-gray-700">
            {blueprint.business.revenueStreams.map((stream, index) => (
              <li key={index}>{stream}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">Budget Breakdown</h3>
          <p className="text-gray-700">
            <strong>Total budget:</strong> {blueprint.budget}
          </p>
          <ul className="ml-5 mt-2 list-disc text-gray-700">
            <li>Development: {blueprint.business.budgetBreakdown.development}</li>
            <li>Marketing & Sales: {blueprint.business.budgetBreakdown.marketing}</li>
            <li>Operations: {blueprint.business.budgetBreakdown.operations}</li>
            <li>Contingency: {blueprint.business.budgetBreakdown.contingency}</li>
          </ul>
        </div>
      </div>

      {/* Go-to-Market Strategy */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-900">Go-to-Market Strategy</h2>
        <div>
          <h3 className="font-semibold">Channels & Tactics</h3>
          <ul className="ml-5 list-disc text-gray-700">
            {blueprint.goToMarket.channels.map((channel, index) => (
              <li key={index}>{channel}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-semibold">30/60/90-Day Plan</h3>
          <div className="space-y-2 text-gray-700">
            <p>
              <strong>First 30 days:</strong> {blueprint.goToMarket.plan.thirty}
            </p>
            <p>
              <strong>60 days:</strong> {blueprint.goToMarket.plan.sixty}
            </p>
            <p>
              <strong>90 days:</strong> {blueprint.goToMarket.plan.ninety}
            </p>
          </div>
        </div>
      </div>

      {/* Team & Roles */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-900">Team & Roles</h2>
        <div>
          <h3 className="font-semibold">Suggested Team Composition</h3>
          <p className="text-gray-700">
            <strong>Current team size:</strong> {blueprint.teamSize}
          </p>
          <div className="mt-2 space-y-2 text-gray-700">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="font-medium">Core Team (Founding Stage)</p>
              <ul className="ml-5 list-disc">
                {blueprint.team.core.roles.map((role, index) => (
                  <li key={index}>{role}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="font-medium">Growth Stage Additions</p>
              <ul className="ml-5 list-disc">
                {blueprint.team.growth.roles.map((role, index) => (
                  <li key={index}>{role}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps & Milestones */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-blue-900">Next Steps & Milestones</h2>
        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="mb-2 font-semibold">Immediate Actions</h3>
          <ul className="ml-5 list-disc text-gray-700">
            {blueprint.nextSteps.immediateActions.map((action, index) => (
              <li key={index}>{action}</li>
            ))}
          </ul>
        </div>
        {blueprint.milestones && (
          <div>
            <h3 className="font-semibold">Your Milestones</h3>
            <p className="text-gray-700">{blueprint.milestones}</p>
          </div>
        )}
        {blueprint.risks && (
          <div>
            <h3 className="font-semibold">Risk Management</h3>
            <p className="text-gray-700">{blueprint.risks}</p>
          </div>
        )}
        <div className="rounded-lg bg-orange-50 p-4">
          <p className="flex items-center text-gray-700">
            <span className="mr-2 text-xl">💡</span>
            <span>
              <strong>Tip:</strong> {blueprint.nextSteps.tip}
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}