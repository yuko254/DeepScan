import { prisma } from "../src/config/prisma.js"
import bcrypt from "bcrypt"

async function seed() {
    // Roles
    await prisma.roles.createMany({
        data: [
            { role_name: "admin" },
            { role_name: "user" },
            { role_name: "moderator" },
        ]
    })

    const adminRole = await prisma.roles.findUnique({ where: { role_name: "admin" } })
    const userRole = await prisma.roles.findUnique({ where: { role_name: "user" } })
    const modRole = await prisma.roles.findUnique({ where: { role_name: "moderator" } })

    // Categories
    await prisma.categories.createMany({
        data: [
            { category_name: "Coins & Currency" },
            { category_name: "Gemstones & Minerals" },
            { category_name: "Jewelry & Accessories" },
            { category_name: "Artifacts & Relics" },
            { category_name: "Gold & Precious Metals" },
            { category_name: "Silver & Base Metals" },
            { category_name: "Underwater Finds" },
            { category_name: "Land Detecting" },
            { category_name: "Cache & Hoard" },
            { category_name: "Tools & Equipment" },
            { category_name: "Maps & Research" },
            { category_name: "Identification Help" },
            { category_name: "Questions & Help" },
            { category_name: "Show & Tell" },
            { category_name: "Tips & Techniques" },
            { category_name: "Legal & Permissions" },
            { category_name: "Locations & Sites" },
            { category_name: "Restoration & Cleaning" },
            { category_name: "Valuation & Appraisal" },
            { category_name: "Beginner's Corner" },
            { category_name: "News & Events" },
            { category_name: "Trade & Sell" },
        ]
    })

    // Users
    const hashedPassword = await bcrypt.hash("password123", 10)
    await prisma.users.createMany({
        data: [
            { username: "admin",       email: "admin@treasure.com",   password: hashedPassword, role_id: adminRole!.role_id },
            { username: "moderator",   email: "mod@treasure.com",     password: hashedPassword, role_id: modRole!.role_id },
            { username: "john_digger", email: "john@treasure.com",    password: hashedPassword, role_id: userRole!.role_id },
            { username: "gem_hunter",  email: "gem@treasure.com",     password: hashedPassword, role_id: userRole!.role_id },
            { username: "coin_lover",  email: "coin@treasure.com",    password: hashedPassword, role_id: userRole!.role_id },
            { username: "deep_diver",  email: "diver@treasure.com",   password: hashedPassword, role_id: userRole!.role_id },
            { username: "relic_rose",  email: "relic@treasure.com",   password: hashedPassword, role_id: userRole!.role_id },
        ]
    })

    const users = await prisma.users.findMany()
    const john = users.find(u => u.username === "john_digger")!
    const gem  = users.find(u => u.username === "gem_hunter")!
    const coin = users.find(u => u.username === "coin_lover")!
    const dive = users.find(u => u.username === "deep_diver")!
    const rose = users.find(u => u.username === "relic_rose")!

    // Profiles
    await prisma.profiles.createMany({
        data: [
            { user_id: john.user_id, first_name: "John",  last_name: "Smith",   bio: "Metal detectorist for 10 years. Love finding old coins!" },
            { user_id: gem.user_id,  first_name: "Emma",  last_name: "Carter",  bio: "Gemstone collector and amateur geologist." },
            { user_id: coin.user_id, first_name: "Mike",  last_name: "Turner",  bio: "Numismatist and history enthusiast." },
            { user_id: dive.user_id, first_name: "Sara",  last_name: "Nguyen",  bio: "Underwater treasure hunter and scuba diver." },
            { user_id: rose.user_id, first_name: "Rose",  last_name: "Patel",   bio: "Relic hunter, focusing on ancient artifacts." },
        ]
    })

    // Follows
    await prisma.follows.createMany({
        data: [
            { follower_id: john.user_id, following_id: gem.user_id },
            { follower_id: john.user_id, following_id: dive.user_id },
            { follower_id: gem.user_id,  following_id: john.user_id },
            { follower_id: coin.user_id, following_id: john.user_id },
            { follower_id: dive.user_id, following_id: rose.user_id },
            { follower_id: rose.user_id, following_id: gem.user_id },
        ]
    })

    const categories = await prisma.categories.findMany()
    const catGems    = categories.find(c => c.category_name === "Gemstones & Minerals")!
    const catCoins   = categories.find(c => c.category_name === "Coins & Currency")!
    const catUnder   = categories.find(c => c.category_name === "Underwater Finds")!
    const catQA      = categories.find(c => c.category_name === "Questions & Help")!
    const catShow    = categories.find(c => c.category_name === "Show & Tell")!

    // Posts
    const post1 = await prisma.posts.create({
        data: {
            user_id:      gem.user_id,
            category_id:  catGems.category_id,
            text_content: "Just found this beautiful alexandrite gemstone! The color change from green to red is stunning. Anyone else collect alexandrite?",
        }
    })

    const post2 = await prisma.posts.create({
        data: {
            user_id:      john.user_id,
            category_id:  catCoins.category_id,
            text_content: "Found a 1921 Morgan Silver Dollar today with my detector. In pretty good condition too!",
        }
    })

    const post3 = await prisma.posts.create({
        data: {
            user_id:      dive.user_id,
            category_id:  catUnder.category_id,
            text_content: "Diving off the coast last weekend and found what looks like an old anchor. Possibly 18th century? Thoughts?",
        }
    })

    const post4 = await prisma.posts.create({
        data: {
            user_id:      coin.user_id,
            category_id:  catQA.category_id,
            text_content: "What's the best metal detector for beginners under $300? Looking to get into the hobby.",
        }
    })

    const post5 = await prisma.posts.create({
        data: {
            user_id:      rose.user_id,
            category_id:  catShow.category_id,
            text_content: "My latest haul from an old farmstead. Roman-era bronze brooch and some medieval pottery shards!",
        }
    })

    // Post Likes
    await prisma.post_likes.createMany({
        data: [
            { user_id: john.user_id, post_id: post1.post_id },
            { user_id: coin.user_id, post_id: post1.post_id },
            { user_id: dive.user_id, post_id: post1.post_id },
            { user_id: gem.user_id,  post_id: post2.post_id },
            { user_id: rose.user_id, post_id: post2.post_id },
            { user_id: john.user_id, post_id: post3.post_id },
            { user_id: gem.user_id,  post_id: post5.post_id },
            { user_id: coin.user_id, post_id: post5.post_id },
        ]
    })

    // Comments
    const comment1 = await prisma.comments.create({
        data: {
            user_id:  john.user_id,
            post_id:  post1.post_id,
            content:  "That color change is incredible! Alexandrite is one of my favorites.",
        }
    })

    const comment2 = await prisma.comments.create({
        data: {
            user_id: coin.user_id,
            post_id: post1.post_id,
            content: "Where did you find it? Was it at a gem show or in the wild?",
        }
    })

    // Reply to comment2
    await prisma.comments.create({
        data: {
            user_id:   gem.user_id,
            post_id:   post1.post_id,
            parent_id: comment2.comment_id,
            content:   "Found it at a small gem show actually. Got lucky!",
        }
    })

    await prisma.comments.create({
        data: {
            user_id: gem.user_id,
            post_id: post2.post_id,
            content: "Amazing find! Morgan dollars are so beautiful.",
        }
    })

    await prisma.comments.create({
        data: {
            user_id: rose.user_id,
            post_id: post4.post_id,
            content: "I started with a Garrett ACE 300, great beginner detector!",
        }
    })

    await prisma.comments.create({
        data: {
            user_id: john.user_id,
            post_id: post4.post_id,
            content: "Minelab GO-FIND 40 is also worth checking out in that budget.",
        }
    })

    // Comment Likes
    await prisma.comment_likes.createMany({
        data: [
            { user_id: gem.user_id,  comment_id: comment1.comment_id },
            { user_id: dive.user_id, comment_id: comment1.comment_id },
            { user_id: gem.user_id,  comment_id: comment2.comment_id },
        ]
    })

    // Hashtags
    await prisma.hashtags.createMany({
        data: [
            { name: "alexandrite",      post_count: 1 },
            { name: "gemhunting",       post_count: 1 },
            { name: "metaldetecting",   post_count: 1 },
            { name: "silverdollar",     post_count: 1 },
            { name: "underwaterfinds",  post_count: 1 },
            { name: "treasurehunting",  post_count: 3 },
            { name: "relics",           post_count: 1 },
        ]
    })

    const hashtags = await prisma.hashtags.findMany()
    const htAlex   = hashtags.find(h => h.name === "alexandrite")!
    const htGem    = hashtags.find(h => h.name === "gemhunting")!
    const htMetal  = hashtags.find(h => h.name === "metaldetecting")!
    const htSilver = hashtags.find(h => h.name === "silverdollar")!
    const htUnder  = hashtags.find(h => h.name === "underwaterfinds")!
    const htTreasure = hashtags.find(h => h.name === "treasurehunting")!
    const htRelics = hashtags.find(h => h.name === "relics")!

    await prisma.post_hashtags.createMany({
        data: [
            { post_id: post1.post_id, hashtag_id: htAlex.hashtag_id },
            { post_id: post1.post_id, hashtag_id: htGem.hashtag_id },
            { post_id: post1.post_id, hashtag_id: htTreasure.hashtag_id },
            { post_id: post2.post_id, hashtag_id: htMetal.hashtag_id },
            { post_id: post2.post_id, hashtag_id: htSilver.hashtag_id },
            { post_id: post2.post_id, hashtag_id: htTreasure.hashtag_id },
            { post_id: post3.post_id, hashtag_id: htUnder.hashtag_id },
            { post_id: post3.post_id, hashtag_id: htTreasure.hashtag_id },
            { post_id: post5.post_id, hashtag_id: htRelics.hashtag_id },
        ]
    })

    // Saved Posts
    await prisma.saved_posts.createMany({
        data: [
            { user_id: john.user_id, post_id: post1.post_id },
            { user_id: gem.user_id,  post_id: post2.post_id },
            { user_id: coin.user_id, post_id: post3.post_id },
            { user_id: dive.user_id, post_id: post5.post_id },
        ]
    })

    // Chat
    const chat = await prisma.chats.create({
        data: { title: "Gem Hunters", is_group_chat: true }
    })

    await prisma.chat_participants.createMany({
        data: [
            { user_id: gem.user_id,  chat_id: chat.chat_id },
            { user_id: john.user_id, chat_id: chat.chat_id },
            { user_id: dive.user_id, chat_id: chat.chat_id },
        ]
    })

    await prisma.messages.createMany({
        data: [
            { chat_id: chat.chat_id, sender_id: gem.user_id,  text_content: "Hey everyone! Anyone going to the gem show next weekend?" },
            { chat_id: chat.chat_id, sender_id: john.user_id, text_content: "I'll be there! Hope to find some alexandrite." },
            { chat_id: chat.chat_id, sender_id: dive.user_id, text_content: "Can't make it, going diving. Good luck though!" },
        ]
    })

    console.log("Seeding complete!")
}

seed()
    .catch(console.error)
    .finally(() => prisma.$disconnect())