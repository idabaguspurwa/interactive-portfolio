# GitHub Events FastAPI Backend

A high-performance Python FastAPI service that provides real-time GitHub events analytics through Snowflake data warehouse integration. This backend powers the interactive GitHub Events dashboard with enterprise-grade data processing capabilities.

## 🚀 Features

- **Real-time Data Processing**: Live GitHub events analytics with sub-second response times
- **Snowflake Integration**: Enterprise-grade data warehouse connectivity with optimized queries
- **RESTful API**: Clean, documented endpoints with automatic OpenAPI/Swagger documentation
- **Production Ready**: Health checks, error handling, logging, and monitoring
- **Scalable Architecture**: Containerized deployment with Docker support
- **Performance Optimized**: Connection pooling, query optimization, and caching strategies

## 🏗️ Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App  │───▶│  Python FastAPI  │───▶│   Snowflake     │
│   (Frontend)   │    │    (Backend)     │    │  Data Warehouse │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   GitHub API     │
                       │   (Data Source)  │
                       └──────────────────┘
```

## 📋 Prerequisites

- **Python**: 3.9+ (recommended: 3.11+)
- **Snowflake Account**: Active Snowflake instance with proper permissions
- **GitHub Access**: GitHub API access for data ingestion
- **Docker**: For containerized deployment (optional)

## 🛠️ Local Development

### 1. Clone and Setup

```bash
# Navigate to the backend directory
cd python-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows
venv\Scripts\activate
# macOS/Linux
source venv/bin/activate
```

### 2. Install Dependencies

```bash
# Install Python packages
pip install -r requirements.txt

# Verify installation
pip list
```

### 3. Environment Configuration

Create a `.env` file in the `python-backend` directory:

```env
# Snowflake Configuration
SNOWFLAKE_ACCOUNT=your_snowflake_account
SNOWFLAKE_USERNAME=your_snowflake_username
SNOWFLAKE_PASSWORD=your_snowflake_password
SNOWFLAKE_DATABASE=GITHUB_EVENTS_DB
SNOWFLAKE_SCHEMA=RAW
SNOWFLAKE_WAREHOUSE=COMPUTE_WH

# Optional: Logging Level
LOG_LEVEL=INFO
```

### 4. Start Development Server

```bash
# Start FastAPI with auto-reload
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Or use the Python script directly
python main.py
```

**API will be available at**: http://localhost:8000

### 5. API Documentation

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## 🧪 Testing

### Health Check

```bash
curl http://localhost:8000/health
```

### Test API Endpoints

```bash
# GitHub Metrics
curl http://localhost:8000/api/github-metrics

# GitHub Timeline
curl http://localhost:8000/api/github-timeline

# GitHub Repositories
curl http://localhost:8000/api/github-repositories?limit=10
```

### Load Testing

```bash
# Install locust for load testing
pip install locust

# Run load test
locust -f locustfile.py --host=http://localhost:8000
```

## 🚀 Deployment

### Deploy to Fly.io (No Credit Card Required)

#### 1. Install Fly CLI

```bash
# Windows (PowerShell)
iwr https://fly.io/install.ps1 -useb | iex

# macOS
brew install flyctl

# Linux
curl -L https://fly.io/install.sh | sh
```

#### 2. Authentication and Launch

```bash
# Login to Fly.io
fly auth login

# Launch your app
cd python-backend
fly launch

# Follow the prompts:
# - App name: github-events-backend
# - Region: Choose closest to you
# - Instance type: Shared CPU (free tier)
```

#### 3. Configure Environment Variables

```bash
# Set Snowflake secrets
fly secrets set SNOWFLAKE_ACCOUNT="your_snowflake_account"
fly secrets set SNOWFLAKE_USERNAME="your_snowflake_username"
fly secrets set SNOWFLAKE_PASSWORD="your_snowflake_password"
fly secrets set SNOWFLAKE_DATABASE="your_database_name"
fly secrets set SNOWFLAKE_SCHEMA="your_schema_name"
fly secrets set SNOWFLAKE_WAREHOUSE="your_warehouse_name"
```

#### 4. Deploy

```bash
fly deploy
```

**Your app will be available at**: `https://github-events-backend.fly.dev`

### Why Fly.io?

