#!/bin/bash
export PATH="$(npm bin):$PATH"
trap 'kill $(jobs -p)' EXIT
jsx --watch ./components/src ./components &
exec node "$(which nwbuild)" -r . &
wait %2
