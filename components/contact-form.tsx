"use client"

import type React from "react"
import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle2, AlertCircle } from "lucide-react"

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "5b95f65c-fb5f-4aae-afcc-7e5299bd6a00",
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: formData.subject || "Contact Form Submission",
          message: formData.message,
          from_name: "D'RENTALS Contact Form",
        }),
      })

      const result = await response.json()

      if (result.success) {
        setIsSubmitted(true)
        formRef.current?.reset()
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        })
      } else {
        setError(result.message || "Something went wrong. Please try again later.")
      }
    } catch (err) {
      setError("Failed to submit the form. Please try again later.")
      console.error("Form submission error:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="p-8 border border-zinc-800 bg-zinc-900 text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="h-16 w-16 text-red-500" />
        </div>
        <h3 className="font-heading text-2xl text-white mb-4">MESSAGE RECEIVED</h3>
        <p className="text-zinc-300 mb-6 font-body">
          Thank you for contacting D&apos;RENTALS. Our team will review your message and get back to you shortly.
        </p>
        <Button onClick={() => setIsSubmitted(false)} className="bg-red-500 hover:bg-red-600 text-white font-heading">
          SEND ANOTHER MESSAGE
        </Button>
      </div>
    )
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-6 p-6 border border-zinc-800 bg-zinc-900">
      {error && (
        <div className="p-4 border border-red-500 bg-red-500/10 text-white flex items-center gap-2 rounded-none">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <p>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-white font-mono">
            NAME
          </Label>
          <Input
            id="name"
            name="name"
            placeholder="Your name"
            required
            className="bg-zinc-800 border-zinc-700 text-white font-body"
            onChange={handleChange}
            value={formData.name}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-white font-mono">
            EMAIL
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Your email"
            required
            className="bg-zinc-800 border-zinc-700 text-white font-body"
            onChange={handleChange}
            value={formData.email}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-white font-mono">
            PHONE
          </Label>
          <Input
            id="phone"
            name="phone"
            placeholder="Your phone number"
            className="bg-zinc-800 border-zinc-700 text-white font-body"
            onChange={handleChange}
            value={formData.phone}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject" className="text-white font-mono">
            INQUIRY TYPE
          </Label>
          <Select onValueChange={handleSelectChange} value={formData.subject}>
            <SelectTrigger className="bg-zinc-800 border-zinc-700 text-white font-body">
              <SelectValue placeholder="Select inquiry type" />
            </SelectTrigger>
            <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
              <SelectItem value="Equipment Rental">Equipment Rental</SelectItem>
              <SelectItem value="Availability Check">Availability Check</SelectItem>
              <SelectItem value="Pricing Inquiry">Pricing Inquiry</SelectItem>
              <SelectItem value="Technical Support">Technical Support</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message" className="text-white font-mono">
          MESSAGE
        </Label>
        <Textarea
          id="message"
          name="message"
          placeholder="Your message"
          required
          rows={6}
          className="bg-zinc-800 border-zinc-700 text-white font-body resize-none"
          onChange={handleChange}
          value={formData.message}
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-red-500 hover:bg-red-600 text-white font-heading py-6"
      >
        {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
      </Button>
    </form>
  )
}