- ✅ **No credit card required** for free tier
- ✅ **Free tier includes**: 3 shared-cpu VMs, 3GB storage, 160GB bandwidth
- ✅ **Global deployment** with automatic CDN
- ✅ **Easy deployment** with Docker
- ✅ **Auto-scaling** and health checks
- ✅ **Perfect for Python FastAPI** applications

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `SNOWFLAKE_ACCOUNT` | Snowflake account identifier | ✅ | - |
| `SNOWFLAKE_USERNAME` | Snowflake username | ✅ | - |
| `SNOWFLAKE_PASSWORD` | Snowflake password | ✅ | - |
| `SNOWFLAKE_DATABASE` | Target database name | ✅ | - |
| `SNOWFLAKE_SCHEMA` | Target schema name | ✅ | - |
| `SNOWFLAKE_WAREHOUSE` | Compute warehouse name | ✅ | - |
| `LOG_LEVEL` | Logging level | ❌ | `INFO` |
| `PORT` | Server port | ❌ | `8000` |

### Docker Configuration

The service includes Docker support for easy containerization:

```dockerfile
# Build image
docker build -t github-events-backend .

# Run container
docker run -p 8000:8080 github-events-backend

# Run with environment variables
docker run -p 8000:8080 \
  -e SNOWFLAKE_ACCOUNT=your_account \
  -e SNOWFLAKE_USERNAME=your_username \
  github-events-backend
```

## 📊 API Endpoints

### Core Endpoints

| Endpoint | Method | Description | Parameters |
|----------|--------|-------------|------------|
| `/health` | GET | Health check endpoint | - |
| `/api/github-metrics` | GET | GitHub events metrics | - |
| `/api/github-timeline` | GET | GitHub events timeline | `limit`, `offset` |
| `/api/github-repositories` | GET | Repository analytics | `limit` |

### Response Format

All endpoints return consistent JSON responses:

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-01-01T00:00:00Z",
  "queryTime": "150ms"
}
```

### Error Handling

```json
{
  "success": false,
  "error": "Error description",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 🔍 Monitoring & Logging

### Health Checks

- **Endpoint**: `/health`
- **Response**: Service status and uptime
- **Monitoring**: Use for load balancer health checks

### Logging

- **Level**: Configurable via `LOG_LEVEL` environment variable
- **Format**: Structured JSON logging
- **Output**: Console and file logging support

### Performance Metrics

- **Query Response Time**: Tracked for all database operations
- **Connection Pool Status**: Monitor Snowflake connection health
- **Error Rates**: Track failed requests and database errors

## 🚨 Troubleshooting

### Common Issues

#### Connection Errors

```bash
# Check Snowflake connectivity
python -c "
import snowflake.connector
conn = snowflake.connector.connect(
    user='your_username',
    password='your_password',
    account='your_account',
    warehouse='your_warehouse'
)
print('Connection successful!')
conn.close()
"
```

#### Port Conflicts

```bash
# Check if port is in use
netstat -an | grep 8000

# Use different port
uvicorn main:app --host 0.0.0.0 --port 8001 --reload
```

#### Memory Issues

```bash
# Monitor memory usage
ps aux | grep python

# Check Docker memory limits
docker stats
```

### Debug Mode

```bash
# Enable debug logging
export LOG_LEVEL=DEBUG
uvicorn main:app --host 0.0.0.0 --port 8000 --reload --log-level debug
```

## 🔒 Security

### Best Practices

- **Environment Variables**: Never commit credentials to version control
- **Network Security**: Use HTTPS in production
- **Access Control**: Implement proper authentication for production use
- **Audit Logging**: Monitor all database access

### Production Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Health checks configured
- [ ] Monitoring and alerting set up
- [ ] Backup and recovery procedures
- [ ] Security scanning enabled

## 📈 Performance Optimization

### Database Optimization

- **Connection Pooling**: Efficient Snowflake connection management
- **Query Optimization**: Optimized SQL queries with proper indexing
- **Caching Strategy**: Implement Redis caching for frequently accessed data

### Application Optimization

- **Async Processing**: Non-blocking I/O operations
- **Response Compression**: Enable gzip compression
- **Rate Limiting**: Implement API rate limiting for production

## 🤝 Contributing

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

### Code Standards

- **Python**: Follow PEP 8 style guidelines
- **Type Hints**: Use type annotations for all functions
- **Documentation**: Add docstrings for all public functions
- **Testing**: Include unit tests for new features

## 📚 Resources

### Documentation

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Snowflake Connector for Python](https://docs.snowflake.com/en/developer-guide/python-connector/)
- [Fly.io Documentation](https://fly.io/docs/)

### Community

- [FastAPI Community](https://github.com/tiangolo/fastapi/discussions)
- [Snowflake Community](https://community.snowflake.com/)
- [Fly.io Community](https://community.fly.io/)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🙏 Acknowledgments

- **FastAPI Team**: For the excellent web framework
- **Snowflake**: For the powerful data warehouse platform
- **Fly.io**: For the generous free tier hosting
- **Open Source Community**: For inspiration and contributions

---

**Built with ❤️ using FastAPI and Python**

*For support and questions, please open an issue in the main repository.*
