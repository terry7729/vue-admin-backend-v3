FROM centos:7.5.1804
RUN yum install pcre pcre-devel openssl openssl-devel -y
RUN useradd nginx -s /sbin/nologin -M
RUN mkdir -p /application
ADD nginx-1.12.2 /application/nginx-1.12.2
RUN ln -s /application/nginx-1.12.2 /application/nginx
RUN mkdir -p /data/html
ADD dist /data/html/admin-backend
ADD src/utils/audio.mp3 /data/html/admin-backend/static/audio.mp3
ADD src/utils/newMessage.mp3 /data/html/admin-backend/static/newMessage.mp3
EXPOSE 9528/tcp
CMD ["/application/nginx/sbin/nginx"]

