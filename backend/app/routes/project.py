# app/routes/project.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import SessionLocal
from app.models.project import Project
from app.models.user import User
from app.schemas.project import ProjectCreate, ProjectOut
from app.core.security import get_current_user

router = APIRouter(tags=["Projects"])

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=ProjectOut)
def create_project(project: ProjectCreate, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    new_project = Project(title=project.title, description=project.description, owner_id=user["user_id"])
    db.add(new_project)
    db.commit()
    db.refresh(new_project)
    return new_project

@router.get("/", response_model=list[ProjectOut])
def list_projects(db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    projects = db.query(Project).all()
    return projects

@router.get("/{project_id}", response_model=ProjectOut)
def get_project(project_id: int, db: Session = Depends(get_db)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/{project_id}", response_model=ProjectOut)
def update_project(project_id: int, updated: ProjectCreate, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    project.title = updated.title
    project.description = updated.description
    db.commit()
    db.refresh(project)
    return project

@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != user["user_id"]:
        raise HTTPException(status_code=403, detail="Not authorized")
    db.delete(project)
    db.commit()
    return {"detail": "Project deleted successfully"}

@router.post("/{project_id}/add-member/{user_id}")
def add_member(project_id: int, user_id: int, db: Session = Depends(get_db), user: dict = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    if project.owner_id != user["user_id"]:
        raise HTTPException(status_code=403, detail="Only owner can add members")

    member = db.query(User).filter(User.id == user_id).first()
    if not member:
        raise HTTPException(status_code=404, detail="User not found")

    project.members.append(member)
    db.commit()
    return {"detail": f"{member.name} added as member"}
