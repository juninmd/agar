FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# executa app sem privilegio (DS-0002)
RUN addgroup -g 10001 app && adduser -u 10001 -G app -s /bin/sh -D app
USER app
