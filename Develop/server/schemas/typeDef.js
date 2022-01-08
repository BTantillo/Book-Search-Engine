const { gql } = require ('apollo-server-express')


const typeDefs = gql`
type User {
   _id: ID!
   username: String!
   email: String
    bookCount: INT
    savedBooks: [Book]
}
type Book {

}
type Auth {
    token: ID!
    user: User
}
`