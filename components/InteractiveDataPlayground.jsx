"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Play,
  Download,
  Filter,
  BarChart3,
  Database,
  FileText,
  Zap,
  CheckCircle,
  TrendingUp,
  PieChart,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const sampleData = [
  {
    id: 1,
    name: "John Doe",
    age: 28,
    department: "Engineering",
    salary: 75000,
    join_date: "2022-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    age: 32,
    department: "Marketing",
    salary: 68000,
    join_date: "2021-08-20",
  },
  {
    id: 3,
    name: "Mike Johnson",
    age: 45,
    department: "Engineering",
    salary: 95000,
    join_date: "2020-03-10",
  },
  {
    id: 4,
    name: "Sarah Wilson",
    age: 29,
    department: "Sales",
    salary: 72000,
    join_date: "2022-06-01",
  },
  {
    id: 5,
    name: "David Brown",
    age: 38,
    department: "Marketing",
    salary: 78000,
    join_date: "2021-11-12",
  },
  {
    id: 6,
    name: "Lisa Davis",
    age: 26,
    department: "Engineering",
    salary: 82000,
    join_date: "2023-02-28",
  },
];

const dataLakehouseLayers = [
  {
    id: "bronze",
    name: "Bronze Layer",
    description: "Raw data ingestion (Kafka → Delta Lake)",
    icon: Database,
    color: "from-amber-600 to-orange-600",
    stage: "Raw Data",
    tech: "Apache Kafka, Delta Lake",
  },
  {
    id: "silver",
    name: "Silver Layer",
    description: "Data cleaning & validation (Spark ETL)",
    icon: Zap,
    color: "from-gray-400 to-gray-600",
    stage: "Clean Data",
    tech: "Apache Spark, Data Quality",
  },
  {
    id: "gold",
    name: "Gold Layer",
    description: "Business-ready analytics (Aggregated)",
    icon: CheckCircle,
    color: "from-yellow-400 to-yellow-600",
    stage: "Analytics Ready",
    tech: "Spark SQL, BI Tools",
  },
];

