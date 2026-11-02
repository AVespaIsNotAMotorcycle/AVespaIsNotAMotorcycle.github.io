#!/bin/sh
# npm run push [-- <git push args>]
#
# Refreshes paper authors, commits app/talkAuthors.generated.json if that
# changed it (and nothing else, even if other changes are staged), then pushes.
set -eu

AUTHORS=app/talkAuthors.generated.json

npm run --silent fetch-authors

if [ -n "$(git status --porcelain -- "$AUTHORS")" ]; then
	git add -- "$AUTHORS"
	git commit --quiet -m 'Update reading group paper authors' -- "$AUTHORS"
	echo "push: committed updated $AUTHORS"
fi

git push "$@"
