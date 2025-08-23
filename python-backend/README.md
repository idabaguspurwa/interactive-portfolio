# GitHub Events FastAPI Backend

This is a Python FastAPI service that handles Snowflake connections for the GitHub Events dashboard.

## Local Development

### 1. Install Python Dependencies

```bash
cd python-backend
pip install -r requirements.txt
```

### 2. Set Environment Variables

Copy the `.env` file and update with your credentials:

- SNOWFLAKE_ACCOUNT=your_account
- SNOWFLAKE_USERNAME=your_username
- SNOWFLAKE_PASSWORD=your_password
- etc.

### 3. Run the FastAPI Server

```bash
# From python-backend directory
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at: http://localhost:8000

### 4. Test Endpoints

- Health check: http://localhost:8000/health
- Metrics: http://localhost:8000/api/github-metrics
- Timeline: http://localhost:8000/api/github-timeline
- Repositories: http://localhost:8000/api/github-repositories?limit=10

## Deployment to Render

### 1. Push to GitHub

Make sure all files are committed and pushed to your GitHub repository.

### 2. Create Render Service

1. Go to https://render.com
2. Connect your GitHub account
3. Create a new "Web Service"
4. Select your repository
5. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - **Root Directory**: `python-backend`

### 3. Set Environment Variables in Render

Add these environment variables in Render dashboard:

- SNOWFLAKE_ACCOUNT=your_snowflake_account
- SNOWFLAKE_USERNAME=your_snowflake_username
- SNOWFLAKE_PASSWORD=your_snowflake_password
- SNOWFLAKE_DATABASE=your_database_name
- SNOWFLAKE_SCHEMA=your_schema_name
- SNOWFLAKE_WAREHOUSE=your_warehouse_name

### 4. Update Next.js Configuration

Once deployed, update `lib/python-api.js` with your Render URL:

```javascript
const PYTHON_API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-app-name.onrender.com'  // Your actual Render URL
  : 'http://localhost:8000'
```

## Testing the Integration

### Test Python APIs (new)

- `/api/github-metrics-python`
- `/api/github-timeline-python`
- `/api/github-repositories-python`

### Compare with Original APIs

- `/api/github-metrics` (original Snowflake direct)
- `/api/github-timeline` (original Snowflake direct)
- `/api/github-repositories` (original Snowflake direct)

## Architecture

```
Next.js (Vercel) → FastAPI (Render) → Snowflake
```

## Benefits

- Reliable Snowflake connections via Python
- Keeps all complex queries intact
- Independent scaling
- Better error handling
- Robust connection pooling
