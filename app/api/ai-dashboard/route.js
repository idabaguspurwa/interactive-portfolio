import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(request) {
  try {
    const { prompt, data, structure } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Google AI API key not configured');
    }

    // Create a more focused prompt for dashboard generation
    const enhancedPrompt = `You are a professional data analyst and dashboard designer. Based on the dataset provided, create a professional business dashboard structure.

Dataset Information:
- Columns: ${structure.columns.join(', ')}
- Data Types: ${Object.entries(structure.types).map(([col, type]) => `${col}(${type})`).join(', ')}
- Total Records: ${data.length}
- Sample Data: ${data.slice(0, 5).map(row => Object.entries(row).map(([key, value]) => `${key}: ${value}`).join(', ')).join('\n')}

Create a professional dashboard with:
1. A business-focused title (e.g., "E-commerce Performance Dashboard", "Sales Analytics Dashboard")
2. A subtitle describing what the dashboard shows
3. 3-4 key metrics that would be most important for business users
4. 3-4 chart types that would best visualize the data relationships
5. A business narrative explaining what insights this data reveals

Focus on creating a dashboard that tells a business story, not just shows data. Think about what executives and business users would want to see.

Return ONLY valid JSON in this exact format:
{
  "title": "Professional Dashboard Title",
  "subtitle": "Brief business description",
  "keyMetrics": [
    {"label": "Metric Name", "value": "calculated_value", "icon": "📊", "description": "Business meaning"}
  ],
  "charts": [
    {"type": "chart_type", "title": "Chart Title", "description": "What this shows", "dataColumns": ["col1", "col2"]}
  ],
  "story": "Business narrative and insights",
  "layout": "Dashboard organization description"
}

Chart types should be: bar_chart, pie_chart, line_chart, scatter_plot, area_chart, donut_chart, horizontal_bar, bubble_chart or heatmap.
Use meaningful business metrics like totals, averages, percentages, counts.
Make the dashboard professional and business-focused.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    let jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON found in AI response');
    }
    
    const dashboardStructure = JSON.parse(jsonMatch[0]);
    
    // Validate the structure
    if (!dashboardStructure.title || !dashboardStructure.keyMetrics || !dashboardStructure.charts) {
      throw new Error('Invalid dashboard structure from AI');
    }
    
    // Calculate actual metric values based on the data
    const calculatedMetrics = dashboardStructure.keyMetrics.map(metric => {
      // For now, return the metric as-is - the frontend will calculate actual values
      return metric;
    });
    
    const finalDashboard = {
      ...dashboardStructure,
      keyMetrics: calculatedMetrics
    };
    
    return Response.json(finalDashboard);
    
  } catch (error) {
    console.error('AI Dashboard generation error:', error);
    return Response.json(
      { error: 'Failed to generate AI dashboard', details: error.message },
      { status: 500 }
    );
  }
}
