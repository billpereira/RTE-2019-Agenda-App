# RTE-2019-Agenda-App

This material is prepared to emulate a real scenario where multiple developers are working in a cloud environment, using docker, ibm toolchain and travis ci, to implement maintenance with continuous delivery

<div align="center">
<img src="https://github.com/billpereira/RTE-2019-Agenda-App/blob/master/img/agenda.gif?raw=true"/>
</div>


## Setup your machine

1. Docker: 

> https://www.docker.com/get-started

2. VS Code:

> https://code.visualstudio.com/

3. NodeJS:

> https://nodejs.org/en/

4. Git:

> https://git-scm.com/


## Fork, clone and branch

A fork is a copy of a repository. Forking a repository allows you to freely experiment with changes without affecting the original project.

<div align="center">
<img src="https://raw.githubusercontent.com/billpereira/RTE-2019-Agenda-App/master/img/fork.gif"/>
</div>

### Fork

To begin, fork RTE-2019-Agenda-App using your GitHub account.

### Clone

Go to your forked repository, copy the SSH or HTTPS URL and in your terminal run the two commands to get the repository in your local file system and enter that directory.

```
$ git clone [your fork SSH/HTTPS]
$ cd RTE-2019-Agenda-App
```

### Let's build our container

First let's take a look in how does work Docker.

Docker uses namespaces, a feature from Linux kernel, when creating our containers, so we have isolated the set of resources to be used for our application.

```
+-----------------------+
|  +-----------------+  |
|  |      Chrome     |  |
|  +-----------------+  |
|                       |
|  +--------------------------
|  |                          
|  |     Kernel 
|  |                          
|  +--------------------------
|                       |
|  +------+  +------+   |
|  |  HD  |  |  NW  |   |
|  +------+  +------+   |
|  +------+  +------+   |
|  |  HD  |  |  NW  |   |
|  +------+  +------+   |
+-----------------------+
```
Containerization is increasingly popular because containers are:

* Flexible: Even the most complex applications can be containerized.
* Lightweight: Containers leverage and share the host kernel.
* Interchangeable: You can deploy updates and upgrades on-the-fly.
* Portable: You can build locally, deploy to the cloud, and run anywhere.
* Scalable: You can increase and automatically distribute container replicas.
* Stackable: You can stack services vertically and on-the-fly.

```
|  +--------+       +------------+ 
|  |  Image | -->   |  Container |
|  +--------+       +------------+
```
> https://guide.freecodecamp.org/devops/docker/

Inside agenda folder we are going to create our **Dockerfile**

```docker
FROM node:alpine 
WORKDIR '/app'
COPY ./package.json .
RUN npm install
COPY . .
CMD ["npm","start"]
```
Before we can run our container we need to build our image with the following command:
``docker build -t billpereira/rte-agenda-app``

Then we can run it, but remember with namespaces all set of resources it needs are 'isolated', so we need to expose the port were we are running
``docker run -p 3000:3000 billpereira/rte-agenda-app``

If you change something on your app, you will see that docker doesn't update it content automatically like when you are coding on your machine.

To fix that lets point the app dir to our folder
``docker run -p 3000:3000 -v /app/node_modules -v $(pwd):/app billpereira/rte-agenda-app``

Now it will be used during dev stage, so let's rename it to **Dockerfile.dev**. We can update our command with **-f Dockerfile.dev** to identify where are our image definitions.

To facilitate us, we can also use **docker-compose.yml**, so let's create it and add:
```docker
version: '3'
services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - /app/node_modules
      - .:/app
  tests:
    build:
      context: .
      dockerfile: Dockerfile.dev
    volumes:
      - /app/node_modules
      - .:/app
    command: ["npm","run","test"]
```

Now to start using our compose we just need to issue:
``docker-compose up``

We have seen how to use docker during our development phase, lets create the Dockerfile for production now:

```docker
FROM node:alpine as builder
WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx
EXPOSE 80
COPY --from=builder /app/build /usr/share/nginx/html
```