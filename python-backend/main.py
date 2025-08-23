from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import snowflake.connector
import os
from datetime import datetime
from typing import Optional
import json
import logging
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="GitHub Events API", version="1.0.0")

# CORS configuration for Vercel frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # Local development
        "https://*.vercel.app",   # Vercel deployments
        "https://idabaguspurwa.com",  # Replace with your actual domain
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)

# Snowflake configuration
SNOWFLAKE_CONFIG = {
    'account': os.getenv('SNOWFLAKE_ACCOUNT'),
    'user': os.getenv('SNOWFLAKE_USERNAME'),
    'password': os.getenv('SNOWFLAKE_PASSWORD'),
    'database': os.getenv('SNOWFLAKE_DATABASE'),
    'schema': os.getenv('SNOWFLAKE_SCHEMA'),
    'warehouse': os.getenv('SNOWFLAKE_WAREHOUSE'),
    'client_session_keep_alive': True,
    'ocsp_response_cache_filename': None,
    'insecure_mode': False,
    'network_timeout': 60,
    'login_timeout': 60,
}

# Debug: Log configuration (without password)
logger.info(f"🔧 Snowflake Config - Account: {SNOWFLAKE_CONFIG['account']}")
logger.info(f"🔧 Snowflake Config - User: {SNOWFLAKE_CONFIG['user']}")
logger.info(f"🔧 Snowflake Config - Database: {SNOWFLAKE_CONFIG['database']}")
logger.info(f"🔧 Snowflake Config - Schema: {SNOWFLAKE_CONFIG['schema']}")
logger.info(f"🔧 Snowflake Config - Warehouse: {SNOWFLAKE_CONFIG['warehouse']}")

def get_snowflake_connection():
    """Create a new Snowflake connection"""
    try:
        logger.info("🔄 Creating Snowflake connection...")
        conn = snowflake.connector.connect(**SNOWFLAKE_CONFIG)
        logger.info("✅ Snowflake connection successful")
        return conn
    except Exception as e:
        logger.error(f"❌ Failed to connect to Snowflake: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Database connection failed: {str(e)}")

def execute_query(sql: str, params: list = None):
    """Execute a SQL query and return results"""
    conn = None
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        
        logger.info(f"🔍 Executing query: {sql[:100]}...")
        start_time = datetime.now()
        
        cursor.execute(sql, params or [])
        results = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        
        duration = (datetime.now() - start_time).total_seconds() * 1000
        logger.info(f"✅ Query completed in {duration:.0f}ms ({len(results)} rows)")
        
        # Convert to list of dictionaries
        data = []
        for row in results:
            row_dict = {}
            for i, value in enumerate(row):
                row_dict[columns[i]] = value
            data.append(row_dict)
        
        return data
        
    except Exception as e:
        logger.error(f"❌ Query execution failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Query execution failed: {str(e)}")
    finally:
        if conn:
            conn.close()

@app.get("/")
async def root():
    return {"message": "GitHub Events API", "status": "running"}

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    try:
        # Test connection
        conn = get_snowflake_connection()
        conn.close()
        return {"status": "healthy", "timestamp": datetime.now().isoformat()}
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"status": "unhealthy", "error": str(e), "timestamp": datetime.now().isoformat()}
        )

