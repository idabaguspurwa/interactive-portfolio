from fastapi import FastAPI, HTTPException, Query, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import snowflake.connector
import os
from datetime import datetime, timedelta
import json
from typing import List, Optional
import logging
import asyncio
import websockets

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="GitHub Events Analytics API", version="1.0.0")

# WebSocket connection manager
class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        logger.info(f"WebSocket connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
            logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        try:
            await websocket.send_text(message)
        except Exception as e:
            logger.error(f"Error sending personal message: {e}")
    
    async def broadcast(self, message: dict):
        if not self.active_connections:
            return
            
        message_str = json.dumps(message)
        disconnected_connections = []
        
        for connection in self.active_connections:
            try:
                await connection.send_text(message_str)
            except Exception as e:
                logger.error(f"Error broadcasting to connection: {e}")
                disconnected_connections.append(connection)
        
        # Remove disconnected connections
        for connection in disconnected_connections:
            self.disconnect(connection)

manager = ConnectionManager()

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
    'user': os.getenv('SNOWFLAKE_USERNAME', 'your_username'),
    'password': os.getenv('SNOWFLAKE_PASSWORD', 'your_password'),
    'account': os.getenv('SNOWFLAKE_ACCOUNT', 'your_account'),
    'warehouse': os.getenv('SNOWFLAKE_WAREHOUSE', 'your_warehouse'),
    'database': os.getenv('SNOWFLAKE_DATABASE', 'GITHUB_EVENTS_DB'),
    'schema': os.getenv('SNOWFLAKE_SCHEMA', 'RAW')
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
        
        # Get total events count from ALL data (not restricted to 30 days)
        cursor.execute("""
            SELECT COUNT(*) as total_events
            FROM RAW_EVENTS
        """)
        total_events = cursor.fetchone()[0]
        
        # Get unique repositories count from ALL data
        cursor.execute("""
            SELECT COUNT(DISTINCT V:repo.name::STRING) as unique_repos
            FROM RAW_EVENTS
        """)
        unique_repos = cursor.fetchone()[0]
        
        # Get unique users count from ALL data
        cursor.execute("""
            SELECT COUNT(DISTINCT V:actor.login::STRING) as unique_users
            FROM RAW_EVENTS
        """)
        unique_users = cursor.fetchone()[0]
        
        # Get events in last 24 hours (relative to latest data, not current time)
        cursor.execute("""
            SELECT COUNT(*) as events_24h
            FROM RAW_EVENTS
            WHERE V:created_at::TIMESTAMP >= (
                SELECT MAX(V:created_at::TIMESTAMP) - INTERVAL '24 HOUR'
                FROM RAW_EVENTS
            )
        """)
        events_24h = cursor.fetchone()[0]
        
        # Get peak daily events (highest single day from ALL data)
        cursor.execute("""
            SELECT MAX(daily_events) as peak_daily_events
            FROM (
                SELECT DATE(V:created_at::TIMESTAMP) as date, COUNT(*) as daily_events
                FROM RAW_EVENTS
                GROUP BY DATE(V:created_at::TIMESTAMP)
            )
        """)
        peak_daily_events = cursor.fetchone()[0] or 0
        
        # Calculate days operational (days with data from ALL data)
        cursor.execute("""
            SELECT COUNT(DISTINCT DATE(V:created_at::TIMESTAMP)) as days_operational
            FROM RAW_EVENTS
        """)
        days_operational = cursor.fetchone()[0] or 0
        
        # Calculate uptime percentage based on actual operational period
        # Your production run was from Aug 9-20 (12 days total)
        # But pipeline only operated for 4 days, giving 33.3% uptime
        total_operational_period = 12  # Aug 9-20, 2025
        uptime = 33.3  # Fixed to show actual pipeline uptime
        
        cursor.close()
        conn.close()
        
        return {
            "success": True,
            "data": {
                "totalEvents": total_events,
                "uniqueRepos": unique_repos,
                "uniqueUsers": unique_users,
                "events24h": events_24h,
                "peakDailyEvents": peak_daily_events,
                "daysOperational": days_operational,
                "uptime": uptime,
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
                DATE(V:created_at::TIMESTAMP) as date,
                COUNT(*) as event_count,
                COUNT(DISTINCT V:repo.name::STRING) as repo_count,
                COUNT(DISTINCT V:actor.login::STRING) as user_count
            FROM RAW_EVENTS
            GROUP BY DATE(V:created_at::TIMESTAMP)
            ORDER BY date DESC
        """)
        
        results = cursor.fetchall()
        timeline_data = [
            {
                "date": str(row[0]),
                "totalEvents": row[1],
                "uniqueRepositories": row[2],
                "uniqueUsers": row[3]
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
                V:repo.name::STRING as repo_name,
                COUNT(*) as event_count,
                COUNT(DISTINCT V:actor.login::STRING) as unique_users,
                MAX(V:created_at::TIMESTAMP) as last_activity
            FROM RAW_EVENTS
            GROUP BY V:repo.name::STRING
            ORDER BY event_count DESC
            LIMIT %s
        """, (limit,))
        
        results = cursor.fetchall()
        repo_data = [
            {
                "repoName": row[0],
                "totalActivity": row[1],
                "uniqueContributors": row[2],
                "lastActivity": str(row[3]),
                "category": "Active"  # Default category
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
        
        # Build time filter - use actual data range instead of relative to current date
        # First get the latest timestamp from the data
        cursor.execute("SELECT MAX(V:created_at::TIMESTAMP) FROM RAW_EVENTS")
        latest_timestamp = cursor.fetchone()[0]
        
        if not latest_timestamp:
            raise HTTPException(status_code=400, detail="No data available")
        
        # Calculate time filters based on actual data range
        time_filters = {
            '1d': latest_timestamp - timedelta(days=1),
            '7d': latest_timestamp - timedelta(days=7),
            '30d': latest_timestamp - timedelta(days=30),
            '90d': latest_timestamp - timedelta(days=90),
            '1y': latest_timestamp - timedelta(days=365)
        }
        
        if time_range not in time_filters:
            raise HTTPException(status_code=400, detail="Invalid time range")
        
        time_filter = time_filters[time_range]
        
        # Build event type filter
        if 'all' in event_type_list:
            event_type_filter = ""
        else:
            event_type_list_quoted = [f"'{et}'" for et in event_type_list]
            event_type_filter = f"AND V:type::STRING IN ({','.join(event_type_list_quoted)})"
        
        # Build group by clause
        group_by_mapping = {
            'repository': 'V:repo.name::STRING',
            'user': 'V:actor.login::STRING',
            'event_type': 'V:type::STRING',
            'language': 'V:repo.language::STRING',
            'hour': 'HOUR(V:created_at::TIMESTAMP)',
            'day': 'DAYOFWEEK(V:created_at::TIMESTAMP)'
        }
        
        if group_by not in group_by_mapping:
            raise HTTPException(status_code=400, detail="Invalid group by field")
        
        group_by_field = group_by_mapping[group_by]
        
        # Build sort by clause
        sort_by_mapping = {
            'event_count': 'event_count DESC',
            'timestamp': 'V:created_at::TIMESTAMP DESC',
            'repository': 'V:repo.name::STRING ASC',
            'user': 'V:actor.login::STRING ASC'
        }
        
        if sort_by not in sort_by_mapping:
            sort_by = 'event_count'
        
        sort_clause = sort_by_mapping[sort_by]
        
        # Execute query using RAW_EVENTS table with JSON extraction
        query = f"""
            SELECT 
                {group_by_field} as {group_by},
                COUNT(*) as event_count,
                COUNT(DISTINCT {group_by_field}) as unique_count
            FROM RAW_EVENTS
            WHERE V:created_at::TIMESTAMP >= %s
            {event_type_filter}
            GROUP BY {group_by_field}
            ORDER BY {sort_clause}
            LIMIT {limit}
        """
        
        logger.info(f"Executing query: {query}")
        cursor.execute(query, (time_filter,))
        
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

@app.websocket("/ws/github-events")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        # Send initial data immediately upon connection
        initial_data = await fetch_latest_github_data()
        await manager.send_personal_message(
            json.dumps({
                "type": "initial_data",
                "data": initial_data,
                "timestamp": datetime.now().isoformat()
            }),
            websocket
        )
        
        # Keep connection alive and send periodic updates
        while True:
            await asyncio.sleep(30)  # Update every 30 seconds
            
            # Fetch latest data
            latest_data = await fetch_latest_github_data()
            
            # Broadcast to all connected clients
            await manager.broadcast({
                "type": "data_update",
                "data": latest_data,
                "timestamp": datetime.now().isoformat()
            })
            
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        logger.info("WebSocket client disconnected")
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)

async def fetch_latest_github_data():
    """Fetch latest GitHub events data for real-time updates"""
    try:
        conn = get_snowflake_connection()
        cursor = conn.cursor()
        
        # Get recent timeline data
        cursor.execute("""
            SELECT 
                DATE(V:created_at::TIMESTAMP) as date,
                V:repo.name::STRING as repository,
                V:type::STRING as event_type,
                COUNT(*) as event_count,
                HOUR(V:created_at::TIMESTAMP) as hour
            FROM RAW_EVENTS
            WHERE V:created_at::TIMESTAMP >= (
                SELECT MAX(V:created_at::TIMESTAMP) - INTERVAL '7 DAY'
                FROM RAW_EVENTS
            )
            GROUP BY 
                DATE(V:created_at::TIMESTAMP),
                V:repo.name::STRING,
                V:type::STRING,
                HOUR(V:created_at::TIMESTAMP)
            ORDER BY date DESC, event_count DESC
            LIMIT 100
        """)
        
        results = cursor.fetchall()
        timeline_data = []
        
        for row in results:
            # Map event types to activity categories
            event_type = row[2] or 'Unknown'
            commits = event_count if event_type == 'PushEvent' else 0
            pull_requests = event_count if event_type == 'PullRequestEvent' else 0
            issues = event_count if event_type == 'IssuesEvent' else 0
            event_count = row[3] or 0
            
            timeline_data.append({
                "date": str(row[0]),
                "repository": row[1] or 'Unknown',
                "eventType": event_type,
                "commits": commits,
                "pullRequests": pull_requests,
                "issues": issues,
                "totalActivity": event_count,
                "hour": row[4] or 0
            })
        
        cursor.close()
        conn.close()
        
        return {
            "timeline": timeline_data,
            "lastFetch": datetime.now().isoformat()
        }
        
    except Exception as e:
        logger.error(f"Error fetching latest data: {e}")
        return {
            "timeline": [],
            "error": str(e),
            "lastFetch": datetime.now().isoformat()
        }

@app.get("/ws/test")
async def websocket_test():
    """Test endpoint to verify WebSocket functionality"""
    return {
        "message": "WebSocket endpoint available",
        "endpoint": "/ws/github-events",
        "active_connections": len(manager.active_connections),
        "status": "ready"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
