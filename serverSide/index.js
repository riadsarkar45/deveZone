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
        const livePolls = database.collection("livePolls")
        const voteCollection = database.collection("voteCollection")

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

        app.get('/categories/:uid', async (req, res) => {
            const result = await users.findOne({ uid: req.params.uid })

            res.send(result.selectedTopics)
        })

        app.get('/all-topics', async (req, res) => {
            const result = await categories.find().toArray()
            res.send(result)
        })

        app.get('/get-poll-result/:pollId', async (req, res) => {
            const pollId = req.params.pollId;
            const polls = await voteCollection.find({ pollId: pollId }).toArray();
            res.send(polls)
        })


        app.post('/get/post/with/category/:cat/:uid', async (req, res) => {
            try {
                const postCat = req.params.cat;
                const userId = req.params.uid;
                if (postCat === 'Following') {
                    const user = await users.findOne({ uid: userId });
                    const follow = user.following;
                    const postsFromFollowingUsers = await posts.find({ uid: { $in: follow } }).toArray();
                    const getPoll = await livePolls.find({ uid: { $in: follow } }).toArray();
                    const mapGetPoll = getPoll.flatMap(opt => opt.option)
                    const getVoteCollections = await voteCollection.find({ options: { $in: mapGetPoll } }).toArray();
                    return res.status(200).json({ postsFromFollowingUsers, getPoll, getVoteCollections });
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

        app.post('/create-poll', async (req, res) => {
            try {
                const dataToInsert = req.body;
                const result = await livePolls.insertOne(dataToInsert);
                res.send(result);
            } catch (error) {
                console.error('Error creating poll:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });

        app.put('/submit-vote/:id/:userId', async (req, res) => {
            const userId = req.params.userId;
            const dataToSend = req.body;
            const { options } = req.body;

            try {
                const query = { options: options };

                const find = await voteCollection.findOne({ options: options });

                if (find) {
                    const result = await voteCollection.updateOne(query,
                        {
                            $inc: { votes: 1 },
                            $push: { userIds: userId }
                        },
                    );
                    res.send(result);
                } else {
                    await voteCollection.insertOne(dataToSend);
                    res.send({ message: 'New vote inserted.' });
                }
            } catch (error) {
                console.error('Error submitting vote:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });




        app.get('/get/post/default/:cat/:uid', async (req, res) => {
            try {
                const userId = req.params.uid;
                const user = await users.findOne({ uid: userId });
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

            const updateCate = {
                $inc: { posts: 1 }
            }
            await categories.updateOne({ name: dataToInsert.category }, updateCate)

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

        app.put('/update-user-topic/:uid', async (req, res) => {
            const userId = req.params.uid;
            const topics = req.body;
            const updateTopics = {
                $addToSet: { selectedTopics: { $each: topics } }
            }
            const update = await users.updateOne({ uid: userId }, updateTopics)
            res.send(update)
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


        app.get('/individual-posts/:uid', async (req, res) => {
            try {
                const userId = req.params.uid;
                const user = await users.findOne({ uid: userId });

                if (!user) {
                    return res.status(404).send("User not found");
                }

                const query = await posts.find({ uid: userId }).toArray();
                const likerIds = query.flatMap(post => post.likerIds);

                const followers = user.followers;

                // If there are no likerIds, return empty arrays
                if (likerIds.length === 0) {
                    console.log("No likes found for the posts.");
                    return res.send({ query, likedUsers: [], nonFollowers: 0 });
                }

                // Find users who liked the posts
                const likedUsers = await users.find({ uid: { $in: likerIds } }).toArray();
                const followersWhoLiked = likedUsers.filter(u => followers.includes(u.uid));

                // If there are no followers who liked, return empty array for likedUsers
                if (followersWhoLiked.length === 0) {
                    console.log("No followers liked the posts.");
                    return res.send({ query, likedUsers: [], nonFollowers: 0 });
                }

                const nonFollowersWhoLiked = followersWhoLiked.filter(u => !followers.includes(u.uid));
                const nonFollowers = nonFollowersWhoLiked.length;

                res.send({ query, likedUsers: followersWhoLiked, nonFollowers });
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        });












        app.get('/following/:postId', async (req, res) => {
            try {
                const postId = req.params.postId;

                // Retrieve the post
                const post = await posts.findOne({ _id: postId });

                if (!post) {
                    return res.status(404).send("Post not found");
                }

                // Find users who have reacted to the post and are being followed by the requester
                const likedUsers = await users.find({
                    following: req.user._id, // Assuming you have authenticated user information in req.user
                    likerIds: postId
                }).toArray();

                res.send({ likedUsers });
            } catch (error) {
                console.error(error);
                res.status(500).send("Internal Server Error");
            }
        });



        app.get('/userprofile/:userId', async (req, res) => {
            const userId = req.params.userId;
            const user = await users.findOne({ uid: userId })
            const findPost = await posts.find({ uid: userId }).toArray()
            const following = user.following
            const followers = user.followers
            const getFollowedUsers = await users.find({ uid: { $in: following, $ne: userId } }).toArray();
            const getFollowers = await users.find({ uid: { $in: followers, $ne: userId } }).toArray();

            res.send({ user, findPost, getFollowedUsers, getFollowers })
        })


        app.get('/loggedIn-user/:uid', async (req, res) => {
            const userId = req.params.uid;
            const user = await users.findOne({ uid: userId })
            res.send(user)
        })

        app.get('/follower/following/:uid', async (req, res) => {
            const userId = req.params.uid;
            const followers = await users.findOne({ uid: userId })
            const followersId = followers.following;
            const result = await users.find({ uid: { $in: followersId } }).toArray()
            res.send(result)

        })

        app.get('/follower/:uid', async (req, res) => {
            const userId = req.params.uid;
            const followersIds = await users.findOne({ uid: userId })
            const followersId = followersIds.followers;
            const result = await users.find({ uid: { $in: followersId } }).toArray()
            res.send(result)
        })


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

        app.put('/increase-profile-visit/:uid', async (req, res) => {
            const updateVisits = {
                $push: { visits: 1 }
            }
            const update = await users.updateOne({ uid: req.params.uid }, updateVisits)
            res.send(update)
        })

        app.put('/update-user-profile/:uid', async (req, res) => {
            const userId = req.params.uid;
            const data = req.body
            const updateUserInfo = {
                $set: {
                    name: data.userName,
                    email: data.userEmail,
                    cover: data.imgUrl,
                    height: data.height,
                    opacity: data.opacity
                }
            }
            const update = await users.updateOne({ uid: userId }, updateUserInfo)
            res.send(update)
        })

        app.put('/update/post/clicks/:postId', async (req, res) => {
            try {
                const postId = req.params.postId;
                const query = { _id: new ObjectId(postId) }
                const updates = {
                    $inc: { clicks: 1 }
                }
                const updatePost = await posts.updateOne(query, updates)
                res.send(updatePost)
            } catch (err) {
                console.log(err);
            }
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
