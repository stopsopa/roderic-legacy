#!/bin/bash

TAG='v0.1.0';


function color {
   printf "\e[94m$1\e[0m\n"
}

echo '';
color "tag: $TAG";
echo '';

color "remove REMOTE tag";

git push --delete origin $TAG

color "remove LOCAL tag";

git tag --delete $TAG

color "creating local";

git tag $TAG

color "pushing to ORIGIN"

git push origin --tags