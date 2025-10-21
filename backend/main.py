from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from celery_worker import analyze_url_task, analyze_topic_task
import uuid
from database.crud import get_job_status, get_job_results
from database.models import create_tables

# Author: Parrosz
# Copyright (c) 2024 Parrosz. All Rights Reserved.

app = FastAPI(
    title="Hoaxalyzer API",
    version="1.0.0",
    description="Intelligent misinformation detection platform - Created by Parrosz"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize database tables
@app.on_event("startup")
async def startup_event():
    create_tables()

# Request models
class URLAnalysisRequest(BaseModel):
    url: str

class TopicAnalysisRequest(BaseModel):
    keyword: str

# Response models
class JobResponse(BaseModel):
    job_id: str
    status: str

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "Hoaxalyzer API", "author": "Parrosz"}

# Submit URL analysis
@app.post("/api/v1/analyze/url", response_model=JobResponse)
async def submit_url_analysis(request: URLAnalysisRequest):
    """
    Submit a single URL for analysis.
    
    The system will:
    1. Scrape the article content
    2. Preprocess the text
    3. Run sentiment analysis
    4. Run hoax classification
    5. Generate explainability report
    """
    try:
        job_id = str(uuid.uuid4())
        
        # Submit async task to Celery
        analyze_url_task.delay(job_id, request.url)
        
        return JobResponse(job_id=job_id, status="pending")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Submit topic analysis
@app.post("/api/v1/analyze/topic", response_model=JobResponse)
async def submit_topic_analysis(request: TopicAnalysisRequest):
    """
    Submit a topic/keyword for analysis.
    
    The system will:
    1. Crawl multiple sources (social media, news portals)
    2. Collect relevant articles/tweets
    3. Preprocess all texts
    4. Run sentiment analysis on each
    5. Run hoax classification on each
    6. Aggregate results
    7. Generate visualizations data
    """
    try:
        job_id = str(uuid.uuid4())
        
        # Submit async task to Celery
        analyze_topic_task.delay(job_id, request.keyword)
        
        return JobResponse(job_id=job_id, status="pending")
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Get job status and results
@app.get("/api/v1/results/{job_id}")
async def get_results(job_id: str):
    """
    Get the status and results of an analysis job.
    
    Returns:
    - job_id: The unique job identifier
    - status: pending, processing, completed, or failed
    - progress: Percentage completion (0-100)
    - results: Full analysis results (only when completed)
    """
    try:
        status_info = get_job_status(job_id)
        
        if not status_info:
            raise HTTPException(status_code=404, detail="Job not found")
        
        response = {
            "job_id": job_id,
            "status": status_info["status"],
            "progress": status_info.get("progress", 0)
        }
        
        if status_info["status"] == "completed":
            results = get_job_results(job_id)
            response["results"] = results
        
        return response
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)