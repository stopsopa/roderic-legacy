FROM php:7.2.1-cli

# TO BUILD THIS IMAGE:
    # docker build -t php:7.2.1-cli-intl .

# NOTICE !!! :  USE THIS IMAGE FROM ../../php.sh level

#RUN docker-php-ext-install pdo_mysql  shmop

# https://github.com/docteurklein
RUN apt-get update && apt-get install -y zlib1g-dev libicu-dev g++
RUN docker-php-ext-configure intl
RUN docker-php-ext-install pdo_mysql intl

# disabling short_open_tag
COPY ./php.ini /usr/local/etc/php/php.ini

#RUN apt-get update && apt-get install -y \
#        libfreetype6-dev \
#        libjpeg62-turbo-dev \
#        libpng12-dev \
#    && docker-php-ext-configure gd \
#        --with-freetype-dir=/usr/include/ \
#        --with-jpeg-dir=/usr/include/ \
#    && docker-php-ext-install -j$(nproc) gd
