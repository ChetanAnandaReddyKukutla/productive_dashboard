from fastapi import FastAPI
from app.database import Base, engine
from app.routes import auth, project, task, comment
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="ProductiveBoards API", version="1.0.0")


origins = [
    "http://localhost:5173", 
    "http://localhost:3000",
    "http://localhost:5175",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(auth.router)
app.include_router(project.router)
app.include_router(task.router)
app.include_router(comment.router)

@app.get("/")
def read_root():
    return {"message":"Welcome to ProductiveBoards API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}