const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLID,
    GraphQLList,
    GraphQLNonNull,
    GraphQLString,
    GraphQLInt

} = require('graphql')
const userModel = require('../models/user')
const postModel = require('../models/post')

const UserType = new GraphQLObjectType({
    name: 'User',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLNonNull(GraphQLString) },
        username: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) },
        age: { type: GraphQLNonNull(GraphQLInt) },
        posts: {
            type: new GraphQLList(PostType),
            resolve: (parent) => {
                return postModel.find({ userid: parent.id })
                    .then(posts => posts)
                    .catch(err => { return { message: err.message || 'Mongoose finding Posts of a particular User error' } })
            }
        }
    })
})

const PostType = new GraphQLObjectType({
    name: 'Post',
    fields: () => ({
        id: { type: GraphQLID },
        text: { type: GraphQLNonNull(GraphQLString) },
        user: {
            type: UserType,
            resolve: (parent) => {
                return userModel.findById(parent.userid)
                    .then(user => user)
                    .catch(err => { return { message: err.message || 'Mongoose finding a User of a particular Post error!' } })
            }
        }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        user: {
            type: UserType,
            args: {
                id: { type: GraphQLID }
            },
            resolve: (_, args) => {
                return userModel.findById(args.id)
                    .then(user => user)
                    .catch(err => { return { message: err.message || 'Mongoose User finding error!' } })
            }
        },
        users: {
            type: new GraphQLList(UserType),
            resolve: () => {
                return userModel.find()
                    .then(users => users)
                    .catch(err => {
                        return { message: err.message || 'Mongoose Users finding error!' }
                    })
            }
        },

        post: {
            type: PostType,
            args: {
                id: { type: GraphQLID }
            },
            resolve: (_, args) => {
                return postModel.findById(args.id)
                    .then(post => post)
                    .catch(err => { return { message: err.message || 'Mongoose Post finding error!' } })
            }
        },
        posts: {
            type: new GraphQLList(PostType),
            resolve: () => {
                return postModel.find()
                    .then(posts => posts)
                    .catch(err => {
                        return { message: err.message || 'Mongoose Posts finding error!' }
                    })
            }
        }
    })
})

const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        addUser: {
            type: UserType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                username: { type: new GraphQLNonNull(GraphQLString) },
                password: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (_, args) => {
                return userModel.create(args)
                    .then(user => user)
                    .catch(err => { return { message: err.message || 'Mongoose User insertion error!' } })
            }
        },
        updateUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                name: { type: GraphQLString },
                username: { type: GraphQLString },
                password: { type: GraphQLString },
                age: { type: GraphQLInt }
            },
            resolve: (_, args) => {
                return userModel.findByIdAndUpdate(args.id, args, { new: true })
                    .then(user => user)
                    .catch(err => { return { message: err.message || 'Mongoose User update error!' } })
            }
        },
        deleteUser: {
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (_, args) => {
                return userModel.findByIdAndDelete(args.id)
                    .then(user => user)
                    .catch(err => { return { message: err.message || 'Mongoose User deletion error!' } })
            }
        },


        addPost: {
            type: PostType,
            args: {
                text: { type: new GraphQLNonNull(GraphQLString) },
                userid: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (_, args) => {
                return postModel.create(args)
                    .then(post => post)
                    .catch(err => { return { message: err.message || 'Mongoose Post insertion error!' } })
            }
        },
        updatePost: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                text: { type: GraphQLString },
                userid: { type: GraphQLID },
            },
            resolve: (_, args) => {
                return postModel.findByIdAndUpdate(args.id, args, { new: true })
                    .then(post => post)
                    .catch(err => { return { message: err.message || 'Mongoose Post update error!' } })
            }
        },
        deletePost: {
            type: PostType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve: (_, args) => {
                return postModel.findByIdAndDelete(args.id)
                    .then(post => post)
                    .catch(err => { return { message: err.message || 'Mongoose Post deletion error!' } })
            }
        },
    })
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})