os_type := $(shell uname -s)

export USER_ID=$(shell id -u)
export GROUP_ID=$(shell id -g)

ifeq ($(os_type),Linux)
	export CURRENT_HOST_ADDRESS=172.17.0.1
endif
ifeq ($(os_type),Darwin)
	export CURRENT_HOST_ADDRESS=docker.for.mac.localhost
    zcat_expansion = .Z
endif


serve:
	php artisan serve

update:
	php vendor/bin/composer update

push:
	git add .
	@read -p "Enter commit message:" MESSAGE; \
	git commit -m $$MESSAGE
	git push
	git status

open:
	python -m webbrowser "http://localhost:8000/tickets"

lunch:
	xdg-open "https://127.0.0.1:8000/"

test:
	php vendor/bin/phpunit --exclude-group skip-test -v --testdox
cron:
	crontab * * * * * /bin/zsh /home/ba/workdir/data/ticket-assistant/run.sh

analyse:
	php vendor/bin/phpstan.phar analyse --level=6 src

restart-php-pfm:
	sudo service phpX.Y-fpm-sp restart
install:
	 /bin/bash /var/www/pixelate/install.sh
composer:
	 /bin/bash /var/www/pixelate/composer.sh
sql:
	mysql -uatemkeng_compixelate -ppixelate
env:
	cp .env.prod .env
pull:
	git reset --hard && git pull

build:
	quasar build -m pwa
run:
	quasar dev -m pwa

re-deja:
	rm -rf /var/www/dejavu
nu-deja:
	cp -r /var/www/deja-vue/dist/pwa dejavu

re-pix:
	rm -rf /var/www/pixelate
nu-pix:
	cp -r /var/www/pixelate_app/dist/pwa pixelate

deja:
	make pull && make re-deja && make nu-deja
pix:
	make pull && make re-pix && make nu-pix



ifeq ($(shell pwd),/var/www/deja-vue)
up:
	make pull && make deja
endif
ifeq ($(shell pwd),/var/www/pixelate)
up:
	make pull && make pix
endif
