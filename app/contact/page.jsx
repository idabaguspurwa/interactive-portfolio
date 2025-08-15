"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Float, Sphere, Torus, Box } from "@react-three/drei";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Github,
  Linkedin,
  Twitter,
  MessageCircle,
  Calendar,
  Briefcase,
  Coffee,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
  ScrollProgress,
  RevealOnScroll,
  StaggerContainer,
  StaggerItem,
} from "@/components/ScrollAnimations";
import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useTheme } from "@/components/ThemeProvider";

function ContactVisualization() {
  const groupRef = useRef();
  const { theme } = useTheme();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1;
      groupRef.current.rotation.x =
        Math.sin(state.clock.elapsedTime * 0.15) * 0.1;
    }
  });

  const shapes = [
    {
      Component: Sphere,
      props: { args: [1] },
      position: [0, 0, 0],
      color: "#4B7BEC",
    },
    {
      Component: Torus,
      props: { args: [1.5, 0.3] },
      position: [0, 0, 0],
      color: "#FF6F61",
    },
    {
      Component: Box,
      props: { args: [0.8, 0.8, 0.8] },
      position: [2, 1, 0],
      color: "#28A745",
    },
    {
      Component: Sphere,
      props: { args: [0.5] },
      position: [-2, -1, 1],
      color: "#FFA500",
    },
    {
      Component: Box,
      props: { args: [0.6, 1.5, 0.6] },
      position: [1, -1.5, -1],
      color: "#9966CC",
    },
  ];

  return (
    <group ref={groupRef}>
      {shapes.map((shape, index) => (
        <Float
          key={index}
          speed={1 + index * 0.2}
          rotationIntensity={0.3}
          floatIntensity={0.5}
          position={shape.position}
        >
          <shape.Component {...shape.props}>
            <meshStandardMaterial
              color={shape.color}
              transparent
              opacity={0.8}
              emissive={shape.color}
              emissiveIntensity={0.1}
            />
          </shape.Component>
        </Float>
      ))}
    </group>
  );
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Template data for different contact types
  const contactTemplates = {
    business: {
      subject: "Business Collaboration Inquiry",
      message: `Hi Ida,

I'm interested in discussing a potential business collaboration opportunity. Here are some details about what I'm looking for:

Project Type: [Please describe your project]
Timeline: [When do you need this completed?]
Budget Range: [What's your budget for this project?]
Specific Requirements: [Any specific technologies or requirements?]

I'd love to schedule a meeting to discuss this further. Please let me know your availability.

Best regards,`
    },
    technical: {
      subject: "Technical Discussion Request",
      message: `Hi Ida,

I'd like to have a technical discussion about data engineering and architecture. Here are the topics I'm interested in:

Areas of Interest:
- [e.g., Data pipeline architecture]
- [e.g., Cloud solutions (AWS/GCP/Azure)]
- [e.g., Real-time data processing]
- [e.g., Data warehouse design]

Background: [Brief description of your current setup or challenges]

I'm looking forward to learning from your expertise and sharing insights.

Best regards,`
    },
    coffee: {
      subject: "Coffee Chat Request",
      message: `Hi Ida,

I'd love to connect over coffee (virtual or in-person) to discuss career opportunities and insights in the data engineering field.

About me: [Brief introduction about yourself]
What I'm looking for: [Career advice, networking, job opportunities, etc.]
Preferred meeting format: [Virtual/In-person in Tangerang area]
Availability: [Your preferred days/times]

Looking forward to a great conversation!

Best regards,`
    }
  };

  const handleTemplateSelect = (templateType) => {
    const template = contactTemplates[templateType];
    setFormData(prev => ({
      ...prev,
      subject: template.subject,
      message: template.message
    }));
    
    // Scroll to contact form
    document.getElementById("contact-form")?.scrollIntoView({ 
      behavior: "smooth",
      block: "start"
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitStatus("success");
        setFormData({ name: "", email: "", subject: "", message: "" });
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        setSubmitStatus("error");
        console.error('Error:', data.error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "ida.adiputra@outlook.com",
      link: "mailto:ida.adiputra@outlook.com",
      color: "from-blue-500 to-cyan-500",
      description: "Send me an email for project collaborations",
    },
    {
      icon: Linkedin,
      title: "LinkedIn",
      value: "Connect with me",
      link: "https://www.linkedin.com/in/idabaguspurwa/",
      color: "from-blue-600 to-blue-700",
      description: "Let's connect professionally",
    },
    {
      icon: Github,
      title: "GitHub",
      value: "View my code",
      link: "https://github.com/idabaguspurwa",
      color: "from-gray-700 to-gray-900",
      description: "Check out my latest projects",
    },
    {
      icon: MapPin,
      title: "Location",
      value: "Tangerang, Indonesia",
      link: null,
      color: "from-green-500 to-emerald-500",
      description: "Open to remote opportunities worldwide",
    },
  ];

  const quickActions = [
    {
      icon: Briefcase,
      title: "Business Collaboration",
      description:
        "Discuss data engineering projects and consulting opportunities",
      action: "Schedule Meeting",
      color: "from-purple-500 to-purple-600",
      templateType: "business",
    },
    {
      icon: MessageCircle,
      title: "Technical Discussion",
      description:
        "Chat about data architecture, cloud solutions, and best practices",
      action: "Start Discussion",
      color: "from-blue-500 to-blue-600",
      templateType: "technical",
    },
    {
      icon: Coffee,
      title: "Casual Coffee Chat",
      description:
        "Connect over coffee to discuss career opportunities and insights",
      action: "Grab Coffee",
      color: "from-orange-500 to-orange-600",
      templateType: "coffee",
    },
  ];

  return (
    <>
      <ScrollProgress />
      <div className="pt-16">
        {/* Hero Section */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7">
                <RevealOnScroll direction="left">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="mb-6"
                  >
                    <span className="bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark bg-clip-text text-transparent text-lg font-semibold">
                      Let's Connect
                    </span>
                  </motion.div>

                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold mb-8 leading-tight">
                    <span className="block text-gray-900 dark:text-white">
                      Get in
                    </span>
                    <span className="block bg-gradient-to-r from-primary-light via-blue-600 to-accent-light dark:from-primary-dark dark:via-blue-400 dark:to-accent-dark bg-clip-text text-transparent">
                      Touch
                    </span>
                  </h1>

                  <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    Ready to collaborate on your next data engineering project?
                    Let's discuss how we can transform your data infrastructure
                    and drive business value together.
                  </p>

                  <div className="space-y-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="flex items-center gap-3 text-gray-600 dark:text-gray-300"
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Available for new opportunities</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="flex items-center gap-3 text-gray-600 dark:text-gray-300"
                    >
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                      <span>Response time: Usually within 24 hours</span>
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                      className="flex items-center gap-3 text-gray-600 dark:text-gray-300"
                    >
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                      <span>Open to remote and on-site collaborations</span>
                    </motion.div>
                  </div>
                </RevealOnScroll>
              </div>

              <div className="lg:col-span-5">
                <RevealOnScroll direction="right" delay={0.2}>
                  <div className="h-96 relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-800 dark:to-gray-700">
                    <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
                      <ambientLight intensity={0.4} />
                      <directionalLight
                        position={[10, 10, 5]}
                        intensity={0.6}
                      />
                      <ContactVisualization />
                      <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate
                        autoRotateSpeed={0.3}
                      />
                    </Canvas>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-20 px-6 bg-gray-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <RevealOnScroll direction="up">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  Contact Information
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Choose your preferred way to reach out. I'm always excited to
                  discuss new projects and opportunities.
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {contactInfo.map((info, index) => (
                  <StaggerItem key={index}>
                    <motion.div
                      className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-80 flex flex-col"
                      whileHover={{ y: -8, scale: 1.05 }}
                    >
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${info.color} p-0.5 mb-6`}
                      >
                        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-2xl flex items-center justify-center">
                          <info.icon className="w-8 h-8 text-gray-700 dark:text-gray-300 group-hover:text-white transition-colors duration-300" />
                        </div>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                        {info.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-grow">
                        {info.description}
                      </p>

                      <div className="mt-auto">
                        {info.link ? (
                          <motion.a
                            href={info.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary-light dark:text-primary-dark font-medium hover:underline"
                            whileHover={{ x: 5 }}
                          >
                            {info.value} →
                          </motion.a>
                        ) : (
                          <span className="text-primary-light dark:text-primary-dark font-medium">
                            {info.value}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <RevealOnScroll direction="up">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  How Can I Help You?
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                  Select the type of collaboration you're interested in, and
                  I'll get back to you with the best approach.
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer>
              <div className="grid md:grid-cols-3 gap-8 mb-16">
                {quickActions.map((action, index) => (
                  <StaggerItem key={index}>
                    <motion.div
                      className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 h-80 flex flex-col"
                      whileHover={{ y: -6, scale: 1.02 }}
                    >
                      <div
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center mb-6`}
                      >
                        <action.icon className="w-8 h-8 text-white" />
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                        {action.title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed flex-grow">
                        {action.description}
                      </p>

                      <div className="mt-auto">
                        <Button
                          className={`w-full bg-gradient-to-r ${action.color} text-white border-none hover:opacity-90`}
                          onClick={() => handleTemplateSelect(action.templateType)}
                        >
                          {action.action}
                        </Button>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </section>

        {/* Contact Form */}
        <section
          id="contact-form"
          className="py-20 px-6 bg-gray-50 dark:bg-gray-900"
        >
          <div className="max-w-4xl mx-auto">
            <RevealOnScroll direction="up">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">
                  Send Me a Message
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  Fill out the form below and I'll get back to you as soon as
                  possible.
                </p>
              </div>
            </RevealOnScroll>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8"
            >
              {/* Template indicator */}
              {(formData.subject || formData.message) && (
                <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        Template loaded - Feel free to customize the message
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ name: "", email: "", subject: "", message: "" })}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 text-sm font-medium"
                    >
                      Clear Form
                    </button>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Subject *
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-all duration-200 resize-vertical"
                    placeholder="Tell me about your project, ideas, or just say hello!"
                  />
                </div>

                <motion.div whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-4 bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark text-white font-semibold rounded-lg hover:opacity-90 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </Button>
                </motion.div>

                {submitStatus === "success" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg text-green-700 dark:text-green-300"
                  >
                    ✅ Thank you! Your message has been sent successfully. I'll
                    get back to you soon.
                  </motion.div>
                )}

                {submitStatus === "error" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300"
                  >
                    ❌ Sorry, there was an error sending your message. Please
                    try again or contact me directly.
                  </motion.div>
                )}
              </form>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
