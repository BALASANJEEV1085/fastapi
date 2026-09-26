# syntax=docker/dockerfile:1

###############################################################################
# Stage 1: Frontend Builder (React + Vite)
###############################################################################
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm install --legacy-peer-deps

COPY frontend/ ./
RUN npm run build

###############################################################################
# Stage 2: Backend Builder (FastAPI + SQLAlchemy)
###############################################################################
FROM python:3.11-slim AS backend-builder
WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

COPY backend/requirements.txt ./
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --prefix=/install -r requirements.txt

COPY backend/ ./

###############################################################################
# Stage 3: Unified Production Runtime (Nginx + Uvicorn)
###############################################################################
FROM nginx:alpine AS runtime

RUN apk add --no-cache python3 py3-pip libstdc++ && \
    mkdir -p /run/nginx /etc/nginx/http.d /etc/nginx/conf.d /app/data

COPY --from=backend-builder /install /usr/local
COPY --from=backend-builder /app /app

COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

RUN printf '%s\n' \
    'server {' \
    '    listen 80;' \
    '    server_name _;' \
    '' \
    '    root /usr/share/nginx/html;' \
    '    index index.html;' \
    '' \
    '    location / {' \
    '        try_files $uri $uri/ /index.html;' \
    '    }' \
    '' \
    '    location ~ ^/(register|token|users|docs|openapi.json|redoc)' \
    '    {' \
    '        proxy_pass http://127.0.0.1:8000;' \
    '        proxy_set_header Host $host;' \
    '        proxy_set_header X-Real-IP $remote_addr;' \
    '        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;' \
    '        proxy_set_header X-Forwarded-Proto $scheme;' \
    '    }' \
    '}' \
    > /etc/nginx/http.d/default.conf

WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    ALGORITHM=HS256 \
    ACCESS_TOKEN_EXPIRE_MINUTES=30 \
    DATABASE_URL=sqlite:////app/data/app.db

EXPOSE 80

CMD ["sh", "-c", "(uvicorn main:app --host 127.0.0.1 --port 8000 &) && nginx -g 'daemon off;'"]