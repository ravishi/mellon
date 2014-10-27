#!/bin/bash
export PATH="$(npm bin):$PATH"
trap 'kill $(jobs -p)' EXIT
jsx --watch ./components/src ./components &
exec node "$(which nwbuild)" -v 0.10.5 -r . &
wait %2
