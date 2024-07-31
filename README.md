# nest-js-studying: Payment user application

## Introduction

This is a simple microservice architecture that defines an application for handle payments for the user defined inside the living software.

## Setup, run and requirments

In Linux Ubuntu or WSL platform, do the following.

### Locally

Deploy the complete app is using docker-compose

Check [here](https://docs.docker.com/compose/install/) how to install docker-compose.

Then `docker-compose up --build`

Access to the frontend, via `http://localhost:8080`

## What you should see

You should expect a view for Login or Register.

If you want to log with the admin user (already defined in the app setup), enter `admin` as username and `admin` as password.

This admin can:

* Create users
* Create payments for its own
* List Users
* List Payments
  
Otherwise you can register in the app, and you will be automatically redirected to an user dahsboard view. There you can:

* List your payments
* See your user details
* Create payments based on your balance


## Architecture definition

We have 4 apps inside the [apps](https://gitlab.musala.com/alejandro.diaz/nest-js-studying/-/tree/main/apps/main) folder:

* [Frontend](#Frontend)
* [Payment Microservice](#Payment Microservice)
* [User Microservice](#User Microservice)
* [Http Gateway](#Http Gateway)


## Fronted

## Http Gateway

## Payment Microservice

## User Microservice


