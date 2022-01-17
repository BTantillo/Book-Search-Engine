const { gql } = require ('apollo-server-express')


const typeDefs = gql`
type User {
   _id: ID!
   username: String!
   email: String
    bookCount: Int
    savedBooks: [Book]
}
type Book {
    bookId: ID!
    authors: String!
    description: String!
    link: String!
    title: String!

}
type Auth {
    token: ID!
    user: User
}
input BookInput  {
    bookId: String!
    authors: [String]
    description: String!
    link: String!
    image: String
    title: String!

}

type Mutation {
    login(email: String!, password: String!): Auth 
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
}
 type Query {
     me: User
 }

`

module.exports = typeDefs 