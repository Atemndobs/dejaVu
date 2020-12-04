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

deja:
	cd /var/www/deja-vue

pixelate:
	cd /var/www/pixelate
