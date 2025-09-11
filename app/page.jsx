"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import { TypewriterEffect } from "@/components/TypewriterEffect";
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import {
  Github,
  Linkedin,
  Mail,
  Star,
  Code,
  Database,
  MapPin,
  TrendingUp,
  Award,
  Sparkles,
  Rocket,
  Users,
  Activity
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const StardewFarmBackground = dynamic(() => import("@/components/StardewFarmBackground"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-300 dark:from-amber-900 dark:to-amber-700"></div>
  )
});

// Motion wrapper for animations
function MotionDiv({ children, ...props }) {
  const [MotionComponent, setMotionComponent] = useState(null);

  useEffect(() => {
    import("framer-motion").then((mod) => {
      setMotionComponent(() => mod.motion.div);
    });
  }, []);

  if (!MotionComponent) {
    return <div {...(props.className ? { className: props.className } : {})}>{children}</div>;
  }

  return <MotionComponent {...props}>{children}</MotionComponent>;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Stardew Valley Farm Background */}
      <div className="fixed inset-0 z-0">
        <StardewFarmBackground />
      </div>
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-4 md:p-6 lg:p-8">
        
        {/* Greeting Badge */}
        <div className="text-center mb-8 mt-8">
          <MotionDiv
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-full px-4 py-2 shadow-lg border border-white/20"
          >
            <span className="text-2xl">👋</span>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Hello, I&apos;m a Data Engineer
            </span>
          </MotionDiv>
        </div>

        {/* Bento Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-12 gap-4 auto-rows-[120px]">
            
            {/* Main Hero Card */}
            <MotionDiv 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="col-span-12 lg:col-span-7 row-span-4"
            >
              <Card className="h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border border-white/50 dark:border-gray-700/50">
                <CardContent className="p-6 md:p-8 h-full flex flex-col justify-center">
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                        Ida Bagus Gede
                        <br />
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          Purwa Manik Adiputra
                        </span>
                      </h1>
                      
                      <div className="flex flex-wrap gap-2 mb-6">
                        <Badge variant="secondary">Data Engineer</Badge>
                        <Badge variant="secondary">ETL Specialist</Badge>
                        <Badge variant="secondary">Cloud Architect</Badge>
                      </div>
                    </div>
                    
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                      Transforming raw data into{" "}
                      <TypewriterEffect
                        words={[
                          "actionable insights",
                          "business intelligence", 
                          "scalable solutions"
                        ]}
                        className="text-blue-600 dark:text-blue-400 font-semibold"
                      />
                    </p>
                    
                    <div className="flex flex-wrap gap-3">
                      <Link href="/projects">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                          <Sparkles className="w-4 h-4 mr-2" />
                          Explore Work
                        </Button>
                      </Link>
                      <Link href="/playground">
                        <Button variant="outline">
                          <Rocket className="w-4 h-4 mr-2" />
                          Data Playground
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionDiv>

            {/* Profile Image */}
            <MotionDiv 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="col-span-12 lg:col-span-5 row-span-4"
            >
              <Card className="h-full overflow-hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border border-white/50 dark:border-gray-700/50">
                <CardContent className="p-0 h-full relative">
                  <Image
                    src="/logo.jpg"
                    alt="Ida Bagus Gede Purwa Manik Adiputra"
                    fill
                    className="object-cover object-center"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                  
                  <div className="absolute top-4 left-4 z-10">
                    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium">Available</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="absolute bottom-4 left-4 z-10">
                    <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3 text-blue-600" />
                        <span className="text-xs font-medium">Tangerang, Indonesia</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </MotionDiv>

            {/* Stats Card 1 */}
            <MotionDiv 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="col-span-6 lg:col-span-3 row-span-2"
            >
              <Card className="h-full bg-gradient-to-br from-emerald-50/90 to-emerald-100/90 dark:from-emerald-900/30 dark:to-emerald-800/30 backdrop-blur-xl shadow-xl border border-emerald-300/40 dark:border-emerald-500/40">
                <CardContent className="h-full flex flex-col justify-center items-center text-center p-4">
                  <TrendingUp className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mb-3" />
                  <h3 className="text-2xl font-bold text-emerald-800 dark:text-emerald-300">10+</h3>
                  <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">Projects</p>
                </CardContent>
              </Card>
            </MotionDiv>

            {/* Stats Card 2 */}
            <MotionDiv 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="col-span-6 lg:col-span-3 row-span-2"
            >
              <Card className="h-full bg-gradient-to-br from-orange-50/90 to-orange-100/90 dark:from-orange-900/30 dark:to-orange-800/30 backdrop-blur-xl shadow-xl border border-orange-300/40 dark:border-orange-500/40">
                <CardContent className="h-full flex flex-col justify-center items-center text-center p-4">
                  <Award className="w-10 h-10 text-orange-600 dark:text-orange-400 mb-3" />
                  <h3 className="text-2xl font-bold text-orange-800 dark:text-orange-300">2+</h3>
                  <p className="text-sm font-medium text-orange-700 dark:text-orange-400">Years</p>
                </CardContent>
              </Card>
            </MotionDiv>

            {/* Gaming Status - Stardew Valley */}
            <MotionDiv 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="col-span-12 lg:col-span-6 row-span-2"
            >
              <Card className="h-full bg-gradient-to-br from-blue-50/95 to-indigo-100/95 dark:from-slate-800/95 dark:to-slate-900/95 backdrop-blur-xl shadow-xl border border-blue-200/50 dark:border-slate-600/50">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-slate-700 dark:text-slate-200 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Favorite Game
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-18 rounded-lg overflow-hidden bg-blue-500 flex-shrink-0">
                      <Image
                        src="/stardew_valley.png"
                        alt="Stardew Valley"
                        width={96}
                        height={72}
                        className="object-contain w-full h-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 dark:text-white text-xl">Stardew Valley</h3>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">48</div>
                      <div className="text-xs text-slate-600 dark:text-slate-200">Hours played</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-300">16</div>
                      <div className="text-xs text-slate-600 dark:text-slate-200">Achievements</div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-600 dark:text-slate-200">
                      <span>Achievement Progress</span>
                      <span>16 of 49</span>
                    </div>
                    <div className="w-full bg-slate-300/70 dark:bg-slate-700/50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-yellow-400 to-green-400 h-2 rounded-full" style={{width: '33%'}}></div>
                    </div>
                    <div className="flex items-center gap-1 mt-2">
                      {[1,2,3,4,5].map((i) => (
                        <div key={i} className="w-6 h-6 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-sm border border-yellow-300 flex items-center justify-center">
                          <Star className="w-3 h-3 text-white" />
                        </div>
                      ))}
                      <span className="text-xs text-slate-600 dark:text-slate-200 ml-1 font-medium">+11</span>
                    </div>
                  </div>
                  </CardContent>
              </Card>
            </MotionDiv>

            {/* Tech Stack */}
            <MotionDiv 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="col-span-12 lg:col-span-8 row-span-2"
            >
              <Card className="h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl border border-white/50 dark:border-gray-700/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code className="w-5 h-5 text-indigo-600" />
                    Technology Stack
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      "Python", "SQL", "Apache Spark", "Kafka", 
                      "Azure", "AWS", "Docker", "Kubernetes",
                      "Snowflake", "dbt", "Airflow", "Terraform"
                    ].map((tech, index) => (
                      <MotionDiv
                        key={tech}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
                        whileHover={{ scale: 1.05 }}
                        className="bg-gray-100 dark:bg-gray-800 rounded-lg p-2 text-center"
                      >
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {tech}
                        </span>
                      </MotionDiv>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </MotionDiv>

            {/* Steam Gaming Profile */}
            <MotionDiv 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="col-span-12 lg:col-span-4 row-span-2"
            >
              <Card className="h-full bg-gradient-to-br from-purple-50/95 to-indigo-100/95 dark:from-indigo-900/95 dark:to-purple-900/95 backdrop-blur-xl shadow-xl border border-purple-200/50 dark:border-indigo-500/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2 text-purple-800 dark:text-white">
                    <Activity className="w-5 h-5 text-purple-600 dark:text-indigo-300" />
                    Steam Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-2xl font-bold text-white">🎮</span>
                    </div>
                    <h3 className="text-purple-900 dark:text-white font-bold text-lg">frostmarinee</h3>
                    <p className="text-purple-600 dark:text-indigo-200 text-sm mb-2">Indie Game Enthusiast</p>
                  </div>
                  
                  <MotionDiv
                    whileHover={{ scale: 1.02 }}
                    className="group"
                  >
                    <Link 
                      href="https://steamcommunity.com/id/frostmarinee" 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-center py-2.5 px-4 rounded-lg font-medium transition-all duration-200 shadow-lg"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>View Steam Profile</span>
                      </div>
                    </Link>
                  </MotionDiv>
                </CardContent>
              </Card>
            </MotionDiv>

          </div>
        </div>
      </div>
    </>
  );
}
