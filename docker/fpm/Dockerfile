FROM php:7.2.1-fpm
#RUN docker-php-ext-install pdo_mysql  shmop
RUN docker-php-ext-install pdo_mysql

VOLUME log.conf /usr/local/etc/php-fpm.d/zz-log.conf
