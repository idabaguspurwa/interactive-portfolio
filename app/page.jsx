"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { SafeCanvas } from "@/components/WebGLManager";
import {
  OrbitControls,
  Float,
  Text3D,
  Environment,
  Sparkles,
} from "@react-three/drei";
import { TypewriterEffect } from "@/components/TypewriterEffect";
import { Button } from "@/components/ui/Button";
import {
  Github,
  Linkedin,
  Mail,
  Download,
  Star,
  Cloud,
  BarChart3,
  Code,
  Database,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useRef, Suspense, useState, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useTheme } from "@/components/ThemeProvider";
import {
  ScrollProgress,
  ParallaxText,
  RevealOnScroll,
  StaggerContainer,
  StaggerItem,
} from "@/components/ScrollAnimations";

function CreativeDataSphere() {
  const groupRef = useRef();
  const sphereRef = useRef();
  const { theme } = useTheme();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
    }
    if (sphereRef.current) {
      sphereRef.current.rotation.x += delta * 0.1;
      sphereRef.current.rotation.z += delta * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[3, 0, -1]}>
      {/* Main data sphere */}
      <Float speed={1.2} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh ref={sphereRef}>
          <icosahedronGeometry args={[1.5, 2]} />
          <meshStandardMaterial
            color={theme === "dark" ? "#50A6FF" : "#4B7BEC"}
            wireframe={true}
            transparent={true}
            opacity={0.7}
          />
        </mesh>
      </Float>

      {/* Orbiting data nodes */}
      {Array.from({ length: 8 }, (_, i) => (
        <Float
          key={i}
          speed={0.8 + i * 0.1}
          rotationIntensity={0.2}
          floatIntensity={0.3}
        >
          <mesh
            position={[
              Math.cos((i / 8) * Math.PI * 2) * 2.5,
              Math.sin((i / 8) * Math.PI * 2) * 0.5,
              Math.sin((i / 8) * Math.PI * 2) * 2.5,
            ]}
          >
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshStandardMaterial
              color={theme === "dark" ? "#FF8A5C" : "#FF6F61"}
              emissive={theme === "dark" ? "#FF8A5C" : "#FF6F61"}
              emissiveIntensity={0.2}
            />
          </mesh>
        </Float>
      ))}

      {/* Connecting particles */}
      <Sparkles
        count={20}
        scale={6}
        size={2}
        speed={0.4}
        color={theme === "dark" ? "#50A6FF" : "#4B7BEC"}
        opacity={0.4}
      />
    </group>
  );
}

