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
    "https://productive-dashboard.onrender.com",
    "https://*.onrender.com",
    "*",  # Allow all origins for now
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
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(project.router, prefix="/api/projects", tags=["Projects"])
app.include_router(task.router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(comment.router, prefix="/api/comments", tags=["Comments"])

# Health check endpoint
@app.get("/api/health")
def health_check():
    return {"status": "healthy"}

# Test endpoint
@app.get("/api/test")
def test_endpoint():
    return {"message": "API is working", "routes": "Check /docs for all routes"}

# Serve static files (frontend) if they exist
static_dir = os.path.join(os.path.dirname(__file__), "..", "static")
if os.path.exists(static_dir):
    # Serve API docs first before static files
    @app.get("/")
    async def serve_frontend():
        """Serve the frontend index.html"""
        index_file = os.path.join(static_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "Welcome to ProductiveBoards API - Frontend not built"}
    
    # Mount static files for other assets
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")
    app.mount("/static", StaticFiles(directory=static_dir), name="static")
else:
    @app.get("/")
    def read_root():
        return {"message": "Welcome to ProductiveBoards API - Frontend not built"}
