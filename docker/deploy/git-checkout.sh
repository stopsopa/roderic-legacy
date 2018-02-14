
LIST=(
    react/hosts.js
    docker/name.conf
    app/server.config.js
    docker/docker-compose.yml
)

cd "$(pwd)"

COMBINED=""

for i in "${LIST[@]}"
do
    COMBINED="$COMBINED $i"
done

TOCHANGE="$(git status $COMBINED --porcelain)"

if [ "$TOCHANGE" == "" ]; then
    echo "Nothing to revert..."
else
    echo -e "\n\nFollowing files will be reverted to last state, do you agree:\n"

    echo -e "$TOCHANGE"

    echo -e "\n (y - agree, any other key - don't agree) ?";

    read AGREE

    if [ "$AGREE" == "y" ]; then
        echo -e "\nallowed... reverting listed files:\n"

        set -e

        for i in "${LIST[@]}"
        do
            git checkout "$i" && echo "    success $i"
        done

        echo -e "\n"

        set +e
    else
        echo "denied... continuing without reverting"
    fi
fi


cat << 'EOF' > php/web/status.php
<?php
header('Content-type:text/html');

echo 'dev: ';

error_reporting(E_ALL);
ini_set('display_errors',1);


$file = dirname(__FILE__). '/../../docker/name.conf';

if (file_exists($file)) {

    if (is_readable($file)) {

        echo '[' . trim(file_get_contents($file)) . ']';
    }
    else {
        echo 'something is wrong with reading first file 2';
    }
}
else {
    echo 'something is wrong with reading first file 1';
}


// php
exec("cat ../../docker/docker-compose.yml  | grep '# auto - please leave'", $stdout);

if (count($stdout) == 1 && strpos($stdout[0], ':')) {

    $stdout = array_map(function ($line) {
        $line = explode('#', $line);
        return $line[0];
    }, $stdout);

    $php = trim($stdout[0], '"- ');

    $php = explode(':', $php);

    $php = $php[0];

    echo " p $php";
}
else {
    echo 'something is wrong with reading second file';
}

// js
$stdout = null;
exec("cat ../../react/hosts.js  | grep '// auto'", $stdout);

if (count($stdout) > 0 && strpos($stdout[0], ':')) {

    $js = preg_replace('#^[^\d]*(\d+).*$#', '$1', $stdout[0]);

    echo " n $js";
}
else {
    echo 'something is wrong with reading third file';
}
EOF

