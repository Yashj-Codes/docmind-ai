FROM python:3.11-slim

WORKDIR /app

# Install system dependencies for pdfplumber/pymupdf if needed
# We might need gcc and python3-dev for some python packages
RUN apt-get update && apt-get install -y gcc sqlite3 libsqlite3-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