function DataVisualization3D() {
  const groupRef = useRef();
  const { theme } = useTheme();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.05;
    }
  });

  const dataPoints = Array.from({ length: 20 }, (_, i) => ({
    position: [
      (Math.random() - 0.5) * 6,
      (Math.random() - 0.5) * 4,
      (Math.random() - 0.5) * 6,
    ],
    scale: Math.random() * 0.5 + 0.2,
    delay: i * 0.1,
  }));

  return (
    <group ref={groupRef} position={[0, 0, -2]}>
      {dataPoints.map((point, i) => (
        <mesh key={i} position={point.position} scale={point.scale}>
          <boxGeometry args={[0.3, 0.3, 0.3]} />
          <meshStandardMaterial
            color={theme === "dark" ? "#50A6FF" : "#4B7BEC"}
            transparent={true}
            opacity={0.7}
            emissive={theme === "dark" ? "#1a365d" : "#2d5aa0"}
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      {/* Connecting lines effect */}
      <Sparkles
        count={15}
        scale={8}
        size={1}
        speed={0.1}
        color={theme === "dark" ? "#FF8A5C" : "#FF6F61"}
        opacity={0.3}
      />
    </group>
  );
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <ScrollProgress />
      <div className="min-h-screen bg-gradient-to-br from-background-light to-background-light-secondary dark:bg-gradient-radial dark:from-background-dark dark:to-background-dark-secondary overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Creative layered background */}
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_80%,rgba(75,123,236,0.1),transparent_70%)] dark:bg-[radial-gradient(circle_at_30%_80%,rgba(80,166,255,0.1),transparent_70%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,111,97,0.1),transparent_70%)] dark:bg-[radial-gradient(circle_at_80%_20%,rgba(255,138,92,0.1),transparent_70%)]"></div>
          </div>

          {/* 3D Background Elements */}
          <div className="absolute inset-0 z-0">
            <SafeCanvas
              camera={{ position: [0, 0, 5], fov: 60 }}
              style={{ background: "transparent" }}
            >
              <Suspense fallback={null}>
                <ambientLight intensity={0.4} />
                <directionalLight position={[10, 10, 5]} intensity={0.6} />
                <pointLight
                  position={[-10, -10, -5]}
                  intensity={0.3}
                  color="#4B7BEC"
                />
                <Environment preset="dawn" background={false} />
                <CreativeDataSphere />
                <DataVisualization3D />
              </Suspense>
            </SafeCanvas>
          </div>

          {/* Main Content Grid */}
          <div className="relative z-10 w-full max-w-7xl mx-auto px-6">
            <div className="grid lg:grid-cols-12 gap-8 items-center min-h-screen py-20">
              {/* Left Content */}
              <div className="lg:col-span-7 space-y-8">
                <RevealOnScroll direction="left" delay={0.2}>
                  {/* Greeting Badge */}
                  <div className="inline-block">
                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full px-6 py-3 border border-primary-light/20 dark:border-primary-dark/20 shadow-lg">
                      <span className="text-sm font-medium text-primary-light dark:text-primary-dark flex items-center gap-2">
                        <motion.span
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          👋
                        </motion.span>
                        Hello, I&apos;m a Data Engineer
                      </span>
                    </div>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll direction="up" delay={0.4}>
                  {/* Main Heading */}
                  <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold leading-tight">
                      <span className="block text-gray-900 dark:text-white">
                        Ida Bagus Gede
                      </span>
                      <span className="block">
                        <span className="bg-gradient-to-r from-primary-light via-blue-600 to-accent-light dark:from-primary-dark dark:via-blue-400 dark:to-accent-dark bg-clip-text text-transparent">
                          Purwa Manik Adiputra
                        </span>
                      </span>
                    </h1>

                    <div className="flex flex-wrap gap-3 mt-6">
                      {[
                        "Data Engineer",
                        "ETL Specialist",
                        "Cloud Architect",
                      ].map((title, index) => (
                        <motion.span
                          key={title}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.5,
                            delay: 0.6 + index * 0.1,
                          }}
                          className="bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 px-4 py-2 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 shadow-md"
                        >
                          {title}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll direction="up" delay={0.6}>
                  {/* Enhanced Description */}
                  <div className="space-y-4 max-w-2xl">
                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
                      Transforming raw data into
                      <TypewriterEffect
                        words={[
                          " actionable insights",
                          " business intelligence",
                          " scalable solutions",
                          " data-driven decisions",
                        ]}
                        className="text-primary-light dark:text-primary-dark font-semibold"
                      />
                    </p>
                    <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed">
                      Specializing in cloud-native ETL pipelines, Apache Spark,
                      and modern data architectures that scale with your
                      business needs.
                    </p>
                  </div>
                </RevealOnScroll>

                <RevealOnScroll direction="up" delay={0.8}>
                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-4 pt-6">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href="/projects">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-primary-light to-blue-600 hover:from-primary-light/90 hover:to-blue-600/90 text-white px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
                        >
                          <span>Explore My Work</span>
                          <motion.div className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                            ✨
                          </motion.div>
                        </Button>
                      </Link>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href="/playground">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 group"
                        >
                          <span>Try Data Playground</span>
                          <motion.div className="ml-2 group-hover:scale-110 transition-transform duration-200">
                            🚀
                          </motion.div>
                        </Button>
                      </Link>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link href="/contact">
                        <Button
                          variant="outline"
                          size="lg"
                          className="border-2 border-gray-300 dark:border-gray-600 hover:border-primary-light dark:hover:border-primary-dark text-gray-700 dark:text-gray-300 hover:text-primary-light dark:hover:text-primary-dark px-8 py-4 rounded-xl backdrop-blur-sm group"
                        >
                          <span>Let&apos;s Connect</span>
                          <motion.div className="ml-2 group-hover:rotate-12 transition-transform duration-200">
                            <Mail className="w-5 h-5" />
                          </motion.div>
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                </RevealOnScroll>
              </div>

              {/* Right Content - Interactive Profile */}
              <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <RevealOnScroll direction="right" delay={0.3}>
                  <motion.div
                    className="relative"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                  >
                    {/* Floating cards around profile */}
                    <motion.div
                      className="absolute -top-8 -left-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-gray-200/50 dark:border-gray-700/50 z-20"
                      animate={{
                        y: [0, -10, 0],
                        rotate: [0, 2, 0],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Currently Available
                        </span>
                      </div>
                    </motion.div>

                    <motion.div
                      className="absolute -bottom-8 -right-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl border border-gray-200/50 dark:border-gray-700/50 z-20"
                      animate={{
                        y: [0, 10, 0],
                        rotate: [0, -2, 0],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1,
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <Database className="w-4 h-4 text-primary-light dark:text-primary-dark" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          Data Engineering
                        </span>
                      </div>
                    </motion.div>

                    {/* Main profile image */}
                    <motion.div
                      className="relative w-80 h-80 rounded-3xl overflow-hidden shadow-2xl"
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-light/20 to-accent-light/20 dark:from-primary-dark/20 dark:to-accent-dark/20"></div>
                      <Image
                        src="/logo.jpg"
                        alt="Ida Bagus Gede Purwa Manik Adiputra"
                        fill
                        className="object-cover relative z-10"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />

                      {/* Overlay gradient */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>
                    </motion.div>
                  </motion.div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Quick Stats Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
          <div className="max-w-6xl mx-auto">
            <RevealOnScroll direction="up">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-gray-900 dark:text-white">
                  What I Bring to the Table
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Transforming complex data challenges into scalable solutions
                  with modern cloud technologies and industry best practices.
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
                {[
                  {
                    number: "15+",
                    label: "Data Projects",
                    icon: "📊",
                    color: "from-blue-500 to-cyan-500",
                  },
                  {
                    number: "5+",
                    label: "Cloud Platforms",
                    icon: "☁️",
                    color: "from-purple-500 to-pink-500",
                  },
                  {
                    number: "10+",
                    label: "Technologies",
                    icon: "⚡",
                    color: "from-green-500 to-emerald-500",
                  },
                  {
                    number: "100%",
                    label: "Data Quality",
                    icon: "🎯",
                    color: "from-orange-500 to-red-500",
                  },
                ].map((stat, index) => (
                  <StaggerItem key={stat.label}>
                    <motion.div
                      className="relative group"
                      whileHover={{ scale: 1.05, y: -5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 rounded-2xl blur transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${
                            stat.color.split(" ")[1]
                          }, ${stat.color.split(" ")[3]})`,
                        }}
                      />

                      <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200/50 dark:border-gray-700/50 group-hover:shadow-xl transition-all duration-300 text-center">
                        <div className="text-4xl mb-3">{stat.icon}</div>
                        <div
                          className={`text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                        >
                          {stat.number}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                          {stat.label}
                        </div>
                      </div>
                    </motion.div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>

            {/* Featured Technologies */}
            <RevealOnScroll direction="up" delay={0.4}>
              <div className="text-center">
                <h3 className="text-2xl font-heading font-semibold mb-8 text-gray-900 dark:text-white">
                  Technologies I Master
                </h3>
                <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
                  {[
                    "Apache Spark",
                    "Apache Kafka",
                    "Apache Airflow",
                    "Python",
                    "SQL",
                    "Azure",
                    "AWS",
                    "GCP",
                    "Snowflake",
                    "dbt",
                    "Docker",
                    "Kubernetes",
                  ].map((tech, index) => (
                    <motion.span
                      key={tech}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                      className="bg-gradient-to-r from-primary-light/10 to-accent-light/10 dark:from-primary-dark/10 dark:to-accent-dark/10 backdrop-blur-sm border border-primary-light/20 dark:border-primary-dark/20 px-4 py-2 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:scale-105 transition-transform duration-200 cursor-default"
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </div>
            </RevealOnScroll>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="py-20 px-6 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-6xl mx-auto">
            <RevealOnScroll direction="up">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6 text-gray-900 dark:text-white">
                  My Core Expertise
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                  Delivering end-to-end data solutions that drive business
                  growth and operational excellence.
                </p>
              </div>
            </RevealOnScroll>

            <StaggerContainer>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Data Engineering Excellence",
                    description:
                      "Apache Spark, Apache Kafka, Apache Airflow, and modern ETL pipelines that scale with your business needs.",
                    icon: "🚀",
                    gradient: "from-blue-500 to-cyan-500",
                  },
                  {
                    title: "Cloud Platform Mastery",
                    description:
                      "GCP, Azure, AWS expertise with cloud-native architectures, serverless computing, and infrastructure as code.",
                    icon: "☁️",
                    gradient: "from-purple-500 to-pink-500",
                  },
                  {
                    title: "Business Intelligence & Analytics",
                    description:
                      "Turning complex data into actionable insights with advanced analytics, visualization, and reporting solutions.",
                    icon: "📊",
                    gradient: "from-green-500 to-emerald-500",
                  },
                ].map((item, index) => (
                  <StaggerItem key={index}>
                    <motion.div
                      className="group relative overflow-hidden rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 h-80 flex flex-col"
                      whileHover={{ y: -10, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-5 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${
                            item.gradient.split(" ")[1]
                          }, ${item.gradient.split(" ")[3]})`,
                        }}
                      />

                      <div className="relative z-10 flex flex-col h-full">
                        <div className="text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                          {item.icon}
                        </div>
                        <h3 className="text-xl font-heading font-semibold mb-4 text-gray-900 dark:text-white">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed flex-1">
                          {item.description}
                        </p>
                      </div>

                      <motion.div
                        className="absolute -bottom-2 -right-2 w-20 h-20 rounded-full opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                        style={{
                          background: `linear-gradient(135deg, ${
                            item.gradient.split(" ")[1]
                          }, ${item.gradient.split(" ")[3]})`,
                        }}
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </motion.div>
                  </StaggerItem>
                ))}
              </div>
            </StaggerContainer>
          </div>
        </section>
      </div>
    </>
  );
}
