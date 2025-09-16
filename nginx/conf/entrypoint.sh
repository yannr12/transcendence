#!/bin/sh
# Substitute environment variables in nginx.conf.template and start nginx

envsubst < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
exec nginx -g 'daemon off;'
