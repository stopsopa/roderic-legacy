

LIST=(
    react/hosts.js
    docker/name.conf
    app/server.config.js
    docker/docker-compose.yml
)

echo -e "\n\nFollowing files will be reverted to last state, do you agree:\n"

for i in "${LIST[@]}"
do
    echo "    $i"
done

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