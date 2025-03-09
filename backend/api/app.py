from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from auth import router as auth_router
from schedule import router as schedule_router
from routes import router as routes_router

app = FastAPI(title="NurseEase Admin API", version="1.0")

# CORS (Allow frontend to access the API)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend-domain.com"],  # Change this to specific frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include route files
app.include_router(auth_router, prefix="/auth", tags=["Authentication"])
app.include_router(schedule_router, prefix="/schedule", tags=["Scheduling"])
app.include_router(routes_router, tags=["Routes"])

# Root Endpoint
@app.get("/")
async def root():
    return {"message": "Welcome to NurseEase Admin API"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
