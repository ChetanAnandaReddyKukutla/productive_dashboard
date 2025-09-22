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
    # Mount static files at root for assets (CSS, JS, images)
    app.mount("/assets", StaticFiles(directory=os.path.join(static_dir, "assets")), name="assets")
    
    # Serve other static files
    @app.get("/vite.svg")
    async def serve_vite_svg():
        vite_file = os.path.join(static_dir, "vite.svg")
        if os.path.exists(vite_file):
            return FileResponse(vite_file)
        return {"error": "Not found"}
    
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
        # Serve static files directly
        if path.startswith("assets/"):
            file_path = os.path.join(static_dir, path)
            if os.path.exists(file_path):
                return FileResponse(file_path)
        
        # Check if it's an API route or docs
        if path.startswith(("api/", "auth/", "projects/", "tasks/", "comments/")) or path in ["docs", "redoc", "openapi.json", "health"]:
            return {"error": "Not found"}
        
        # Serve index.html for all other routes (SPA routing)
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