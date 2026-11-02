#!/bin/sh
# npm run push [-- <git push args>]
#
# Refreshes paper titles and authors, commits app/talkPapers.generated.json if that
# changed it (and nothing else, even if other changes are staged), then pushes.
set -eu

PAPERS=app/talkPapers.generated.json

npm run --silent fetch-papers

if [ -n "$(git status --porcelain -- "$PAPERS")" ]; then
	git add -- "$PAPERS"
	git commit --quiet -m 'Update reading group papers' -- "$PAPERS"
	echo "push: committed updated $PAPERS"
fi

git push "$@"
