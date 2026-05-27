# ─────────────────────────────────────────
# Stage 1: React 빌드
# ─────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# 의존성 먼저 설치 (캐시 레이어 최적화)
COPY package*.json ./
RUN npm ci

# 소스 복사 후 빌드
COPY . .
RUN npm run build
# CRA 사용 시 결과물: /app/build
# Vite 사용 시 결과물: /app/dist
# → 아래 COPY 경로를 본인 프로젝트에 맞게 수정

# ─────────────────────────────────────────
# Stage 2: Nginx로 정적파일 서빙
# ─────────────────────────────────────────
FROM nginx:alpine

# 기본 nginx 설정 제거
RUN rm /etc/nginx/conf.d/default.conf

# FE 전용 nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드 결과물 복사
COPY --from=builder /app/build /usr/share/nginx/html
# Vite 사용 시 위 줄을 아래로 교체:
# COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost/index.html || exit 1

CMD ["nginx", "-g", "daemon off;"]

