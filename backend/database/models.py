from sqlalchemy import create_engine, Column, String, Integer, Float, DateTime, JSON, Text, Enum
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
import enum

DATABASE_URL = os.getenv('DATABASE_URL', 'postgresql://user:password@localhost:5432/hoaxalyzer')

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class AnalysisStatusEnum(enum.Enum):
    pending = 'pending'
    processing = 'processing'
    completed = 'completed'
    failed = 'failed'

class QueryTypeEnum(enum.Enum):
    url = 'url'
    topic = 'topic'

class AnalysisJobs(Base):
    __tablename__ = 'analysis_jobs'
    
    job_id = Column(String, primary_key=True)
    query_type = Column(Enum(QueryTypeEnum), nullable=False)
    query_input = Column(Text, nullable=False)
    status = Column(Enum(AnalysisStatusEnum), default=AnalysisStatusEnum.pending)
    progress = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

class AnalysisResults(Base):
    __tablename__ = 'analysis_results'
    
    result_id = Column(Integer, primary_key=True, autoincrement=True)
    job_id = Column(String, nullable=False, unique=True)
    results_data = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

def create_tables():
    """Create all database tables."""
    Base.metadata.create_all(bind=engine)

def get_db():
    """Get database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()