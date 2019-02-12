FROM nginx:1-alpine

COPY build /app/build
COPY version.txt entrypoint.sh /app/

COPY nginx.conf /etc/nginx/

CMD ["sh", "-c", "/app/entrypoint.sh && nginx"]
