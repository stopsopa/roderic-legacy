#!/bin/bash

set -e

TAG="$(node install/install.entry.js --getver)";

function color {
   printf "\e[94m$1\e[0m\n"
}

if [ "$#" == 1 ] && [ "$1" == "force" ] ; then
    color "git push origin --force"

    git push origin --force
fi

cd install
yarn build
cd ..
git add install/install.js
git commit --amend --no-edit

echo '';
color "tag: $TAG";
echo '';

color "remove REMOTE tag";

git push --delete origin $TAG || true

color "remove LOCAL tag";

git tag --delete $TAG || true

color "creating LOCAL";

git tag $TAG

color "pushing to ORIGIN"

git push origin --tags

color "NOW GO TO RELEASES TAB AND CONFIRM DESCRIPTION"