FROM nginx

COPY ./dist/ /usr/share/nginx/html/
COPY ./vhost.nginx.conf /etc/nginx/conf.d/docker-demo.conf

EXPOSE 80