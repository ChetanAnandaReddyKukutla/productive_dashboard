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

# Include API routes
app.include_router(auth.router)
app.include_router(project.router)
app.include_router(task.router)
app.include_router(comment.router)

# Serve static files (frontend) if they exist
static_dir = os.path.join(os.path.dirname(__file__), "..", "static")
if os.path.exists(static_dir):
    app.mount("/static", StaticFiles(directory=static_dir), name="static")
    
    @app.get("/")
    async def serve_frontend():
        """Serve the frontend index.html"""
        index_file = os.path.join(static_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"message": "Welcome to ProductiveBoards API"}
    
    @app.get("/{path:path}")
    async def serve_frontend_routes(path: str):
        """Serve frontend for all routes (SPA routing)"""
        # Check if it's an API route
        if path.startswith("api/") or path in ["docs", "redoc", "openapi.json", "health"]:
            return {"error": "Not found"}
        
        index_file = os.path.join(static_dir, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        return {"error": "Not found"}
else:
    @app.get("/")
    def read_root():
        return {"message": "Welcome to ProductiveBoards API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}