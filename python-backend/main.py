from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import snowflake.connector
import os
from datetime import datetime, timedelta
import json
from typing import List, Optional
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="GitHub Events Analytics API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Snowflake connection configuration
SNOWFLAKE_CONFIG = {
    'user': os.getenv('SNOWFLAKE_USER', 'your_username'),
    'password': os.getenv('SNOWFLAKE_PASSWORD', 'your_password'),
    'account': os.getenv('SNOWFLAKE_ACCOUNT', 'your_account'),
    'warehouse': os.getenv('SNOWFLAKE_WAREHOUSE', 'your_warehouse'),
    'database': os.getenv('SNOWFLAKE_DATABASE', 'your_database'),
    'schema': os.getenv('SNOWFLAKE_SCHEMA', 'your_schema')
}

def get_snowflake_connection():
    """Get Snowflake connection with error handling"""
    try:
        conn = snowflake.connector.connect(**SNOWFLAKE_CONFIG)
        return conn
    except Exception as e:
        logger.error(f"Failed to connect to Snowflake: {e}")
        raise HTTPException(status_code=500, detail="Database connection failed")

@app.get("/")
async def root():
    return {"message": "GitHub Events Analytics API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

@app.get("/api/github-metrics")
async def get_github_metrics():
    """Get overall GitHub events metrics"""
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        
        # Get total events count
        cursor.execute("""
            SELECT COUNT(*) as total_events
            FROM github_events
            WHERE created_at >= DATEADD(day, -30, CURRENT_DATE())
        """)
        total_events = cursor.fetchone()[0]
        
        # Get unique repositories count
        cursor.execute("""
            SELECT COUNT(DISTINCT repo_name) as unique_repos
            FROM github_events
            WHERE created_at >= DATEADD(day, -30, CURRENT_DATE())
        """)
        unique_repos = cursor.fetchone()[0]
        
        # Get unique users count
        cursor.execute("""
            SELECT COUNT(DISTINCT actor_login) as unique_users
            FROM github_events
            WHERE created_at >= DATEADD(day, -30, CURRENT_DATE())
        """)
        unique_users = cursor.fetchone()[0]
        
        # Get events in last 24 hours
        cursor.execute("""
            SELECT COUNT(*) as events_24h
            FROM github_events
            WHERE created_at >= DATEADD(hour, -24, CURRENT_TIMESTAMP())
        """)
        events_24h = cursor.fetchone()[0]
        
        cursor.close()
        conn.close()
        
        return {
            "success": True,
            "data": {
                "totalEvents": total_events,
                "uniqueRepos": unique_repos,
                "uniqueUsers": unique_users,
                "events24h": events_24h,
                "lastUpdated": datetime.now().isoformat()
            }
        }
        
    except Exception as e:
        logger.error(f"Error fetching GitHub metrics: {e}")
        return {
            "success": False,
            "message": "Failed to fetch metrics",
            "error": str(e)
        }

@app.get("/api/github-timeline")
async def get_github_timeline():
    """Get GitHub events timeline data"""
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                DATE(created_at) as date,
                COUNT(*) as event_count,
                COUNT(DISTINCT repo_name) as repo_count,
                COUNT(DISTINCT actor_login) as user_count
            FROM github_events
            WHERE created_at >= DATEADD(day, -30, CURRENT_DATE())
            GROUP BY DATE(created_at)
            ORDER BY date DESC
            LIMIT 30
        """)
        
        results = cursor.fetchall()
        timeline_data = [
            {
                "date": str(row[0]),
                "eventCount": row[1],
                "repoCount": row[2],
                "userCount": row[3]
            }
            for row in results
        ]
        
        cursor.close()
        conn.close()
        
        return {
            "success": True,
            "data": timeline_data
        }
        
    except Exception as e:
        logger.error(f"Error fetching timeline data: {e}")
        return {
            "success": False,
            "message": "Failed to fetch timeline data",
            "error": str(e)
        }

@app.get("/api/github-repositories")
async def get_github_repositories(limit: int = Query(10, ge=1, le=100)):
    """Get top GitHub repositories by event count"""
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        
        cursor.execute("""
            SELECT 
                repo_name,
                COUNT(*) as event_count,
                COUNT(DISTINCT actor_login) as unique_users,
                MAX(created_at) as last_activity
            FROM github_events
            WHERE created_at >= DATEADD(day, -30, CURRENT_DATE())
            GROUP BY repo_name
            ORDER BY event_count DESC
            LIMIT %s
        """, (limit,))
        
        results = cursor.fetchall()
        repo_data = [
            {
                "repository": row[0],
                "eventCount": row[1],
                "uniqueUsers": row[2],
                "lastActivity": str(row[3])
            }
            for row in results
        ]
        
        cursor.close()
        conn.close()
        
        return {
            "success": True,
            "data": repo_data
        }
        
    except Exception as e:
        logger.error(f"Error fetching repository data: {e}")
        return {
            "success": False,
            "message": "Failed to fetch repository data",
            "error": str(e)
        }

@app.get("/api/query-executor")
async def execute_custom_query(
    event_types: str = Query(..., description="Comma-separated list of event types"),
    time_range: str = Query(..., description="Time range (1d, 7d, 30d, 90d, 1y)"),
    group_by: str = Query(..., description="Group by field"),
    limit: int = Query(50, ge=1, le=1000, description="Result limit"),
    sort_by: str = Query("event_count", description="Sort by field")
):
    """Execute custom queries on GitHub events data"""
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        
        # Parse event types
        event_type_list = [et.strip() for et in event_types.split(',')]
        
        # Build time filter
        time_filters = {
            '1d': 'DATEADD(day, -1, CURRENT_DATE())',
            '7d': 'DATEADD(day, -7, CURRENT_DATE())',
            '30d': 'DATEADD(day, -30, CURRENT_DATE())',
            '90d': 'DATEADD(day, -90, CURRENT_DATE())',
            '1y': 'DATEADD(year, -1, CURRENT_DATE())'
        }
        
        if time_range not in time_filters:
            raise HTTPException(status_code=400, detail="Invalid time range")
        
        time_filter = time_filters[time_range]
        
        # Build event type filter
        if 'all' in event_type_list:
            event_type_filter = ""
        else:
            event_type_list_quoted = [f"'{et}'" for et in event_type_list]
            event_type_filter = f"AND event_type IN ({','.join(event_type_list_quoted)})"
        
        # Build group by clause
        group_by_mapping = {
            'repository': 'repo_name',
            'user': 'actor_login',
            'event_type': 'event_type',
            'language': 'repo_language',
            'hour': 'HOUR(created_at)',
            'day': 'DAYOFWEEK(created_at)'
        }
        
        if group_by not in group_by_mapping:
            raise HTTPException(status_code=400, detail="Invalid group by field")
        
        group_by_field = group_by_mapping[group_by]
        
        # Build sort by clause
        sort_by_mapping = {
            'event_count': 'event_count DESC',
            'timestamp': 'created_at DESC',
            'repository': 'repo_name ASC',
            'user': 'actor_login ASC'
        }
        
        if sort_by not in sort_by_mapping:
            sort_by = 'event_count'
        
        sort_clause = sort_by_mapping[sort_by]
        
        # Execute query
        query = f"""
            SELECT 
                {group_by_field} as {group_by},
                COUNT(*) as event_count,
                COUNT(DISTINCT CASE WHEN {group_by_field} != {group_by_field} THEN NULL ELSE {group_by_field} END) as unique_count
            FROM github_events
            WHERE created_at >= {time_filter}
            {event_type_filter}
            GROUP BY {group_by_field}
            ORDER BY {sort_clause}
            LIMIT {limit}
        """
        
        logger.info(f"Executing query: {query}")
        cursor.execute(query)
        
        results = cursor.fetchall()
        
        # Format results based on group by field
        formatted_results = []
        for row in results:
            if group_by == 'hour':
                formatted_results.append({
                    "hour": row[0],
                    "event_count": row[1],
                    "unique_count": row[2]
                })
            elif group_by == 'day':
                day_names = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                formatted_results.append({
                    "day": day_names[row[0] - 1] if row[0] else 'Unknown',
                    "day_number": row[0],
                    "event_count": row[1],
                    "unique_count": row[2]
                })
            else:
                formatted_results.append({
                    group_by: row[0],
                    "event_count": row[1],
                    "unique_count": row[2]
                })
        
        cursor.close()
        conn.close()
        
        return {
            "success": True,
            "data": formatted_results,
            "metadata": {
                "query": {
                    "eventTypes": event_type_list,
                    "timeRange": time_range,
                    "groupBy": group_by,
                    "limit": limit,
                    "sortBy": sort_by
                },
                "resultCount": len(formatted_results),
                "executedAt": datetime.now().isoformat()
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error executing custom query: {e}")
        return {
            "success": False,
            "message": "Failed to execute query",
            "error": str(e)
        }

@app.post("/api/manual-query")
async def execute_manual_query(request: Request):
    """Execute manual queries submitted by users"""
    try:
        body = await request.json()
        query = body.get('query', '').strip()
        
        if not query:
            raise HTTPException(status_code=400, detail="Query is required")
        
        # Basic SQL injection prevention
        dangerous_keywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE', 'TRUNCATE']
        upper_query = query.upper()
        
        for keyword in dangerous_keywords:
            if keyword in upper_query:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Query contains forbidden keyword: {keyword}. Only SELECT queries are allowed."
                )
        
        # Ensure it's a SELECT query
        if not upper_query.startswith('SELECT'):
            raise HTTPException(
                status_code=400, 
                detail="Only SELECT queries are allowed for security reasons"
            )
        
        # Execute the manual query
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        
        logger.info(f"Executing manual query: {query}")
        cursor.execute(query)
        
        results = cursor.fetchall()
        columns = [desc[0] for desc in cursor.description]
        
        # Format results
        formatted_results = []
        for row in results:
            row_dict = {}
            for i, value in enumerate(row):
                row_dict[columns[i]] = value
            formatted_results.append(row_dict)
        
        cursor.close()
        conn.close()
        
        return {
            "success": True,
            "data": formatted_results,
            "metadata": {
                "query": query,
                "resultCount": len(formatted_results),
                "executedAt": datetime.now().isoformat()
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error executing manual query: {e}")
        return {
            "success": False,
            "message": "Failed to execute manual query",
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
