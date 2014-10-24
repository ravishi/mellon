#!/bin/bash
export PATH="$(npm bin):$PATH"
jsx --watch ./components/src ./components &
exec node "$(which nwbuild)" -r .
