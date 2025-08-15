'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle, AlertCircle, Mail, User, MessageSquare, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useIsMobile } from './MobileOptimizations'

export function EnhancedContactForm() {
  const isMobile = useIsMobile()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success', 'error', null
  const [errors, setErrors] = useState({})
  const [focusedField, setFocusedField] = useState(null)

  const validateField = (name, value) => {
    switch (name) {
      case 'name':
        return value.length < 2 ? 'Name must be at least 2 characters' : ''
      case 'email':
        return !/\S+@\S+\.\S+/.test(value) ? 'Please enter a valid email' : ''
      case 'subject':
        return value.length < 5 ? 'Subject must be at least 5 characters' : ''
      case 'message':
        return value.length < 10 ? 'Message must be at least 10 characters' : ''
      default:
        return ''
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    const error = validateField(name, value)
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }))
    }
    setFocusedField(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Validate all fields
    const newErrors = {}
    Object.keys(formData).forEach(field => {
      const error = validateField(field, formData[field])
      if (error) newErrors[field] = error
    })
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setIsSubmitting(false)
      return
    }

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000)
    }
  }

  const inputVariants = {
    focused: {
      scale: 1.02,
      boxShadow: '0 0 0 3px rgba(75, 123, 236, 0.1)',
      borderColor: '#4B7BEC'
    },
    unfocused: {
      scale: 1,
      boxShadow: '0 0 0 0px rgba(75, 123, 236, 0)',
      borderColor: '#e5e7eb'
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label className="flex items-center text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            <User className="w-4 h-4 mr-2" />
            Your Name
          </label>
          <motion.input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onFocus={() => setFocusedField('name')}
            onBlur={handleBlur}
            variants={inputVariants}
            animate={focusedField === 'name' ? 'focused' : 'unfocused'}
            className={`w-full px-4 py-3 border rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark transition-all duration-200 ${
              errors.name 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark'
            }`}
            placeholder="Enter your full name"
          />
          <AnimatePresence>
            {errors.name && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm mt-1 flex items-center"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.name}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label className="flex items-center text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            <Mail className="w-4 h-4 mr-2" />
            Email Address
          </label>
          <motion.input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onFocus={() => setFocusedField('email')}
            onBlur={handleBlur}
            variants={inputVariants}
            animate={focusedField === 'email' ? 'focused' : 'unfocused'}
            className={`w-full px-4 py-3 border rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark transition-all duration-200 ${
              errors.email 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark'
            }`}
            placeholder="your.email@example.com"
          />
          <AnimatePresence>
            {errors.email && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm mt-1 flex items-center"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.email}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Subject Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label className="flex items-center text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            <MessageSquare className="w-4 h-4 mr-2" />
            Subject
          </label>
          <motion.input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            onFocus={() => setFocusedField('subject')}
            onBlur={handleBlur}
            variants={inputVariants}
            animate={focusedField === 'subject' ? 'focused' : 'unfocused'}
            className={`w-full px-4 py-3 border rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark transition-all duration-200 ${
              errors.subject 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark'
            }`}
            placeholder="What's this about?"
          />
          <AnimatePresence>
            {errors.subject && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm mt-1 flex items-center"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.subject}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Message Field */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <label className="flex items-center text-sm font-medium text-text-primary-light dark:text-text-primary-dark mb-2">
            <MessageSquare className="w-4 h-4 mr-2" />
            Message
          </label>
          <motion.textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            onFocus={() => setFocusedField('message')}
            onBlur={handleBlur}
            variants={inputVariants}
            animate={focusedField === 'message' ? 'focused' : 'unfocused'}
            rows={6}
            className={`w-full px-4 py-3 border rounded-lg bg-surface-light dark:bg-surface-dark text-text-primary-light dark:text-text-primary-dark resize-none transition-all duration-200 ${
              errors.message 
                ? 'border-red-500 focus:border-red-500' 
                : 'border-border-light dark:border-border-dark focus:border-primary-light dark:focus:border-primary-dark'
            }`}
            placeholder="Tell me about your project, ideas, or just say hello!"
          />
          <AnimatePresence>
            {errors.message && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-500 text-sm mt-1 flex items-center"
              >
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.message}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-primary-light hover:bg-primary-light/90 dark:bg-primary-dark dark:hover:bg-primary-dark/90 text-white py-3 transition-all duration-300 relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-accent-light/20 to-transparent"
              initial={{ x: '-100%' }}
              whileHover={{ x: '100%' }}
              transition={{ duration: 0.6 }}
            />
            <span className="relative flex items-center justify-center">
              {isSubmitting ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                />
              ) : (
                <Send className="w-5 h-5 mr-2" />
              )}
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </span>
          </Button>
        </motion.div>

        {/* Status Messages */}
        <AnimatePresence>
          {submitStatus && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-4 rounded-lg flex items-center ${
                submitStatus === 'success' 
                  ? 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400' 
                  : 'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400'
              }`}
            >
              {submitStatus === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-2" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-2" />
              )}
              {submitStatus === 'success' 
                ? 'Thank you! Your message has been sent successfully.' 
                : 'Oops! Something went wrong. Please try again.'}
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  )
}
