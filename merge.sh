#!/bin/bash

main="master"


#branches=(one two three)
branches=(tinymce form-validation)

remote=origin



# let's rock
branches=("$main" "${branches[@]}")

containsElement () {
    local e
    for e in "${@:2}"; do [[ "$e" == "$1" ]] && return 0; done
    return 1
}

git config --global core.autocrlf false
git config --global rebase.autoStash true

if [ "$(git rev-parse --abbrev-ref HEAD)" == $main ];
then

    giturl=$(git config --get remote.$remote.url)

    echo 'fetching remote branches:';

    # string with newline characters inside
        remotebranches=$(git ls-remote -h $giturl | awk '{print $2}' | cut -c 12-);

    printf "$remotebranches"
    echo ""

    # string with spaces inside
        remotebranches=$(echo $remotebranches)

    # now convert to array
        IFS=' ' read -ra a <<<"$remotebranches";
        declare -p a 1> /dev/null 2> /dev/null;
        remotebranches=("${a[@]}")

    # test
    # echo 'remotebranches is array: ' $(declare -p remotebranches | grep -q '^declare \-a' && echo array || echo no array)


    git push origin $main

    count="${#branches[@]}";

    k=0;

    for i in "${branches[@]}"
    do

        containsElement "$i" "${remotebranches[@]}"

        if [[ $? == 0 ]]; then

            echo ">>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<"
            echo "              >>>>> branch $i <<<<<"
            echo ">>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<"

            git diff-index --quiet HEAD --

            if [[ $? == 0 ]]; then

                git checkout $i;

                git pull origin $i --no-edit

                git merge $main --no-edit

                git diff-index --quiet HEAD --

                if [[ $? == 0 ]]; then
                    git push origin $i
                else
                    echo "first commit changes before push"
                    git branch
                    break;
                fi

            else
                echo "first commit changes"
                git branch
                break;
            fi

            echo "branch $i done..."
        else
            echo ""
            echo "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            echo "  xxxxxx branch '$i' remotely doesn't exist xxxxxx"
            echo "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            echo ""
        fi

        k=$((k+1))
    done

    if [ $k == $count ]; then
        echo ">>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<"
        echo "                 >>>>> DONE <<<<<"
        echo ">>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<"
        git checkout $main;
    else
        echo ">>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<"
        echo "                 >>>>> ERROR <<<<<"
        echo ">>>>>>>>>>>>>>>>>>>>>>>>><<<<<<<<<<<<<<<<<<<<<<<<<<"
    fi

    git branch
else
    echo "switch branch to <$main>"
fi


git checkout develop
git branch --all