@app.get("/api/github-metrics")
async def get_github_metrics():
    """Get comprehensive GitHub metrics with complex aggregations"""
    try:
        logger.info("📊 Fetching GitHub metrics from Snowflake...")
        start_time = datetime.now()
        
        # Execute complex parallel-style queries (Python handles this better than Promise.all)
        queries = [
            "SELECT COUNT(*) as total_events FROM RAW_EVENTS",
            "SELECT COUNT(DISTINCT V:actor.id) as unique_users FROM RAW_EVENTS",
            "SELECT COUNT(DISTINCT V:repo.id) as unique_repos FROM RAW_EVENTS",
            """
            SELECT MAX(daily_events) as peak_daily_events 
            FROM (
                SELECT DATE(V:created_at::timestamp) as event_date, COUNT(*) as daily_events 
                FROM RAW_EVENTS 
                GROUP BY DATE(V:created_at::timestamp)
            )
            """,
            "SELECT COUNT(DISTINCT DATE(V:created_at::timestamp)) as operational_days FROM RAW_EVENTS"
        ]
        
        results = []
        for sql in queries:
            result = execute_query(sql)
            results.append(result)
        
        # Extract metrics (updated field names for frontend compatibility)
        metrics = {
            "totalEvents": results[0][0]['TOTAL_EVENTS'] if results[0] else 0,
            "uniqueUsers": results[1][0]['UNIQUE_USERS'] if results[1] else 0,
            "uniqueRepos": results[2][0]['UNIQUE_REPOS'] if results[2] else 0,  # Fixed field name
            "peakDailyEvents": results[3][0]['PEAK_DAILY_EVENTS'] if results[3] else 0,
            "daysOperational": results[4][0]['OPERATIONAL_DAYS'] if results[4] else 0,  # Fixed field name
        }
        
        # Calculate additional metrics
        if metrics["daysOperational"] > 0:
            metrics["avgEventsPerDay"] = round(metrics["totalEvents"] / metrics["daysOperational"], 2)
            # Calculate uptime (assuming high availability for demo)
            metrics["uptime"] = min(99.9, round((metrics["daysOperational"] / (metrics["daysOperational"] + 0.1)) * 100, 1))
        else:
            metrics["avgEventsPerDay"] = 0
            metrics["uptime"] = 0
            
        duration = (datetime.now() - start_time).total_seconds() * 1000
        logger.info(f"✅ Metrics fetched successfully in {duration:.0f}ms")
        
        return {
            "success": True,
            "data": metrics,
            "timestamp": datetime.now().isoformat(),
            "queryTime": f"{duration:.0f}ms"
        }
        
    except Exception as e:
        logger.error(f"❌ Error fetching GitHub metrics: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch metrics: {str(e)}")

@app.get("/api/github-timeline")
async def get_github_timeline():
    """Get comprehensive timeline data with complex daily aggregations"""
    try:
        logger.info("📈 Fetching GitHub timeline from Snowflake...")
        start_time = datetime.now()
        
        sql = """
        SELECT 
            DATE(V:created_at::timestamp) as activity_date,
            COUNT(*) as total_events,
            COUNT(DISTINCT V:actor.id) as unique_users,
            COUNT(DISTINCT V:repo.id) as unique_repositories,
            COUNT(CASE WHEN V:type::string = 'PushEvent' THEN 1 END) as push_events,
            COUNT(CASE WHEN V:type::string = 'PullRequestEvent' THEN 1 END) as pull_request_events,
            COUNT(CASE WHEN V:type::string = 'IssuesEvent' THEN 1 END) as issue_events,
            COUNT(CASE WHEN V:type::string = 'CreateEvent' THEN 1 END) as create_events
        FROM RAW_EVENTS 
        GROUP BY DATE(V:created_at::timestamp)
        ORDER BY activity_date ASC
        """
        
        results = execute_query(sql)
        
        # Transform data
        timeline = []
        for row in results:
            timeline.append({
                "date": row['ACTIVITY_DATE'].isoformat() if row['ACTIVITY_DATE'] else None,
                "totalEvents": row['TOTAL_EVENTS'] or 0,
                "uniqueUsers": row['UNIQUE_USERS'] or 0,
                "uniqueRepositories": row['UNIQUE_REPOSITORIES'] or 0,
                "pushEvents": row['PUSH_EVENTS'] or 0,
                "pullRequestEvents": row['PULL_REQUEST_EVENTS'] or 0,
                "issueEvents": row['ISSUE_EVENTS'] or 0,
                "createEvents": row['CREATE_EVENTS'] or 0
            })
        
        # Calculate summary statistics
        total_events = sum(day['totalEvents'] for day in timeline)
        avg_events_per_day = round(total_events / len(timeline), 2) if timeline else 0
        peak_day = max(timeline, key=lambda x: x['totalEvents']) if timeline else None
        
        duration = (datetime.now() - start_time).total_seconds() * 1000
        logger.info(f"✅ Timeline fetched successfully ({len(timeline)} days) in {duration:.0f}ms")
        
        return {
            "success": True,
            "data": {
                "timeline": timeline,
                "totalDays": len(timeline),
                "dateRange": {
                    "start": timeline[0]['date'] if timeline else None,
                    "end": timeline[-1]['date'] if timeline else None
                },
                "summary": {
                    "totalEvents": total_events,
                    "avgEventsPerDay": avg_events_per_day,
                    "peakDay": peak_day
                }
            },
            "timestamp": datetime.now().isoformat(),
            "queryTime": f"{duration:.0f}ms"
        }
        
    except Exception as e:
        logger.error(f"❌ Error fetching GitHub timeline: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch timeline: {str(e)}")

