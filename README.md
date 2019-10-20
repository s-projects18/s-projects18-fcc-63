## **FreeCodeCamp**- Information Security and Quality Assurance

### Project Personal Library (learning project)

Add/remove books to a personal library collection and add comments to each book.

### Installation

Live version is installed on glitch.com 
(https://s-projects18-fcc-63.glitch.me/)

One can create a new glitch-project and imported it from github.
It's a node.js project so it can also be installed per console.

### Usage REST-Api

| ACTION | METHOD | URL | PARAM | POST-DATA | STATUS RETURNED |  DATA RETURNED² |
| ------ | ------ | --- | ----- | --------- | --------------- | --------------- |
| get all books | GET | /api/books | - | - | 200,500 | [{},{},...] |
| insert new book | POST | /api/books | - | title | 200,400,500 | [{}], errors |
| get single book | GET | /api/books | _id | - | 200,400,500 | [{}], errors |
| add comment to book | POST | /api/books | _id | comment | 200,500 | [{}] |
| delete single book | DELETE | /api/books | _id | - | 200,500 | [], meta |
| delete all books | DELETE | /api/books | - | - | 200,500 | [], meta |

 ² an array is always returned, even if there is just one or no return object



***returned object in message-body***
```
{
  data: [{...}, {...}, ...],
  errors: [...],
  meta: [...]
}
```

***data-object: {...}***
```
{
  "_id": "5dab1746f3380f060475792f",
  "comments": [
    "c1",
    "c2"
  ],
  "title": "aaa",
  "created_on": "2019-10-19T14:01:42.946Z",
  "__v": 0,
  "commentcount": 2
}
```
