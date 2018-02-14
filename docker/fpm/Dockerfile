FROM php:7.2.1-fpm

RUN apt-get update && apt-get install -y \
        libicu-dev \
        git \
    && docker-php-ext-install \
        pdo_mysql \
        opcache \
        intl \
    && pecl install apcu \
    && echo "extension=apcu.so" > /usr/local/etc/php/conf.d/apcu.ini

COPY php-custom.conf /usr/local/etc/php-fpm.d/zz-php-custom.conf
