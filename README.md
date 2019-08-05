# RTE-2019-Agenda-App

This material is prepared to emulate a real scenario where multiple developers are working in a cloud environment, using docker, ibm toolchain and travis ci, to implement maintenance with continuous delivery

<div align="center">
<img src="https://github.com/billpereira/RTE-2019-Agenda-App/blob/master/img/agenda.gif?raw=true"/>
</div>


## 1. Setup your machine

* Docker: 

> https://www.docker.com/get-started

* VS Code:

> https://code.visualstudio.com/

* NodeJS:

> https://nodejs.org/en/

* Git:

> https://git-scm.com/

* IBM Cloud CLI

> https://cloud.ibm.com/docs/cli?topic=cloud-cli-getting-started

> https://cloud.ibm.com/registration




## 2. Fork, clone and branch

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

## 3. Let's build our container

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

Then we can run it, but remember with namespaces all set of resources it needs are 'isolated', so we need to expose the port we are running
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

## 4. Continuous Integration with Travis CI

To start, log on Travis using your github account on:

> https://travis-ci.org/

Click the + next to My Repositories to enable Travis CI to build the new repository.

Find your repo and click on the toogle to enable Travis.

Now let's build our **travis.yml**

```yml
sudo: required
services:
  - docker

before_install:
  - cd agenda
  - docker build -t billpereira/rte-2019-agenda-app -f Dockerfile.dev .

script:
  - docker run -e CI=true billpereira/rte-2019-agenda-app npm run test -- --coverage
```
With this file when we push it to our git, travis will automatically start 


## 5. Time for IBM Cloud

Before we can deploy our application, lets create Kubernetes service for our app.

So through the cli let's first log on the **IBM Cloud** with your credentials

`ibmcloud login -a https://cloud.ibm.com`

Install the IBM Cloud Kubernetes Service plug-in

`ibmcloud plugin install container-service -r "IBM Cloud"`

Install the Container Registry plug-in.

`ibmcloud plugin install container-registry -r "IBM Cloud"`
Create the cluster, specifying the name of cluster.

`ibmcloud cs cluster-create --name <cluster name>`
To see the progress of your cluster creation, use the following command.

`ibmcloud cs clusters`

**Note: The process to create the cluster might take a long time. As the cluster is created, it progresses through these stages: Deploying, Pending, and Ready.**

Create the API key, using the string provided for your key name.

`ibmcloud iam api-key-create <my api key name>`
Save the API key value that is output by the command.

Now let's use the UI to define implement our pipeline. On the **catalog** search for **toolchain**.

<div align="center">
<img src="https://github.com/billpereira/RTE-2019-Agenda-App/blob/master/img/toolchain.jpeg?raw=true"/>
</div>

Let's create our own toolchain

<div align="center">
<img src="https://github.com/billpereira/RTE-2019-Agenda-App/blob/master/img/ownToolchain.jpg?raw=true"/>
</div>

You can keep customize our keep the default info gor your tool chain, and then click create.

<div align="center">
<img src="https://github.com/billpereira/RTE-2019-Agenda-App/blob/master/img/newToolchain.jpeg?raw=true"/>
</div>

On our toolchain we need to connect our github repository for the toolchain to monitor the master branch.

<div align="center">
<img src="https://github.com/billpereira/RTE-2019-Agenda-App/blob/master/img/ownToolchain.jpg?raw=true"/>
</div>

Now on top right click on **Add a Tool**. Look for GitHub.

<div align="center">
<img src="https://github.com/billpereira/RTE-2019-Agenda-App/blob/master/img/github.jpg?raw=true"/>
</div>

To create integration, we gonna choose Repository type: Existing, and provide Repository URL our github repository URL and click Create Integration (If requested authorize the access to your github account).

<div align="center">
<img src="https://github.com/billpereira/RTE-2019-Agenda-App/blob/master/img/gitintegra.jpg?raw=true"/>
</div>

Now let's add the delivery pipeline.

<div align="center">
<img src="https://github.com/billpereira/RTE-2019-Agenda-App/blob/master/img/delivery.jpg?raw=true"/>
</div>


On this step you should have the following tools:

<div align="center">
<img src="https://github.com/billpereira/RTE-2019-Agenda-App/blob/master/img/checktool.jpg?raw=true"/>
</div>

**For our delivery we need to add a job for build, and deploy, everythime there is a change on the master branch.**


Click the Add Stage button.

Name it Build.

The options for the INPUT tab should be correct by default, but we’ll list them here for completeness:

<div align="center">
<img src="https://github.com/billpereira/RTE-2019-Agenda-App/blob/master/img/build1.jpg?raw=true"/>
</div>

Ensure the Run jobs whenever a change is pushed to Git radio button is selected.

Select the JOBS tab

Click Add Job and select Build as the job type.

Select Container Registry as the Builder type.

Under the API key field, add your newly generated API key from the previous section.

Ensure the Container Registry namespace is set to sampleapps that we created earlier.

Update the “Docker image name to sampledocker

Ensure the Stop running this stage if this job fails is selected also.


<div align="center">
<img src="https://github.com/billpereira/RTE-2019-Agenda-App/blob/master/img/build2.jpg?raw=true"/>
</div>

Add a Deploy stage
Click the Add Stage button.

Name it Deploy.

Select the INPUT tab

The options for the INPUT tab should be correct by default, but we’ll list them here for completeness:

<div align="center">
<img src="https://github.com/billpereira/RTE-2019-Agenda-App/blob/master/img/deploy1.jpg?raw=true"/>
</div>

Ensure the Run jobs when previous stage is complete radio button is selected.

Select the JOBS tab

Click Add Job and select Deploy as the job type.

Select Kubernetes as the Deployer type.

Select the appropriate IBM Cloud region, API key, and Cluster name where application will be deployed.

<div align="center">
<img src="https://github.com/billpereira/RTE-2019-Agenda-App/blob/master/img/deploy2.jpg?raw=true"/>
</div>

Now everytime we make a change on our master branch our app is updated and we were able to create a complete continuous delivery cycle.

> https://developer.ibm.com/tutorials/custom-toolchain-with-devops/
