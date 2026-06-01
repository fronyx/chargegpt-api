#!/usr/bin/env bash

./gen-list.sh

echo "=== Fronyx CDK Manager ==="
echo

PS3="What are you planning to do now: "
select action in deploy destroy
do
    PS3="Select the stack to $action: "
    select stack in $(<stackList)
    do
        echo "${action}ing $stack..."
        readarray -td- deployEnvs < <(printf '%s' "$stack")
        if [ -z "${deployEnvs[1]}" ]
        then
          deployEnvs[1]=production
        fi
        NODE_ENV="${deployEnvs[1]}" npm run build
        NODE_ENV="${deployEnvs[1]}" npm run cdk -- $action $stack --profile fronyx
        break
    done

    break
done
