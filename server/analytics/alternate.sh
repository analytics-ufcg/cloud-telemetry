#!/bin/bash

while true
do

for i in {1..8}
do
yes > /dev/null &
sleep 1m
done

killall yes

sleep 2m

done