export function InteractiveDataPlayground() {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState(sampleData);
  const [transformedData, setTransformedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedTransformation, setSelectedTransformation] =
    useState("clean_data");
  const [dataStructure, setDataStructure] = useState(null);
  const [dataContext, setDataContext] = useState(null);
  const [availableTransformations, setAvailableTransformations] = useState({});
  const [isDragOver, setIsDragOver] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const fileInputRef = useRef(null);

  // Set client flag to prevent hydration errors with dynamic content
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Consistent number formatting to prevent hydration errors
  const formatNumber = (value) => {
    if (typeof value !== "number") return value;
    // Only format on client side to prevent hydration errors
    if (!isClient) return value;
    if (value > 1000) {
      return new Intl.NumberFormat("en-US").format(value);
    }
    return value;
  };

  // Smart data analysis
  const analyzeDataStructure = useCallback((data) => {
    if (!data || data.length === 0) return null;

    const columns = Object.keys(data[0]);
    const types = {};
    const stats = {};

    columns.forEach((col) => {
      const values = data
        .map((row) => row[col])
        .filter((val) => val !== null && val !== undefined && val !== "");
      const numericValues = values.filter(
        (val) => !isNaN(parseFloat(val)) && isFinite(val)
      );
      const dateValues = values.filter((val) => !isNaN(Date.parse(val)));

      if (numericValues.length > values.length * 0.7) {
        types[col] = "numeric";
        const nums = numericValues.map((v) => parseFloat(v));
        stats[col] = {
          min: Math.min(...nums),
          max: Math.max(...nums),
          avg: nums.reduce((a, b) => a + b, 0) / nums.length,
          count: nums.length,
        };
      } else if (dateValues.length > values.length * 0.5) {
        types[col] = "date";
        stats[col] = { count: dateValues.length };
      } else {
        types[col] = "text";
        const uniqueValues = [...new Set(values)];
        // Clean and truncate sample values for better display
        const cleanedValues = uniqueValues.slice(0, 5).map((val) => {
          const str = String(val);
          return str.length > 30 ? str.substring(0, 30) + "..." : str;
        });
        stats[col] = {
          unique: uniqueValues.length,
          count: values.length,
          top: cleanedValues,
        };
      }
    });

    return { columns, types, stats };
  }, []);

  // Intelligent data context detection
  const detectDataContext = useCallback((data, structure) => {
    if (!data || !structure) return { context: "unknown", suggestions: [] };

    const { columns, types } = structure;
    const columnNames = columns.map((col) => col.toLowerCase());

    // Racing/Sports context detection (check first for specificity)
    if (
      columnNames.some((col) =>
        [
          "race",
          "circuit",
          "driver",
          "lap",
          "time",
          "position",
          "points",
          "speed",
          "qualifying",
          "grid",
          "fastest",
          "constructor",
          "team",
        ].includes(col)
      )
    ) {
      return {
        context: "racing",
        icon: "🏎️",
        title: "Racing/Sports Data Detected",
        suggestions: [
          "Standardize race names and circuit information",
          "Clean timing data and lap records",
          "Normalize driver names and positions",
          "Remove incomplete race results",
        ],
      };
    }

    // Business/Sales context detection
    if (
      columnNames.some((col) =>
        [
          "revenue",
          "sales",
          "profit",
          "price",
          "cost",
          "amount",
          "total",
          "value",
        ].includes(col)
      )
    ) {
      return {
        context: "business",
        icon: "💼",
        title: "Business Data Detected",
        suggestions: [
          "Clean and standardize financial data",
          "Remove outliers from revenue/sales figures",
          "Normalize currency formatting",
          "Group by product/region for analysis",
        ],
      };
    }

    // Employee/HR context detection
    if (
      columnNames.some((col) =>
        [
          "employee",
          "salary",
          "department",
          "age",
          "experience",
          "position",
          "name",
        ].includes(col)
      )
    ) {
      return {
        context: "hr",
        icon: "👥",
        title: "HR/Employee Data Detected",
        suggestions: [
          "Standardize employee names and titles",
          "Clean salary data and remove formatting",
          "Normalize department names",
          "Remove incomplete employee records",
        ],
      };
    }

    // Geographic/Location context detection
    if (
      columnNames.some((col) =>
        [
          "country",
          "city",
          "location",
          "region",
          "state",
          "lat",
          "lng",
          "latitude",
          "longitude",
        ].includes(col)
      )
    ) {
      return {
        context: "geographic",
        icon: "🌍",
        title: "Geographic Data Detected",
        suggestions: [
          "Standardize location names and formats",
          "Clean coordinate data",
          "Remove invalid geographic entries",
          "Group by regions for analysis",
        ],
      };
    }

    // Default context with generic suggestions
    return {
      context: "general",
      icon: "📊",
      title: "General Dataset",
      suggestions: [
        "Clean and standardize all data formats",
        "Remove duplicates and incomplete records",
        "Fix text formatting and capitalization",
        "Normalize numeric values",
      ],
    };
  }, []);

  // Data cleaning utilities
  const cleanDataValue = (value, type) => {
    if (value === null || value === undefined || value === "") return null;

    const stringValue = String(value).trim();
    if (
      stringValue === "" ||
      stringValue.toLowerCase() === "null" ||
      stringValue.toLowerCase() === "n/a"
    )
      return null;

    if (type === "numeric") {
      // Clean numeric values - remove currency symbols, commas, percentages
      const cleaned = stringValue
        .replace(/[$,€£¥%]/g, "")
        .replace(/[^\d.-]/g, "");
      const num = parseFloat(cleaned);
      return isNaN(num) ? null : Math.round(num * 100) / 100; // Round to 2 decimals
    } else if (type === "text") {
      // Check if it's a URL - preserve URLs as-is
      if (
        stringValue.toLowerCase().startsWith("http") ||
        stringValue.includes("www.") ||
        stringValue.includes("://")
      ) {
        return stringValue; // Keep URLs intact
      }

      // Clean text values - standardize formatting (but preserve important punctuation)
      return stringValue
        .replace(/\s+/g, " ") // Multiple spaces to single space
        .replace(/[^\w\s.,-]/g, "") // Remove special characters but keep dots, commas, hyphens
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase()) // Title case
        .trim();
    } else if (type === "date") {
      // Clean date values
      const date = new Date(stringValue);
      return isNaN(date.getTime()) ? null : date.toISOString().split("T")[0];
    }

    return stringValue;
  };

  // Generate powerful data cleaning transformations
  const generateTransformations = useCallback((structure, dataContext) => {
    if (!structure) return {};

    const { columns, types, stats } = structure;
    const transformations = {};

    // 1. Data Cleaning & Standardization
    transformations.clean_data = {
      name: "🧹 Clean & Standardize Data",
      description: "Remove duplicates, fix formatting, handle missing values",
      apply: (data) => {
        // Step 1: Clean individual values
        const cleaned = data.map((row) => {
          const cleanedRow = {};
          columns.forEach((col) => {
            const type = types[col];
            cleanedRow[col] = cleanDataValue(row[col], type);
          });
          return cleanedRow;
        });

        // Step 2: Remove exact duplicates
        const uniqueRows = cleaned.filter(
          (row, index, self) =>
            index ===
            self.findIndex((r) => JSON.stringify(r) === JSON.stringify(row))
        );

        // Step 3: Add data quality indicators
        return uniqueRows.map((row, index) => ({
          ...row,
          record_id: index + 1,
          completeness_score: Math.round(
            (Object.values(row).filter((v) => v !== null).length /
              columns.length) *
              100
          ),
        }));
      },
    };

    // 2. Remove incomplete records
    transformations.remove_incomplete = {
      name: "🗑️ Remove Incomplete Records",
      description:
        "Filter out rows with too many missing values (keep 70%+ complete)",
      apply: (data) => {
        return data.filter((row) => {
          const nonNullValues = Object.values(row).filter(
            (val) => val !== null && val !== undefined && val !== ""
          );
          const completeness = nonNullValues.length / columns.length;
          return completeness >= 0.7; // Keep rows that are at least 70% complete
        });
      },
    };

    // 3. Numeric data transformations
    const numericCols = Object.keys(types).filter(
      (col) => types[col] === "numeric"
    );
    if (numericCols.length > 0) {
      transformations.fix_numeric_data = {
        name: "🔢 Fix Numeric Data",
        description: `Clean and standardize ${numericCols.length} numeric columns`,
        apply: (data) => {
          return data.map((row) => {
            const newRow = { ...row };
            numericCols.forEach((col) => {
              const value = row[col];
              if (value !== null && value !== undefined) {
                // Remove currency symbols, commas, percentages
                const cleaned = String(value).replace(/[$,€£¥%]/g, "");
                const num = parseFloat(cleaned);
                newRow[col] = isNaN(num) ? null : Math.round(num * 100) / 100;
              }
            });
            return newRow;
          });
        },
      };

      transformations.remove_outliers = {
        name: "📈 Remove Statistical Outliers",
        description: "Remove extreme values that skew analysis",
        apply: (data) => {
          return data.filter((row) => {
            return numericCols.every((col) => {
              const value = parseFloat(row[col]);
              if (isNaN(value)) return true;

              const values = data
                .map((r) => parseFloat(r[col]))
                .filter((v) => !isNaN(v));
              if (values.length < 3) return true;

              const mean = values.reduce((a, b) => a + b, 0) / values.length;
              const stdDev = Math.sqrt(
                values.reduce((sq, n) => sq + Math.pow(n - mean, 2), 0) /
                  values.length
              );

              // Keep values within 2.5 standard deviations
              return Math.abs(value - mean) <= 2.5 * stdDev;
            });
          });
        },
      };
    }

    // 4. Text data transformations
    const textCols = Object.keys(types).filter((col) => types[col] === "text");
    if (textCols.length > 0) {
      transformations.standardize_text = {
        name: "📝 Standardize Text Data",
        description: `Clean formatting in ${textCols.length} text columns`,
        apply: (data) => {
          return data.map((row) => {
            const newRow = { ...row };
            textCols.forEach((col) => {
              const value = row[col];
              if (value && typeof value === "string") {
                newRow[col] = value
                  .trim()
                  .replace(/\s+/g, " ") // Multiple spaces to single
                  .replace(/[^\w\s.-]/g, "") // Remove special characters
                  .toLowerCase()
                  .replace(/\b\w/g, (l) => l.toUpperCase()); // Title case
              }
            });
            return newRow;
          });
        },
      };

      const firstTextCol = textCols[0];
      transformations.group_analysis = {
        name: `📊 Group Analysis by ${firstTextCol}`,
        description: `Analyze patterns grouped by ${firstTextCol}`,
        apply: (data) => {
          const grouped = data.reduce((acc, row) => {
            const key = row[firstTextCol] || "Unknown";
            if (!acc[key]) {
              acc[key] = { records: [], count: 0 };
            }
            acc[key].records.push(row);
            acc[key].count++;
            return acc;
          }, {});

          return Object.entries(grouped)
            .map(([category, group]) => {
              const result = {
                category: category,
                record_count: group.count,
                percentage: Math.round((group.count / data.length) * 100),
              };

              // Add numeric aggregations if available
              numericCols.forEach((col) => {
                const values = group.records
                  .map((r) => parseFloat(r[col]))
                  .filter((v) => !isNaN(v));
                if (values.length > 0) {
                  result[`avg_${col}`] =
                    Math.round(
                      (values.reduce((a, b) => a + b, 0) / values.length) * 100
                    ) / 100;
                  result[`total_${col}`] =
                    Math.round(values.reduce((a, b) => a + b, 0) * 100) / 100;
                  result[`max_${col}`] = Math.max(...values);
                  result[`min_${col}`] = Math.min(...values);
                }
              });

              return result;
            })
            .sort((a, b) => b.record_count - a.record_count);
        },
      };
    }

    // 5. Complete transformation pipeline
    transformations.complete_clean = {
      name: "✨ Complete Data Transformation",
      description:
        "Apply full cleaning pipeline: standardize → deduplicate → validate",
      apply: (data) => {
        console.log(
          "Starting complete transformation with",
          data.length,
          "records"
        );

        // Step 1: Clean and standardize all values
        let result = data.map((row) => {
          const cleanedRow = {};
          columns.forEach((col) => {
            const type = types[col];
            cleanedRow[col] = cleanDataValue(row[col], type);
          });
          return cleanedRow;
        });
        console.log("After cleaning:", result.length, "records");

        // Step 2: Remove duplicates
        result = result.filter(
          (row, index, self) =>
            index ===
            self.findIndex((r) => JSON.stringify(r) === JSON.stringify(row))
        );
        console.log("After deduplication:", result.length, "records");

        // Step 3: Remove incomplete records (less than 70% complete)
        result = result.filter((row) => {
          const nonNullValues = Object.values(row).filter(
            (v) => v !== null && v !== ""
          );
          return nonNullValues.length / columns.length >= 0.7;
        });
        console.log("After removing incomplete:", result.length, "records");

        // Step 4: Add quality metrics
        result = result.map((row, index) => ({
          ...row,
          record_id: index + 1,
          data_quality_score: Math.round(
            (Object.values(row).filter((v) => v !== null && v !== "").length /
              columns.length) *
              100
          ),
          processed_date: isClient ? new Date().toISOString().split("T")[0] : "YYYY-MM-DD",
        }));

        console.log("Final result:", result.length, "records");
        return result;
      },
    };

    return transformations;
  }, [isClient]);

  // Update transformations when data changes (but not when AI analysis is available)
  useEffect(() => {
    const structure = analyzeDataStructure(data);
    setDataStructure(structure);

    // Only use frontend detection if no AI context is already set
    if (!dataContext || !dataContext.aiPowered) {
      const context = detectDataContext(data, structure);
      setDataContext(context);
    }

    const transformations = generateTransformations(structure, dataContext || detectDataContext(data, structure));
    setAvailableTransformations(transformations);

    // Set default transformation
    if (
      Object.keys(transformations).length > 0 &&
      !transformations[selectedTransformation]
    ) {
      setSelectedTransformation(Object.keys(transformations)[0]);
    }
  }, [
    data,
    dataContext,
    analyzeDataStructure,
    detectDataContext,
    generateTransformations,
    selectedTransformation,
  ]);

  const processFile = useCallback(async (file) => {
    if (file && (file.type === "text/csv" || file.name.endsWith(".csv"))) {
      setIsProcessing(true);

      try {
        const csvData = await file.text();

        // Use AI-powered analysis API
        const response = await fetch("/api/analyze-csv", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            csvData,
            fileName: file.name,
            fileSize: file.size,
          }),
        });

        const result = await response.json();

        if (!result.success) {
          alert(result.error || "Failed to analyze CSV file");
          return;
        }

        // Set the analyzed data
        setData(result.sampleData);
        setCurrentStep(0);
        setTransformedData(null);

        // Store full CSV data for processing
        window.fullCSVData = csvData;

        // Update UI with AI analysis results
        if (result.analysis) {
          const aiContext = {
            ...result.analysis.dataContext,
            title:
              result.analysis.dataContext.title ||
              result.analysis.dataContext.specificType ||
              `${result.analysis.dataContext.icon} ${
                (result.analysis.dataContext.generalType || result.analysis.dataContext.type || 'Data').charAt(0).toUpperCase() +
                (result.analysis.dataContext.generalType || result.analysis.dataContext.type || 'Data').slice(1)
              } Data Detected`,
            suggestions: result.analysis.cleaningSuggestions,
            insights: result.analysis.insights,
            businessValue: result.analysis.businessValue,
            aiPowered: result.analysis.aiPowered,
          };

          console.log('🎯 Setting AI Context in Frontend:', aiContext);
          console.log('🎯 AI Context Title:', aiContext.title);
          console.log('🎯 AI Context Icon:', aiContext.icon);
          console.log('🎯 AI Context Specific Type:', aiContext.specificType);
          
          setDataContext(aiContext);

          // Generate AI-enhanced transformations
          const enhancedTransformations = generateAITransformations(
            result.analysis
          );
          setAvailableTransformations(enhancedTransformations);

          // Store analysis for AI cleaning
          window.aiAnalysis = result.analysis;
        }

        console.log(`✅ Successfully analyzed ${result.fileInfo.name}:`);
        console.log(
          `📊 ${result.fileInfo.rows} rows, ${result.fileInfo.columns} columns`
        );
        console.log(
          `🎯 Dataset: ${
            result.analysis.dataContext.specificType ||
            result.analysis.dataContext.title
          } (${result.analysis.dataContext.confidence}% confidence)`
        );
        console.log(
          `📈 Quality Score: ${result.analysis.qualityMetrics.overall}%`
        );

        // Show AI-powered badge if using real AI
        if (result.analysis.aiPowered) {
          console.log("🤖 Powered by Google Gemini AI");
        } else {
          console.log("🔧 Using smart rule-based detection");
          if (result.analysis.fallbackUsed) {
            console.log("⚠️ AI analysis failed:", result.analysis.error);
          }
        }

        // Debug: Show what columns were detected
        console.log("🔍 Detected columns:", result.headers.join(", "));
        console.log(
          "🔍 Analysis method:",
          result.analysis.aiPowered ? "Gemini AI" : "Rule-based"
        );
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Error processing CSV file. Please try again.");
      } finally {
        setIsProcessing(false);
      }
    } else {
      alert("Please upload a valid CSV file");
    }
  }, [generateAITransformations]);

  const handleFileUpload = useCallback(
    (event) => {
      const file = event.target.files[0];
      if (file) {
        processFile(file);
      }
    },
    [processFile]
  );

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      const csvFile = files.find(
        (file) => file.type === "text/csv" || file.name.endsWith(".csv")
      );

      if (csvFile) {
        processFile(csvFile);
      } else {
        alert("Please drop a valid CSV file");
      }
    },
    [processFile]
  );

  const runETLPipeline = async () => {
    setIsProcessing(true);
    setCurrentStep(0);
    setTransformedData(null);

    try {
      // Simulate Data Lakehouse pipeline: Bronze → Silver → Gold
      for (let step = 0; step < dataLakehouseLayers.length; step++) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setCurrentStep(step + 1);

        if (step === dataLakehouseLayers.length - 1) {
          // Use processing with AI-enhanced fallback
          if (window.fullCSVData) {
            let processingSuccess = false;

            // Try AI cleaning for AI-specific transformations
            if (window.aiAnalysis && selectedTransformation.includes("ai_")) {
              try {
                console.log("🤖 Attempting AI-powered cleaning...");

                const response = await fetch("/api/ai-clean-csv", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    csvData: window.fullCSVData,
                    dataContext: window.aiAnalysis.dataContext,
                    cleaningStrategy: selectedTransformation,
                    chunkSize: 1000,
                  }),
                });

                const result = await response.json();

                if (result.success) {
                  setTransformedData(result.data);
                  console.log("🎯 AI Cleaning Complete:");
                  console.log(
                    `📊 ${result.cleaningStats.originalRows} → ${result.cleaningStats.processedRows} rows`
                  );
                  console.log(
                    `🧹 ${result.cleaningStats.cleanedValues} values cleaned`
                  );
                  processingSuccess = true;
                } else {
                  console.log("AI cleaning failed, using standard processing");
                }
              } catch (aiError) {
                console.log(
                  "AI cleaning error, using standard processing:",
                  aiError.message
                );
              }
            }

            // Use standard processing if AI failed or not selected
            if (!processingSuccess) {
              console.log("🚀 Processing with standard API...");

              const response = await fetch("/api/process-csv", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  csvData: window.fullCSVData,
                  transformation: selectedTransformation,
                  chunkSize: 1000,
                }),
              });

              const result = await response.json();

              if (result.success) {
                setTransformedData(result.data);
                console.log(
                  `✅ Processed ${result.originalRows} → ${result.processedRows} rows`
                );
              } else {
                throw new Error(result.error || "Processing failed");
              }
            }
          } else {
            // Fallback to local processing for small files
            const transformation =
              availableTransformations[selectedTransformation];
            if (transformation) {
              const result = transformation.apply(data);
              setTransformedData(result);
            }
          }
        }
      }
    } catch (error) {
      console.error("ETL Pipeline error:", error);
      alert("Processing failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Generate AI-enhanced transformations based on Gemini analysis
  const generateAITransformations = useCallback((analysis) => {
    const baseTransformations = {
      ai_smart_clean: {
        name: "🤖 AI Smart Cleaning",
        description: analysis.aiPowered
          ? `Gemini-powered cleaning for ${analysis.dataContext.type} data`
          : `Smart cleaning based on ${analysis.dataContext.type} patterns`,
        apply: (data) => data, // Processing happens in AI API
      },
      ai_complete_clean: {
        name: "✨ Complete AI Pipeline",
        description: analysis.technicalRecommendations?.bestTransformation
          ? `${analysis.technicalRecommendations.bestTransformation} (AI recommended)`
          : `Full AI-optimized transformation for ${analysis.dataContext.type}`,
        apply: (data) => data,
      },
      remove_duplicates: {
        name: "🗑️ Remove Duplicates",
        description: "Eliminate exact duplicate records with AI validation",
        apply: (data) => data,
      },
      handle_missing: {
        name: "🔧 Smart Missing Value Handling",
        description: "AI-guided imputation based on data patterns and context",
        apply: (data) => data,
      },
      standardize_text: {
        name: "📝 Intelligent Text Standardization",
        description:
          "Context-aware text cleaning (preserves URLs, emails, important patterns)",
        apply: (data) => data,
      },
      remove_outliers: {
        name: "📊 Statistical Outlier Detection",
        description: "AI-enhanced outlier detection with business logic",
        apply: (data) => data,
      },
    };

    // Add industry-specific transformations based on AI analysis
    const contextType = analysis.dataContext.type;

    if (contextType === "ecommerce") {
      baseTransformations.ecommerce_optimize = {
        name: "🛒 E-commerce Data Optimization",
        description:
          "Clean product names, standardize prices, validate customer data",
        apply: (data) => data,
      };
    } else if (contextType === "financial") {
      baseTransformations.financial_clean = {
        name: "💰 Financial Data Standardization",
        description:
          "Currency normalization, amount validation, account formatting",
        apply: (data) => data,
      };
    } else if (contextType === "hr") {
      baseTransformations.hr_standardize = {
        name: "👥 HR Data Standardization",
        description:
          "Employee name formatting, salary standardization, department cleanup",
        apply: (data) => data,
      };
    } else if (contextType === "marketing") {
      baseTransformations.marketing_clean = {
        name: "📊 Marketing Analytics Cleanup",
        description:
          "Campaign standardization, metric validation, traffic filtering",
        apply: (data) => data,
      };
    } else if (contextType === "geographic") {
      baseTransformations.geo_standardize = {
        name: "🌍 Geographic Data Standardization",
        description:
          "Location normalization, coordinate validation, address formatting",
        apply: (data) => data,
      };
    }

    return baseTransformations;
  }, []);
  const generateEnhancedTransformations = useCallback((analysis) => {
    const transformations = {
      clean_data: {
        name: "🧹 AI-Powered Data Cleaning",
        description: `Smart cleaning based on ${analysis.dataContext.type} data patterns`,
        apply: (data) => data, // Placeholder - actual processing happens in API
      },
      remove_duplicates: {
        name: "🗑️ Remove Duplicates",
        description: "Eliminate exact duplicate records",
        apply: (data) => data,
      },
      handle_missing: {
        name: "🔧 Handle Missing Values",
        description:
          "Intelligent imputation based on column types and patterns",
        apply: (data) => data,
      },
      standardize_text: {
        name: "📝 Standardize Text",
        description:
          "Clean and normalize text formatting (preserves URLs/emails)",
        apply: (data) => data,
      },
      remove_outliers: {
        name: "📊 Remove Statistical Outliers",
        description: "Remove extreme values using IQR method",
        apply: (data) => data,
      },
      complete_clean: {
        name: "✨ Complete AI Transformation",
        description: `Full pipeline optimized for ${analysis.dataContext.type} data`,
        apply: (data) => data,
      },
    };

    // Add context-specific transformations
    if (analysis.dataContext.type === "ecommerce") {
      transformations.ecommerce_clean = {
        name: "🛒 E-commerce Optimization",
        description: "Clean product names, prices, and customer data",
        apply: (data) => data,
      };
    }

    if (analysis.dataContext.type === "financial") {
      transformations.financial_clean = {
        name: "💰 Financial Data Cleaning",
        description: "Standardize currencies, amounts, and account formats",
        apply: (data) => data,
      };
    }

    return transformations;
  }, []);

  const downloadCSV = () => {
    if (!transformedData || transformedData.length === 0) return;

    const headers = Object.keys(transformedData[0]);

    // Properly escape CSV values
    const escapeCSVValue = (value) => {
      if (value === null || value === undefined) return "";
      const stringValue = String(value);
      // If value contains comma, quote, or newline, wrap in quotes and escape internal quotes
      if (
        stringValue.includes(",") ||
        stringValue.includes('"') ||
        stringValue.includes("\n")
      ) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const csv = [
      headers.map(escapeCSVValue).join(","),
      ...transformedData.map((row) =>
        headers.map((h) => escapeCSVValue(row[h])).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cleaned_data_${selectedTransformation}_${
      new Date().toISOString().split("T")[0]
    }.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadExcel = () => {
    if (!transformedData || transformedData.length === 0) return;

    const headers = Object.keys(transformedData[0]);

    // Create proper Excel XML format that preserves data integrity
    const excelXML = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>Cleaned Data Export</Title>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <ExcelWorkbook xmlns="urn:schemas-microsoft-com:office:excel">
  <WindowHeight>13020</WindowHeight>
  <WindowWidth>25600</WindowWidth>
  <ProtectStructure>False</ProtectStructure>
  <ProtectWindows>False</ProtectWindows>
 </ExcelWorkbook>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Bottom"/>
   <Font ss:FontName="Arial" ss:Size="10"/>
  </Style>
  <Style ss:ID="Header">
   <Alignment ss:Horizontal="Center" ss:Vertical="Bottom"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
   <Font ss:FontName="Arial" ss:Size="10" ss:Bold="1"/>
   <Interior ss:Color="#E0E0E0" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="Data">
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1"/>
   </Borders>
  </Style>
 </Styles>
 <Worksheet ss:Name="Cleaned Data">
  <Table ss:ExpandedColumnCount="${headers.length}" ss:ExpandedRowCount="${
      transformedData.length + 1
    }">
   <Row>
    ${headers
      .map(
        (header) =>
          `<Cell ss:StyleID="Header"><Data ss:Type="String">${header
            .replace(/_/g, " ")
            .replace(/\b\w/g, (l) => l.toUpperCase())
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")}</Data></Cell>`
      )
      .join("")}
   </Row>
   ${transformedData
     .map(
       (row) =>
         `<Row>
      ${headers
        .map((header) => {
          const value = row[header];
          if (value === null || value === undefined) {
            return `<Cell ss:StyleID="Data"><Data ss:Type="String"></Data></Cell>`;
          }

          const stringValue = String(value);
          const dataType = typeof value === "number" ? "Number" : "String";
          const escapedValue = stringValue
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;");

          return `<Cell ss:StyleID="Data"><Data ss:Type="${dataType}">${escapedValue}</Data></Cell>`;
        })
        .join("")}
     </Row>`
     )
     .join("")}
  </Table>
 </Worksheet>
</Workbook>`;

    // Use Excel XML format with proper MIME type
    const blob = new Blob([excelXML], {
      type: "application/vnd.ms-excel;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cleaned_data_${selectedTransformation}_${
      new Date().toISOString().split("T")[0]
    }.xls`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-200 dark:border-gray-700">
      <div className="text-center mb-8">
        <motion.h3
          className="text-3xl font-bold mb-4 bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark bg-clip-text text-transparent"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Modern Data Lakehouse Pipeline
        </motion.h3>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Experience production-grade data engineering with Bronze → Silver →
          Gold architecture. Transform raw data through Apache Spark ETL
          processes, Delta Lake storage, and cloud-native patterns used by
          Netflix, Uber, and other tech giants.
        </p>
      </div>

      {/* Data Input Section */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <motion.div
          className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6"
          whileHover={{ scale: 1.02 }}
        >
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Upload className="w-5 h-5 text-primary-light dark:text-primary-dark" />
            Upload CSV File
          </h4>

          {/* Drag & Drop Area */}
          <div
            className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
              isDragOver
                ? "border-primary-light bg-primary-light/10 dark:border-primary-dark dark:bg-primary-dark/10"
                : "border-gray-300 dark:border-gray-600 hover:border-primary-light dark:hover:border-primary-dark"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />

            <div className="space-y-4">
              <motion.div
                animate={{ scale: isDragOver ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                <Upload
                  className={`w-12 h-12 mx-auto ${
                    isDragOver
                      ? "text-primary-light dark:text-primary-dark"
                      : "text-gray-400 dark:text-gray-500"
                  }`}
                />
              </motion.div>

              <div>
                <p
                  className={`text-lg font-semibold ${
                    isDragOver
                      ? "text-primary-light dark:text-primary-dark"
                      : "text-gray-700 dark:text-gray-300"
                  }`}
                >
                  {isDragOver
                    ? "Drop your CSV file here"
                    : "Drag & drop your CSV file here"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                  or click to browse files
                </p>
              </div>

              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="outline"
                size="sm"
                className="mt-4"
              >
                <FileText className="w-4 h-4 mr-2" />
                Browse Files
              </Button>
            </div>
          </div>

          <div className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
            or use sample employee data ({data.length} records)
          </div>
        </motion.div>

        <motion.div
          className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6"
          whileHover={{ scale: 1.02 }}
        >
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary-light dark:text-primary-dark" />
            Data Cleaning Operation
          </h4>
          <select
            value={selectedTransformation}
            onChange={(e) => setSelectedTransformation(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          >
            {Object.entries(availableTransformations).map(
              ([key, transform]) => (
                <option key={key} value={key}>
                  {transform.name}
                </option>
              )
            )}
          </select>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {availableTransformations[selectedTransformation]?.description ||
              "Select a cleaning operation"}
          </p>
        </motion.div>
      </div>

      {/* Smart Context Detection - Show immediately after upload */}
      {dataContext && (
        <motion.div
          className="mb-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-purple-800 dark:text-purple-300 flex items-center gap-2">
              <span className="text-2xl">{dataContext.icon}</span>
              {dataContext.specificType || dataContext.title}
            </h4>
            {dataContext.aiPowered && (
              <div className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                <span>🤖</span>
                <span>AI Powered</span>
              </div>
            )}
          </div>
          {dataContext.description && (
            <p className="text-purple-700 dark:text-purple-300 mb-4 text-sm">
              {dataContext.description}
            </p>
          )}
          {dataContext.confidence && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs text-purple-600 dark:text-purple-400 mb-1">
                <span>Detection Confidence</span>
                <span>{dataContext.confidence}%</span>
              </div>
              <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${dataContext.confidence}%` }}
                ></div>
              </div>
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h5 className="font-semibold text-purple-700 dark:text-purple-300 mb-3 flex items-center gap-2">
                💡 Recommended Cleaning Steps
              </h5>
              <div className="space-y-2">
                {dataContext.suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-purple-200 dark:border-purple-600 shadow-sm"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="text-sm text-purple-600 dark:text-purple-400 flex items-start gap-2">
                      <span className="text-purple-500 font-bold">•</span>
                      <span>{suggestion}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-purple-200 dark:border-purple-600">
              <h5 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                📊 Data Structure
              </h5>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {dataStructure?.columns.length || 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Columns
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    {dataStructure
                      ? Object.values(dataStructure.types).filter(
                          (t) => t === "numeric"
                        ).length
                      : 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Numeric
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {dataStructure
                      ? Object.values(dataStructure.types).filter(
                          (t) => t === "text"
                        ).length
                      : 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Text
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    {dataStructure
                      ? Object.values(dataStructure.types).filter(
                          (t) => t === "date"
                        ).length
                      : 0}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Dates
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Data Preview Section */}
      {data && data.length > 0 && (
        <motion.div
          className="mb-8 bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h4 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-300 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Raw Data Preview ({data.length} records)
          </h4>

          <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    {Object.keys(data[0])
                      .slice(0, 6)
                      .map((header) => (
                        <th
                          key={header}
                          className="px-4 py-3 text-left font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600"
                        >
                          {header
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </th>
                      ))}
                    {Object.keys(data[0]).length > 6 && (
                      <th className="px-4 py-3 text-left font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-600">
                        +{Object.keys(data[0]).length - 6} more
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                  {data.slice(0, 3).map((row, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      {Object.entries(row)
                        .slice(0, 6)
                        .map(([key, value], i) => (
                          <td
                            key={i}
                            className="px-4 py-3 text-gray-600 dark:text-gray-300"
                          >
                            <div className="max-w-32 truncate">
                              {typeof value === "number" ? (
                                <span className="font-mono text-blue-600 dark:text-blue-400">
                                  {formatNumber(value)}
                                </span>
                              ) : (
                                <span title={String(value)}>
                                  {String(value).length > 20
                                    ? String(value).substring(0, 20) + "..."
                                    : String(value)}
                                </span>
                              )}
                            </div>
                          </td>
                        ))}
                      {Object.keys(row).length > 6 && (
                        <td className="px-4 py-3 text-gray-400 dark:text-gray-500">
                          ...
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {data.length > 3 && (
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600 text-center text-sm text-gray-500 dark:text-gray-400">
                ... and {data.length - 3} more records
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Data Lakehouse Architecture Visualization */}
      <div className="mb-8">
        <div className="text-center mb-8">
          <h4 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">
            Modern Data Lakehouse Pipeline
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            Bronze → Silver → Gold Architecture with Apache Spark & Delta Lake
          </p>
        </div>

        {/* Apache Airflow DAG Style Pipeline */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-gray-200 dark:border-gray-700 shadow-lg mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                DAG: data_lakehouse_pipeline
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Schedule: @daily</span>
              <span>•</span>
              <span>Owner: data_team</span>
            </div>
          </div>

          <div className="flex items-center justify-center">
            {dataLakehouseLayers.map((layer, index) => (
              <div key={layer.id} className="flex items-center">
                {/* Airflow Task Node */}
                <div className="flex flex-col items-center">
                  <motion.div
                    className={`relative border-2 rounded-lg p-4 w-52 h-48 flex flex-col justify-center transition-all duration-500 ${
                      currentStep > index
                        ? currentStep === index + 1 && isProcessing
                          ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 shadow-lg"
                          : "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-lg"
                        : "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
                    }`}
                    animate={{
                      scale:
                        currentStep === index + 1 && isProcessing
                          ? [1, 1.02, 1]
                          : 1,
                    }}
                    transition={{
                      duration: 1,
                      repeat:
                        currentStep === index + 1 && isProcessing
                          ? Infinity
                          : 0,
                    }}
                  >
                    {/* Task Status Indicator */}
                    <div className="absolute -top-2 -right-2">
                      {currentStep > index ? (
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-white" />
                        </div>
                      ) : currentStep === index + 1 && isProcessing ? (
                        <motion.div
                          className="w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center"
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </motion.div>
                      ) : (
                        <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>

                    {/* Task Icon and Info */}
                    <div className="text-center flex-grow flex flex-col justify-between">
                      <div className="flex-grow flex flex-col justify-center">
                        <layer.icon
                          className={`w-10 h-10 mx-auto mb-3 ${
                            currentStep > index
                              ? "text-green-600 dark:text-green-400"
                              : currentStep === index + 1 && isProcessing
                              ? "text-yellow-600 dark:text-yellow-400"
                              : "text-gray-400"
                          }`}
                        />
                        <div
                          className={`text-sm font-bold mb-2 ${
                            currentStep > index
                              ? "text-green-800 dark:text-green-300"
                              : currentStep === index + 1 && isProcessing
                              ? "text-yellow-800 dark:text-yellow-300"
                              : "text-gray-600 dark:text-gray-400"
                          }`}
                        >
                          {layer.id}_task
                        </div>
                        <div
                          className={`text-xs mb-2 ${
                            currentStep > index
                              ? "text-green-700 dark:text-green-400"
                              : currentStep === index + 1 && isProcessing
                              ? "text-yellow-700 dark:text-yellow-400"
                              : "text-gray-500 dark:text-gray-500"
                          }`}
                        >
                          {layer.stage}
                        </div>
                        <div
                          className={`text-xs font-mono leading-relaxed px-2 text-center break-words ${
                            currentStep > index
                              ? "text-blue-600 dark:text-blue-400"
                              : currentStep === index + 1 && isProcessing
                              ? "text-blue-600 dark:text-blue-400"
                              : "text-gray-400 dark:text-gray-500"
                          }`}
                          style={{ minHeight: '2.5rem' }}
                        >
                          {layer.tech}
                        </div>
                      </div>

                      {/* Task Duration */}
                      <div className="mt-2">
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            currentStep > index
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                              : currentStep === index + 1 && isProcessing
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : "bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {currentStep > index
                            ? "✓ 2.1s"
                            : currentStep === index + 1 && isProcessing
                            ? "⏳ running"
                            : "⏸ queued"}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Airflow DAG Edge (Arrow) */}
                {index < dataLakehouseLayers.length - 1 && (
                  <div className="flex items-center mx-4">
                    <motion.div
                      className={`flex items-center transition-all duration-500`}
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: currentStep > index + 1 ? 1 : 0.3 }}
                    >
                      <div
                        className={`w-8 h-0.5 transition-all duration-500 ${
                          currentStep > index + 1
                            ? "bg-green-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                      />
                      <div
                        className={`w-0 h-0 border-l-4 border-t-2 border-b-2 border-t-transparent border-b-transparent transition-all duration-500 ${
                          currentStep > index + 1
                            ? "border-l-green-500"
                            : "border-l-gray-300 dark:border-l-gray-600"
                        }`}
                      />
                    </motion.div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* DAG Run Info */}
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
              <div className="flex items-center gap-4">
                <span>
                  Run ID: manual__{isClient ? new Date().toISOString().split("T")[0] : "YYYY-MM-DD"}
                </span>
                <span>Start: {isClient ? new Date().toLocaleTimeString() : "--:--:--"}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Success</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <span>Running</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Queued</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-6">
          <Button
            onClick={runETLPipeline}
            disabled={
              isProcessing || Object.keys(availableTransformations).length === 0
            }
            size="lg"
            className="bg-gradient-to-r from-primary-light to-accent-light hover:from-primary-light/90 hover:to-accent-light/90 text-white px-8 py-4"
          >
            {isProcessing ? (
              <>
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                Processing Lakehouse Pipeline...
              </>
            ) : (
              <>
                <Play className="w-5 h-5 mr-2" />
                Run Lakehouse Pipeline
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Results Section */}
      <AnimatePresence>
        {transformedData && transformedData.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-6 border border-green-200 dark:border-green-700"
          >
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-semibold text-green-800 dark:text-green-300 flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                Data Cleaning Complete!
              </h4>
              <div className="flex gap-2">
                <Button
                  onClick={downloadCSV}
                  variant="outline"
                  size="sm"
                  className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-800"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
                <Button
                  onClick={downloadExcel}
                  variant="outline"
                  size="sm"
                  className="border-green-300 text-green-700 hover:bg-green-100 dark:border-green-600 dark:text-green-300 dark:hover:bg-green-800"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download Excel
                </Button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 overflow-x-auto">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Cleaned Results
                  </h5>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Showing {Math.min(transformedData.length, 8)} of{" "}
                    {transformedData.length} results
                  </span>
                </div>

                <div className="overflow-hidden rounded-xl border border-gray-200 dark:border-gray-600">
                  <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        {Object.keys(transformedData[0]).map((header) => (
                          <th
                            key={header}
                            className="px-6 py-4 text-left text-sm font-semibold text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-600"
                          >
                            {header
                              .replace(/_/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase())}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                      {transformedData.slice(0, 8).map((row, index) => (
                        <motion.tr
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          {Object.entries(row).map(([key, value], i) => (
                            <td
                              key={i}
                              className="px-6 py-4 text-sm text-gray-600 dark:text-gray-300"
                            >
                              <div className="max-w-xs">
                                {typeof value === "number" ? (
                                  <span className="font-mono bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded text-blue-700 dark:text-blue-300">
                                    {formatNumber(value)}
                                  </span>
                                ) : typeof value === "string" &&
                                  value.length > 50 ? (
                                  <div className="group relative">
                                    <span className="cursor-help">
                                      {value.substring(0, 50)}...
                                    </span>
                                    <div className="invisible group-hover:visible absolute z-10 w-64 p-2 mt-1 text-xs bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg shadow-lg">
                                      {value}
                                    </div>
                                  </div>
                                ) : (
                                  <span
                                    className={`${
                                      typeof value === "string" &&
                                      value.includes("http")
                                        ? "text-blue-600 dark:text-blue-400 underline cursor-pointer"
                                        : ""
                                    }`}
                                  >
                                    {String(value)}
                                  </span>
                                )}
                              </div>
                            </td>
                          ))}
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {transformedData.length > 8 && (
                  <div className="text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                      <BarChart3 className="w-4 h-4" />
                      {transformedData.length - 8} more records available in
                      download
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pipeline Metrics */}
      <div className="mt-8 bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
        <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-primary-light dark:text-primary-dark" />
          Cleaning Pipeline Metrics
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary-light dark:text-primary-dark">
              {data.length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Input Records
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent-light dark:text-accent-dark">
              {transformedData?.length || 0}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Clean Records
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {transformedData && data.length > 0
                ? Math.round((transformedData.length / data.length) * 100)
                : 0}
              %
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Data Quality
            </div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {Object.keys(availableTransformations).length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Clean Options
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
