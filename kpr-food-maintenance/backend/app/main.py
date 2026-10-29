from fastapi import FastAPI

app = FastAPI(
    title="KPRIET Hostel & Mess Management System",
    description="Backend API for hostel, student strength, gate-pass and complaint management.",
    version="1.0.0",
)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "message": "KPRIET backend is running"
    }