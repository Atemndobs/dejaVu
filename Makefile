
install:
#cp quasar.conf_dev.js quasar.conf.js
	npm install
	quasar dev

build:
	cp quasar.conf_prod.js quasar.conf.js
	quasar build


push:
	git add .
	@read -p "Enter commit message:" MESSAGE; \
	git commit -m $$MESSAGE
	git push
	git status
