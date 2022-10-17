# Dian Coffeeshop - Backend

<br/>

<div align="center">

[![node](https://img.shields.io/npm/v/node?label=node)](https://nodejs.org/en/)
[![express](https://img.shields.io/npm/v/express?label=express)](https://www.npmjs.com/package/express)
[![posgreSql](https://img.shields.io/npm/v/postgresql?label=postgresql)](https://www.npmjs.com/package/pg)
[![jsonwebtoken](https://img.shields.io/npm/v/jsonwebtoken?label=jsonwebtoken)](https://www.npmjs.com/package/jsonwebtoken)
[![bcrypt](https://img.shields.io/npm/v/bcrypt?label=bcrypt)](https://www.npmjs.com/package/bcrypt)
[![multer](https://img.shields.io/npm/v/multer?label=multer)](https://www.npmjs.com/package/multer)


<br/>

</div>

<br/>

Dian coffee shop is a web application that sells foods, coffee, and beverage. with this application, customers can order more easily from coffe shop.

## Contents

- [API Endpoint](#api-endpoint)
- [Run Application](#run-application)
- [Postman Documentation](#postman-documentation)

## API Endpoint

### Public

#### Login

Endpoint: `/auth/login`

- Body
  | KEY | TYPEDATA |
  | --- | --- |
  | email | `string` |
  | password | `string` |

#### Register

Endpoint: `/users/register`

- Body
  | KEY | TYPEDATA |
  | --- | --- |
  | email | `string` |
  | password_user | `string` |
  | phone_number | `string` |

#### Search Product

Endpoint: `/products`

- Query `optional`
  | KEY | TYPEDATA |
  | --- | --- |
  | search | `string` |
  | category | `string` |
  | order | `string` |
  | sort | `string` |
  | page | `number` |
  | limit | `number` |
  

#### Product's detail

#### Edit profile

### Customer:

- Order
- Order history

### Admin:

- Add product
- Edit product
- Add promo
- Edit promo

## How to Run the Application

### 1. Clone this repository

Clone this repository by run the following code:

```
$ git clone <this-repo-url>
```

### 2. Install dependency packages

Install dependency packages by run the following code inside project folder:

```
$ npm install
```

### 3. Run `npm run dev`

Runs the app in the development mode.\
Open [http://localhost:8070](http://localhost:8070) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

## Postman Documentation

[Postman documentation link](https://documenter.getpostman.com/view/23788506/2s83ziPj3x)


