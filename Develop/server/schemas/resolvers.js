const { AuthenticationError } = require ('apollo-server-express')
const { User } = require('../models')
const auth = require('../utils/auth')
const { signToken } = require ('../utils/auth')

const resolvers = {Query: {
    me: async (parent, args, context) => {
        if (context.user) {
            const userData = await User.findOne({
                _id: context.user._id
                //find a way to exclude the user password from return data 
            })
            return userData
        } else {
            throw new AuthenticationError("User is not logged, no access allowed")
        }
    }
}, Mutation: {
    login: async (parent, args, context)=> {
        const userData = await User.findOne ({
            email: args.email

        })
        const password = userData.isCorrectPassword (args.password)
        if (!password) {
             throw AuthenticationError("Password or email is incorrect!") 
        }
        const token = signToken(userData)

        return {
            token, 
            user: userData
        }
    },
    adduser: async(parent, args, context)=> {
        const userData = await User.create (args)
        const token = signToken(userData)

        return {
            token, 
            user: userData
        }
    },
    saveBook: async(parent, args, context)=> {
        if (context.user) {
        const userData = await User.findByIdAndUpdate ({
            _id: context.user._id,
        },
        {
            $push: {savedBooks: args.bookData},
        },
        {
            new: true
        })
        return userData

        } else {
            throw new AuthenticationError("User is not logged, no access allowed")
        }
    },
    removeBook: async(parent, args, context)=> {
         if (context.user) {
        const userData = await User.findByIdAndUpdate ({
            _id: context.user._id,
        },
        {
            $pull: {savedBooks: args.bookId},
        },
        {
            new: true
        })
        return userData
        
        } else {
            throw new AuthenticationError("User is not logged, no access allowed")
        } 
    },

}} 

module.exports = resolvers