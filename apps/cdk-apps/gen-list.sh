#!/usr/bin/env bash

echo '' > stackList

i=0 n=0
grep 'new' ./bin/cdk-apps.ts | while read -r line ; do
  if [ $n -gt $i ]
  then
    stackName=$(echo $line | cut -d "'" -f2 | cut -d "'" -f1)
    echo $stackName >> ./stackList
  fi
  ((n++))
done