@app.get("/api/github-repositories")
async def get_github_repositories(limit: int = 10):
    """Get comprehensive repository analytics with complex aggregations"""
    try:
        logger.info(f"🏆 Fetching top {limit} repositories from Snowflake...")
        start_time = datetime.now()
        
        sql = f"""
        SELECT 
            V:repo.name::string as repo_name,
            COUNT(*) as total_activity,
            COUNT(DISTINCT V:actor.id) as unique_contributors,
            COUNT(CASE WHEN V:type::string = 'PushEvent' THEN 1 END) as push_events,
            COUNT(CASE WHEN V:type::string = 'PullRequestEvent' THEN 1 END) as pull_request_events,
            COUNT(CASE WHEN V:type::string = 'IssuesEvent' THEN 1 END) as issue_events,
            COUNT(CASE WHEN V:type::string = 'CreateEvent' THEN 1 END) as create_events,
            COUNT(CASE WHEN V:type::string = 'WatchEvent' THEN 1 END) as watch_events,
            ROUND(COUNT(*) / COUNT(DISTINCT V:actor.id), 2) as activity_per_contributor,
            MIN(V:created_at::timestamp) as first_activity,
            MAX(V:created_at::timestamp) as last_activity
        FROM RAW_EVENTS 
        WHERE V:repo.name IS NOT NULL
        GROUP BY V:repo.name::string
        ORDER BY total_activity DESC
        LIMIT {limit}
        """
        
        results = execute_query(sql)
        
        # Transform data
        repositories = []
        for row in results:
            # Determine primary category based on activity
            categories = []
            if row['PUSH_EVENTS'] > 0:
                categories.append('Development')
            if row['PULL_REQUEST_EVENTS'] > 0:
                categories.append('Collaboration')
            if row['ISSUE_EVENTS'] > 0:
                categories.append('Issue Management')
            if row['WATCH_EVENTS'] > 0:
                categories.append('Community')
                
            repositories.append({
                "repoName": row['REPO_NAME'],
                "totalActivity": row['TOTAL_ACTIVITY'] or 0,
                "uniqueContributors": row['UNIQUE_CONTRIBUTORS'] or 0,
                "pushEvents": row['PUSH_EVENTS'] or 0,
                "pullRequestEvents": row['PULL_REQUEST_EVENTS'] or 0,
                "issueEvents": row['ISSUE_EVENTS'] or 0,
                "createEvents": row['CREATE_EVENTS'] or 0,
                "watchEvents": row['WATCH_EVENTS'] or 0,
                "activityPerContributor": float(row['ACTIVITY_PER_CONTRIBUTOR'] or 0),
                "firstActivity": row['FIRST_ACTIVITY'].isoformat() if row['FIRST_ACTIVITY'] else None,
                "lastActivity": row['LAST_ACTIVITY'].isoformat() if row['LAST_ACTIVITY'] else None,
                "categories": categories,
                "isActive": row['TOTAL_ACTIVITY'] > 10 if row['TOTAL_ACTIVITY'] else False
            })
        
        # Calculate summary
        total_repositories = len(repositories)
        total_activity = sum(repo['totalActivity'] for repo in repositories)
        avg_activity = round(total_activity / total_repositories, 2) if total_repositories > 0 else 0
        
        duration = (datetime.now() - start_time).total_seconds() * 1000
        logger.info(f"✅ Repositories fetched successfully ({total_repositories} repos) in {duration:.0f}ms")
        
        return {
            "success": True,
            "data": {
                "repositories": repositories,
                "summary": {
                    "totalRepositories": total_repositories,
                    "totalActivity": total_activity,
                    "avgActivityPerRepo": avg_activity,
                    "activeRepositories": sum(1 for repo in repositories if repo['isActive'])
                }
            },
            "timestamp": datetime.now().isoformat(),
            "queryTime": f"{duration:.0f}ms"
        }
        
    except Exception as e:
        logger.error(f"❌ Error fetching GitHub repositories: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch repositories: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
