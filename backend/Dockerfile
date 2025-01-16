FROM python:alpine as base

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

WORKDIR /app/

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Development stage
FROM base AS dev
COPY requirements.dev.txt .
RUN pip install --no-cache-dir -r requirements.dev.txt