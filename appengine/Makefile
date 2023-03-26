.PHONY: deploy format run update

.SILENT:

deploy:
	gcloud app deploy --quiet --project=getscheduler-app

format:
	isort main.py
	black main.py

run:
	echo "TODO"

update:
	pur -r requirements.txt
