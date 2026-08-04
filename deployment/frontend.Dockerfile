# Frontend container: copies ONLY the static site files into nginx — never
# mount the whole repo root here, since that would also serve backend/.env
# and other files that must never be public. Build from the project root:
#   docker build -f deployment/frontend.Dockerfile -t celebrify-frontend .
FROM nginx:alpine

COPY frontend/index.html frontend/creator.html frontend/export.html frontend/payment.html frontend/success.html /usr/share/nginx/html/
COPY frontend/css/ /usr/share/nginx/html/css/
COPY frontend/js/ /usr/share/nginx/html/js/
COPY deployment/nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
