from sqlalchemy.orm import Session
from database.models import AnalysisJobs, AnalysisResults, SessionLocal, AnalysisStatusEnum
from datetime import datetime
from typing import Dict, Optional

def get_session():
    """Get a database session."""
    return SessionLocal()

def create_analysis_job(job_id: str, query_type: str, query_input: str):
    """Create a new analysis job record."""
    db = get_session()
    try:
        job = AnalysisJobs(
            job_id=job_id,
            query_type=query_type,
            query_input=query_input,
            status=AnalysisStatusEnum.pending,
            progress=0
        )
        db.add(job)
        db.commit()
    finally:
        db.close()

def update_job_status(job_id: str, status: str, progress: int):
    """Update job status and progress."""
    db = get_session()
    try:
        job = db.query(AnalysisJobs).filter(AnalysisJobs.job_id == job_id).first()
        if job:
            job.status = AnalysisStatusEnum[status]
            job.progress = progress
            if status == 'completed':
                job.completed_at = datetime.utcnow()
            db.commit()
    finally:
        db.close()

def get_job_status(job_id: str) -> Optional[Dict]:
    """Get job status information."""
    db = get_session()
    try:
        job = db.query(AnalysisJobs).filter(AnalysisJobs.job_id == job_id).first()
        if not job:
            return None
        
        return {
            'job_id': job.job_id,
            'status': job.status.value,
            'progress': job.progress,
            'created_at': job.created_at.isoformat(),
            'completed_at': job.completed_at.isoformat() if job.completed_at else None,
        }
    finally:
        db.close()

def save_analysis_results(job_id: str, results: Dict):
    """Save analysis results."""
    db = get_session()
    try:
        result = AnalysisResults(
            job_id=job_id,
            results_data=results
        )
        db.add(result)
        db.commit()
    finally:
        db.close()

def get_job_results(job_id: str) -> Optional[Dict]:
    """Get job analysis results."""
    db = get_session()
    try:
        result = db.query(AnalysisResults).filter(AnalysisResults.job_id == job_id).first()
        if not result:
            return None
        return result.results_data
    finally:
        db.close()