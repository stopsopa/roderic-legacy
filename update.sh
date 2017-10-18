#!/bin/bash

TAG='v0.1.0';

function color {
   printf "\e[94m$1\e[0m\n"
}

if [ "$#" == 1 ] && [ "$1" == "force" ] ; then
    color "git push origin --force"

    git push origin --force
fi

echo '';
color "tag: $TAG";
echo '';

color "remove REMOTE tag";

git push --delete origin $TAG

color "remove LOCAL tag";

git tag --delete $TAG

color "creating LOCAL";

git tag $TAG

color "pushing to ORIGIN"

git push origin --tags

color "NOW GO TO RELEASES TAB AND CONFIRM DESCRIPTION"