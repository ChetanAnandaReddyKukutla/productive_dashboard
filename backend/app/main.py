from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.database import Base, engine
from app.routes import auth, project, task, comment
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI(title="ProductiveBoards API", version="1.0.0")

origins = [
    "http://localhost:5173", 
    "http://localhost:3000",
    "http://localhost:5175",
    "https://*.onrender.com",
    "https://*.vercel.app",
    "https://*.netlify.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# Include API routes with /api prefix for clear separation
app.include_router(auth.router, prefix="/api/auth")
app.include_router(project.router, prefix="/api/projects")
app.include_router(task.router, prefix="/api/tasks")
app.include_router(comment.router, prefix="/api/comments")

# Health check endpoint
@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

# Serve static files (frontend) if they exist
static_dir = os.path.join(os.path.dirname(__file__), "..", "static")
if os.path.exists(static_dir):
    # Mount static files for assets with proper MIME types
    app.mount("/", StaticFiles(directory=static_dir, html=True), name="static")
else:
    @app.get("/")
    def read_root():
        return {"message": "Welcome to ProductiveBoards API - Frontend not built"}