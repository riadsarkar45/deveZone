require('dotenv').config();
const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const bodyParser = require('body-parser');

const cors = require('cors');
const app = express();
app.use(cors());
const port = process.env.PORT || 5000;

// Parse JSON bodies
app.use(bodyParser.json());

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', (req, res) => {
    res.send('ambulance booking server is running');
});

app.listen(port, () => {
    console.log(`Server is running on ${port}`);
});




const uri = "mongodb+srv://riadsarkar45:FNL5daoEtBwncBY9@cluster0.xgiocgi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {

        const database = client.db('devZone')
        const users = database.collection("users")
        const posts = database.collection("posts")
        const saved = database.collection("saved")
        const comments = database.collection("comments")
        const categories = database.collection("categories")

        app.get('/users/:uid', async (req, res) => {
            const userId = req.params.uid;
            let result;

            if (userId) {
                result = await users.find({ uid: { $ne: userId } }).toArray();
            } else {
                res.status(400).send("No UID provided");
                return;
            }

            res.send(result);
        })

        app.get('/categories', async (req, res) => {
            const result = await categories.find().toArray();
            res.send(result)
        })


        app.post('/get/post/with/category/:cat/:uid', async (req, res) => {
            try {
                const postCat = req.params.cat;
                const userId = req.params.uid;
                if (postCat === 'Following') {
                    const user = await users.findOne({ uid: userId });
                    const follow = user.following;
                    const postsFromFollowingUsers = await posts.find({ uid: { $in: follow } }).toArray();
                    return res.status(200).json(postsFromFollowingUsers);
                } else if (postCat === 'For You') {
                    const user = await users.findOne({ uid: userId });
                    const topics = user.selectedTopics || [];
                    const findPost = await posts.find({ category: { $in: topics } }).toArray();
                    return res.status(200).json(findPost);
                } else {
                    const query = { category: postCat };
                    const findPost = await posts.find(query).toArray();
                    return res.status(200).json(findPost);
                }
            } catch (err) {
                console.error(err);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
        });
        

        app.get('/get/post/default/:cat/:uid', async (req, res) => {
            try {
                const userId = req.params.uid;
                const user = await users.findOne({ uid: userId });

                if (!user) {
                    return res.status(404).json({ error: "User not found" });
                }

                const topics = user.selectedTopics || [];
                const findPost = await posts.find({ category: { $in: topics } }).toArray();
                res.send(findPost);
            } catch (error) {
                console.error("Error fetching default posts:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });


        app.post('/get/post', async (req, res) => {
            const dataToFind = req.body;
            const { id } = dataToFind;
            const query = { _id: new ObjectId(id) }
            const find = await posts.findOne(query)
            res.json(find)
        })

        app.post('/addNewPost', async (req, res) => {
            const dataToInsert = req.body;
            const result = await posts.insertOne(dataToInsert)
            res.send(result)
        })

        app.post('/save-post', async (req, res) => {
            const dataToInsert = req.body;
            const query = { postId: dataToInsert.postId, userId: dataToInsert.userId };
            const findSavedPost = await saved.findOne(query)
            if (findSavedPost) {
                return res.send({ msg: 'Post already saved' })
            }

            const result = await saved.insertOne(dataToInsert)
            res.send(result)
        })

        app.post('/post-comments', async (req, res) => {
            const dataToInsert = req.body;
            const post = { _id: new ObjectId(dataToInsert.postId) }
            const commentUpdate = {
                $inc: { totalComment: 1 }
            }
            await posts.updateOne(post, commentUpdate)


            const result = await comments.insertOne(dataToInsert)
            res.send(result)
        })

        app.put('/comment-replies/:cmtId', async (req, res) => {
            const cmtId = req.params.cmtId;
            const dataToUpdate = req.body;
            const { reply, userName } = dataToUpdate;
            const findCmt = { _id: new ObjectId(cmtId) }
            const updateReplies = {
                $push: { replies: { _id: new ObjectId(), userName: userName, reply: reply } }
            }
            const cmt = await comments.updateOne(findCmt, updateReplies)
            res.send(cmt)
        })

        app.put('/set-user-post-topics/:uid', async (req, res) => {
            const userId = req.params.uid
            const dataToUpdate = req.body;
            const query = { uid: userId }
            const updates = {
                $set: { selectedTopics: dataToUpdate }
            }
            const update = await users.updateOne(query, updates)
            res.send(update)
        })

        app.put('/like-comment/:cmtId/:uid', async (req, res) => {
            const commentId = req.params.cmtId;
            const userId = req.params.uid;
            const query = { _id: new ObjectId(commentId) };
            const updateLikes = {
                $push: { likes: userId },
                $inc: { totalLikes: 1 }
            }
            const update = await comments.updateOne(query, updateLikes)
            res.send(update)
        })

        app.get('/comments/:postId', async (req, res) => {
            const postId = req.params.postId;
            const find = await comments.find({ postId: postId }).toArray()
            res.send(find)
        })

        app.get('/saved-post/:uid', async (req, res) => {
            const userId = req.params.uid
            const query = { userId: userId }; // Assuming your document field is named userId
            const result = await saved.find(query).toArray();
            const setQuery = result.map(ids => new ObjectId(ids.postId))
            const post = await posts.find({ _id: { $in: setQuery } }).toArray();
            res.send(post);

        });


        app.put('/follow-user/:uid/:id/:followingToId', async (req, res) => {
            const getUid = req.params.uid;
            const id = req.params.id;
            const flwId = req.params.followingToId;
            const query = { _id: new ObjectId(getUid) }
            const updateFollower = {
                $push: { followers: id },
                $inc: { followersCount: 1 }
            }

            const find = { uid: id }
            const updateFollowing = {
                $push: { following: flwId }
            }
            await users.updateOne(find, updateFollowing)


            const update = await users.updateOne(query, updateFollower)

            res.send(update)
        })

        app.put('/add-like/:uid/:id', async (req, res) => {
            const getUserId = req.params.uid;
            const postId = req.params.id;
            const query = { _id: new ObjectId(postId) }
            const post = await posts.findOne(query)
            const { likerIds } = post;
            const needCheck = getUserId.toString();
            if (likerIds.includes(needCheck)) {
                return res.send({ msg: 'You already liked the post' })
            }
            const updateLikes = {
                $push: { likerIds: getUserId },
                $inc: { likes: 1 }
            }
            const update = await posts.updateOne(query, updateLikes)
            res.send(update)
        })

        app.post("/users", async (req, res) => {
            const user = req.body;
            const query = { email: user.email };
            const existUser = await users.findOne(query);
            if (existUser) {
                return res.send({ message: 'userExist', InsertedId: null });
            }
            const result = await users.insertOne(user)
            res.send(result)
        })



        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        //await client.close();
    }
}
run().catch(console.dir);
