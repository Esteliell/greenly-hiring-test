# How to use

Stack: NestJs + TypeORM + Postgres

## Requirements

- Docker / Docker Compose
- Node.js 18

## Installation

```bash
$ yarn
```

## Running the app

First you need to start, migrate and seed the db :

```bash
$ yarn init-project
```

you can then start the server:

```bash
# development
$ yarn start

# watch mode
$ yarn start:dev
```

## Test

To run unit tests:

```bash
# unit tests
$ yarn test

# e2e tests
$ yarn test:e2e

# test coverage
$ yarn test:cov
```

## Database Migration

When the data schema is updated, the database needs to be synchronised with the code. This is done by creating a migration with Typeorm using the following command:

```bash
migrationName=<name> yarn migration:generate
```

# Hiring Test

When working on the following exercise, in addition to answering the product need, to give particular attention to the following points:

- Readability
- Maintainability
- Unit testing
- Handling of corner cases
- Error-handling

We want to compute the Agrybalise carbonfootprint of a foodproduct (e.g.: a hamCheesePizza) that we characterize by its ingredients as shown below

```js
const hamCheesePizza = {
  ingredients: [
    { name: "ham", quantity: 0.1, unit: "kg" },
    { name: "cheese", quantity: 0.15, unit: "kg" },
    { name: "tomato", quantity: 0.4, unit: "kg" },
    { name: "floor", quantity: 0.7, unit: "kg" },
    { name: "oliveOil", quantity: 0.3, unit: "kg" },
  ],
};
```

The calculation of the Agrybalise carbon footprint can be described as below:

- The Agrybalise carbon footprint of one ingredient is obtained by multiplying the quantity of the ingredient by the emission of a matching emission factor (same name and same unit).
- The carbon footprint of the food product is then obtained by summing the carbon footprint of all ingredients.
- If the carbon footprint of one ingredient cannot be calculated, then the carbon footprint of the whole product is set to null.

The tasks of this exercice are as follows:
1/ Implement the carbon footprint calculation of a product and persist the results in database.
2/ Implement a GET endpoint to retrieve the result.
3/ Implement a POST endpoint to trigger the calculation and the saving in the database.

# Explorate the Front End

Once an endpoint is created, it can then be used by the front-end, build on the low code framework Retool. Altough your role will mostly consists in developing on the Typescript backend, you will have to contribute to the low code platform from time to time. In the following, you will build your first functionality on Retool. Here are the steps to follow:

1/ Create a free account on the Retool platform.

2/ In the github project you can find a file dummy_data_form_submissions containing some dummy data. Implement a table showing the data and a search bar to search over the company name.

3/ Update the table to make the company column editable

4/ Display the activity sector as a tag. 

5/ Display a graphic visualization of a benchmark within each Activity sectors, where you compare companies based on their scores.

This part does not need to be shared before-hand but can be presented during the interview.

# What did I do ?

### Entities & DTO

- CarbonFootprintProduct : represents the foodproduct we want to calculate Agrobalise carbon footprint for.
- ProductIngredient  : represents each ingredient for a product. Linked to a carbon emission factor.

### Service

- CarbonFootprintProductsService
	- public
		- findAll
		- save
		- getProductEmission
		- calculateEmission
	- private
		- calculateTotalEmission
		- handleConversion

- CarbonEmissionFactorsService
	- findName (to find more easily the IDs of products to calculate emissions for)

> *:fa-question-circle:  Why handle some conversion ?*
>
>The criteria of "matching unit" for the carbon emission factor implies that, even if the above test data was all in kilogram, it is not meant to always be that way. Some conversion handler has then to be implemented, and the mg/g/kg is an easy option to start with.

### Controller

- CarbonFootprintProductsController : `/carbon-footprint-products/`
	- `GET ./` : getCarbonFootprintProducts, get all products with ingredients and associated emission factors
	- `GET ./:id` : get calculated Agrobalise emission for product with matching ID
	- `POST /:id/calculate-emission` : calculate and save emission for product with matching ID

### Tests
- Tests for new entities
- Tests for service 
- E2E tests (in the code and via Postman)

### Retool

Though it is not required to share it yet, I have done it already so I might as well share it now : https://morganer.retool.com/app/greenlyhiringtest/interactive-table
It is a possibility I might tinker with it til the technical interview.