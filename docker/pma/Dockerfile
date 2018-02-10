FROM phpmyadmin/phpmyadmin:4.7

RUN sed -i "s/<?php/<?php \nrequire\(__DIR__\.'\/\.\.\/basic_auth\.php'\);/g" /www/libraries/common.inc.php
COPY basic_auth.php /www/basic_auth.php

