const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const auth = require("../utils/auth");
const { signToken } = require("../utils/auth");

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({
          _id: context.user._id,
          //find a way to exclude the user password from return data
        })
        .select("-__v -password");
        return userData;
      } 
        throw new AuthenticationError("User is not logged, no access allowed");
    },
  },
  Mutation: {
    login: async (parent, {email, password}) => {
      const user = await User.findOne({
        email,
      });
      if (!user) throw AuthenticationError("User not found/ incorrect password/email")
      const inputPassword = user.isCorrectPassword(password);
      if (!inputPassword) {
        throw AuthenticationError("Password or email is incorrect!");
      }
      const token = signToken(user);

      return {
        token,
        user,
      };
    },
    addUser: async (parent, args, context) => {
      const user = await User.create(args);
      const token = signToken(user);

      return {
        token,
        user,
      };
    },
    saveBook: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findByIdAndUpdate(
          {
            _id: context.user._id,
          },
          {
            $push: { savedBooks: args.bookData },
          },
          {
            new: true,
          }
        );
        return user;
      } else {
        throw new AuthenticationError("User is not logged, no access allowed");
      }
    },
    removeBook: async (parent, args, context) => {
      if (context.user) {
        const user = await User.findByIdAndUpdate(
          {
            _id: context.user._id,
          },
          {
            $pull: { savedBooks: args.bookId },
          },
          {
            new: true,
          }
        );
        return user;
      } else {
        throw new AuthenticationError("User is not logged, no access allowed");
      }
    },
  },
};

module.exports = resolvers;
