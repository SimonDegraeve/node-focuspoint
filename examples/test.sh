#!/bin/sh

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

focuspoint -x 64.583 -y 46.296 -s 1024x256 -s 512x512  -s 256x512 "${DIR}/test.jpg"
