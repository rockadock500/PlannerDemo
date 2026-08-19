FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Force Docker cache invalidation - change CACHEBUST value to rebuild
ARG CACHEBUST=1
RUN echo "Build timestamp: $CACHEBUST"

COPY . .

CMD sh -c "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
