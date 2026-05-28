// scripts/seed-full.ts
import { prisma } from '../src/config/prisma.js';
import bcrypt from 'bcrypt';

const PASSWORD_HASH = await bcrypt.hash('password123', 10);

// Media URLs
const MEDIA_URLS = {
  images: [
    'https://images.unsplash.com/photo-1502323773422-35d7a6c2e3c1',
    'https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef',
    'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73',
    'https://images.unsplash.com/photo-1508998020582-6c3b203fedf3',
    'https://images.unsplash.com/photo-1502381289025-0ce0f9e27f37',
    'https://images.unsplash.com/photo-1519315901367-f34ff9154487',
    'https://images.unsplash.com/photo-1504703395950-b89145a5425f',
    'https://images.unsplash.com/photo-1502672023488-70e25813eb80',
    'https://images.unsplash.com/photo-1504164996022-09080787b6b3',
    'https://images.unsplash.com/photo-1504826260979-242151ee45b5',
  ],
  videos: ['https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'],
};

// Helper functions
const random = <T>(arr: T[]): T => {
  if (!arr.length) throw new Error('Array is empty');
  return arr[Math.floor(Math.random() * arr.length)] as T;
};
const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randomDate = (start: Date, end: Date) => new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
const randomBool = (chance = 0.5) => Math.random() < chance;

// Data pools
const firstNames = ['John', 'Jane', 'Mike', 'Sarah', 'David', 'Emma', 'Chris', 'Lisa', 'Tom', 'Anna', 'Alex', 'Maria', 'James', 'Linda', 'Robert', 'Patricia', 'Michael', 'Jennifer', 'William', 'Elizabeth'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin'];
const usernames = ['treasure_hunter', 'gem_lover', 'coin_collector', 'relic_seeker', 'deep_diver', 'metal_detector', 'artifact_finder', 'gold_digger', 'silver_hunter', 'ancient_road', 'viking_raid', 'roman_empire', 'egyptian_tomb', 'pirate_cove', 'shipwreck', 'fossil_finder', 'mineral_maniac', 'jewelry_joe', 'cache_crazy', 'hoard_hunter'];
const bios = ['Metal detecting enthusiast', 'Gem collector', 'History lover', 'Underwater explorer', 'Relic hunter', 'Coin collector', 'Fossil hunter', 'Treasure seeker', 'Archaeologist', 'Detectorist'];

// Hashtags (40+)
const HASHTAGS = [
  'treasure', 'gold', 'silver', 'coins', 'relics', 'artifacts', 'metaldetecting',
  'gemhunting', 'underwater', 'ancient', 'medieval', 'viking', 'roman', 'egyptian',
  'pirate', 'shipwreck', 'fossil', 'mineral', 'jewelry', 'cache', 'hoard', 'expedition',
  'adventure', 'history', 'archaeology', 'detectorist', 'prospecting', 'mining',
  'bronzeage', 'ironage', 'stoneage', 'celtic', 'anglosaxon', 'norman', 'crusader',
  'renaissance', 'victorian', 'colonial', 'civilwar', 'ww1', 'ww2', 'aviation', 'maritime',
  'railroad', 'pioneer', 'native', 'battlefield'
];

// Tags (at least 40)
const TAGS = [
  'rare', 'valuable', 'ancient', 'authentic', 'museum', 'collection', 'display', 'restored',
  'excellent', 'mint', 'uncirculated', 'proof', 'error', 'variety', 'keydate', 'semikey',
  'bullion', 'proof-like', 'toned', 'original', 'patina', 'uncleaned', 'dug', 'hoard',
  'cabinet', 'exhibition', 'reference', 'type', 'attributed', 'provenance', 'excollection',
  'gem', 'eye-clean', 'choice', 'about', 'good', 'fine', 'very', 'extremely', 'almost'
];

// Categories (22 exactly)
const CATEGORIES = [
  "Coins & Currency", "Gemstones & Minerals", "Jewelry & Accessories", "Artifacts & Relics",
  "Gold & Precious Metals", "Silver & Base Metals", "Underwater Finds", "Land Detecting",
  "Cache & Hoard", "Tools & Equipment", "Maps & Research", "Identification Help",
  "Questions & Help", "Show & Tell", "Tips & Techniques", "Legal & Permissions",
  "Locations & Sites", "Restoration & Cleaning", "Valuation & Appraisal", "Beginner's Corner",
  "News & Events", "Trade & Sell"
];

// Countries (15+)
const COUNTRIES = [
  'United States', 'Russia', 'France', 'Egypt', 'Italy', 'United Kingdom', 'Germany', 'Japan',
  'Australia', 'Canada', 'Brazil', 'India', 'Spain', 'Mexico', 'Greece', 'Turkey', 'Morocco',
  'Peru', 'China', 'South Africa', 'Argentina', 'Chile', 'Colombia', 'Portugal', 'Netherlands'
];

const CITIES_BY_COUNTRY: Record<string, string[]> = {
  'United States': ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'],
  'France': ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice'],
  'Egypt': ['Cairo', 'Alexandria', 'Giza', 'Luxor', 'Aswan'],
  'Italy': ['Rome', 'Milan', 'Naples', 'Turin', 'Palermo'],
  'United Kingdom': ['London', 'Birmingham', 'Manchester', 'Glasgow', 'Liverpool'],
  'Germany': ['Berlin', 'Hamburg', 'Munich', 'Cologne', 'Frankfurt'],
  'Japan': ['Tokyo', 'Osaka', 'Kyoto', 'Yokohama', 'Nagoya'],
  'Australia': ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide'],
  'Canada': ['Toronto', 'Vancouver', 'Montreal', 'Calgary', 'Ottawa'],
  'Brazil': ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador', 'Fortaleza'],
  'India': ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata'],
  'Spain': ['Madrid', 'Barcelona', 'Valencia', 'Seville', 'Zaragoza'],
  'Mexico': ['Mexico City', 'Guadalajara', 'Monterrey', 'Puebla', 'Tijuana'],
  'Greece': ['Athens', 'Thessaloniki', 'Patras', 'Heraklion', 'Larissa'],
  'Turkey': ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya'],
};

// ============================================================
// CLEAN DATABASE
// ============================================================
async function cleanDatabase() {
  console.log('🧹 Cleaning database...');
  const tables = [
    'messages', 'chat_participants', 'chats', 'saved_posts', 'comment_likes', 'comments',
    'post_likes', 'post_tags', 'content_hashtags', 'comment_hashtags', 'hashtags', 'posts',
    'stories', 'scans', 'media', 'contents', 'follows', 'follow_requests', 'profiles',
    'users', 'blocks', 'reports', 'report_targets',
    'notification_targets', 'notifications', 'locations', 'cities', 'countries',
    'categories', 'tags', 'roles'
  ];
  for (const table of tables) {
    await prisma.$executeRawUnsafe(`TRUNCATE TABLE "${table}" RESTART IDENTITY CASCADE;`);
  }
  console.log('✅ Database cleaned\n');
}

// ============================================================
// MAIN SEED
// ============================================================
async function seed() {
  console.log('🌱 STARTING SEED\n');
  await cleanDatabase();

  // 1. ROLES
  console.log('📋 Creating roles...');
  const adminRole = await prisma.roles.create({ data: { role_id: 1, role_name: 'admin' } });
  const modRole = await prisma.roles.create({ data: { role_id: 2, role_name: 'moderator' } });
  const userRole = await prisma.roles.create({ data: { role_id: 3, role_name: 'user' } });
  console.log(`   ✅ Roles (admin:1, moderator:2, user:3)\n`);

  // 2. CATEGORIES (22)
  console.log('🏷️ Creating categories...');
  await prisma.categories.createMany({ data: CATEGORIES.map(name => ({ name })) });
  const categories = await prisma.categories.findMany();
  console.log(`   ✅ ${categories.length} categories\n`);

  // 3. TAGS (40+)
  console.log('🔖 Creating tags...');
  await prisma.tags.createMany({ data: TAGS.map(name => ({ name })) });
  const tags = await prisma.tags.findMany();
  console.log(`   ✅ ${tags.length} tags\n`);

  // 4. HASHTAGS (40+)
  console.log('#️⃣ Creating hashtags...');
  await prisma.hashtags.createMany({ data: HASHTAGS.map(name => ({ name })) });
  const hashtags = await prisma.hashtags.findMany();
  const hashtagMap = new Map(hashtags.map(h => [h.name, h.hashtag_id]));
  console.log(`   ✅ ${hashtags.length} hashtags\n`);

  // 5. COUNTRIES, CITIES, LOCATIONS
  console.log('🌍 Creating locations...');
  const locations: any[] = [];
  for (const countryName of COUNTRIES) {
    const country = await prisma.countries.create({ data: { name: countryName } });
    const cityNames = CITIES_BY_COUNTRY[countryName] || [`${countryName} City`];
    for (const cityName of cityNames.slice(0, 3)) {
      const city = await prisma.cities.create({ data: { name: cityName, country_id: country.country_id } });
      for (let i = 0; i < randomInt(1, 2); i++) {
        const location = await prisma.locations.create({
          data: {
            country_id: country.country_id,
            city_id: city.city_id,
            lat: randomInt(-90, 90),
            lng: randomInt(-180, 180),
            place_id: `${cityName}_${i}`,
          }
        });
        locations.push(location);
      }
    }
  }
  console.log(`   ✅ ${locations.length} locations\n`);

  // 6. USERS & PROFILES (200 users)
  console.log('👤 Creating users and profiles...');
  const users: any[] = [];
  const privateUsers: any[] = [];

  const usedUsernames = new Set<string>();

  for (let i = 0; i < 200; i++) {
    const isAdmin = i === 0;
    const isMod = i === 1;
    const isPrivate = !isAdmin && !isMod && randomBool(0.15);

    // Generate unique username with timestamp and counter
    let baseUsername: string;
    if (isAdmin) {
      baseUsername = 'admin';
    } else if (isMod) {
      baseUsername = 'moderator';
    } else {
      const randomName = i < usernames.length
        ? usernames[i]
        : `${random(firstNames)}_${random(lastNames)}`.toLowerCase();
      baseUsername = `${randomName}_${Date.now()}_${i}`;
    }

    let username = baseUsername.slice(0, 50);

    // Ensure uniqueness
    if (usedUsernames.has(username)) {
      username = `${username}_${randomInt(1000, 9999)}`;
    }
    usedUsernames.add(username);

    const email = `${username}@example.com`.slice(0, 255);

    const user = await prisma.users.create({
      data: {
        username: username,
        email: email,
        password: PASSWORD_HASH,
        role_id: isAdmin ? 1 : isMod ? 2 : 3,
        is_active: true,
        is_banned: false,
      },
    });
    users.push(user);
    if (isPrivate) privateUsers.push(user);

    const firstName = random(firstNames);
    const lastName = random(lastNames);
    const bio = random(bios);
    const avatar = random(MEDIA_URLS.images);
    const phoneNumber = `+1${randomInt(100, 999)}${randomInt(100, 999)}${randomInt(1000, 9999)}`;
    const birthDate = randomDate(new Date(1960, 0, 1), new Date(2005, 0, 1));
    const birthLocationId = random(locations).location_id;
    const currentLocationId = random(locations).location_id;

    await prisma.profiles.create({
      data: {
        user_id: user.user_id,
        first_name: firstName,
        last_name: lastName,
        bio: bio,
        avatar: avatar,
        is_private: isPrivate,
        phone_number: phoneNumber,
        birth_date: birthDate,
        birth_location_id: birthLocationId,
        current_location_id: currentLocationId,
      },
    });
  }
  console.log(`   ✅ ${users.length} users (${privateUsers.length} private)\n`);

  // 7. FOLLOWS
  console.log('🔗 Creating follows...');
  const blocksMap = new Map<string, Set<string>>();
  let followCount = 0;

  for (const user of users) {
    const numFollows = randomInt(0, 100);
    const availableUsers = users.filter((u: any) => u.user_id !== user.user_id);
    if (availableUsers.length === 0) continue;

    const shuffled = [...availableUsers];
    for (let j = shuffled.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
    }
    const targets = shuffled.slice(0, Math.min(numFollows, shuffled.length));
    for (const target of targets) {
      try {
        await prisma.follows.create({
          data: { follower_id: user.user_id, following_id: target.user_id }
        });
        followCount++;
      } catch (e) { }
    }
  }
  console.log(`   ✅ ${followCount} follows\n`);

  // 8. FOLLOW REQUESTS
  console.log('📨 Creating follow requests...');
  let requestCount = 0;
  for (const privateUser of privateUsers) {
    const numRequests = randomInt(0, 10);
    const requestersAvailable = users.filter((u: any) => u.user_id !== privateUser.user_id);
    const shuffledRequesters = [...requestersAvailable];
    for (let j = shuffledRequesters.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [shuffledRequesters[j], shuffledRequesters[k]] = [shuffledRequesters[k], shuffledRequesters[j]];
    }
    const requesters = shuffledRequesters.slice(0, Math.min(numRequests, shuffledRequesters.length));
    for (const requester of requesters) {
      try {
        await prisma.follow_requests.create({
          data: {
            requester_id: requester.user_id,
            target_id: privateUser.user_id,
            status: random(['pending', 'accepted', 'rejected']),
          }
        });
        requestCount++;
      } catch (e) { }
    }
  }
  console.log(`   ✅ ${requestCount} follow requests\n`);

  // 9. BLOCKS
  console.log('🚫 Creating blocks...');
  let blockCount = 0;
  for (const user of users) {
    const numBlocks = randomInt(0, 100);
    const availableBlocks = users.filter((u: any) => u.user_id !== user.user_id);
    const shuffled = [...availableBlocks];
    for (let j = shuffled.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [shuffled[j], shuffled[k]] = [shuffled[k], shuffled[j]];
    }
    const blockedUsers = shuffled.slice(0, Math.min(numBlocks, shuffled.length));
    for (const blocked of blockedUsers) {
      try {
        await prisma.blocks.create({
          data: { blocker_id: user.user_id, blocked_id: blocked.user_id }
        });
        blockCount++;
        if (!blocksMap.has(user.user_id)) blocksMap.set(user.user_id, new Set());
        blocksMap.get(user.user_id)!.add(blocked.user_id);
      } catch (e) { }
    }
  }
  console.log(`   ✅ ${blockCount} blocks\n`);

  // 10. POSTS (0-50 per user)
  console.log('📝 Creating posts...');
  const posts: any[] = [];

  for (const author of users) {
    const numPosts = randomInt(0, 50);
    for (let p = 0; p < numPosts; p++) {
      const category = random(categories);
      const location = random(locations);

      // Select random hashtags for this post (0-5)
      const selectedHashtags: string[] = [];
      const numHashtags = randomInt(0, 5);
      const shuffledHashtags = [...HASHTAGS];
      for (let j = shuffledHashtags.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [shuffledHashtags[j], shuffledHashtags[k]] = [shuffledHashtags[k]!, shuffledHashtags[j]!];
      }
      for (let h = 0; h < numHashtags; h++) {
        selectedHashtags.push(shuffledHashtags[h]!);
      }

      // Select random users to mention (0-3)
      const availableForMention = users.filter((u: any) => u.user_id !== author.user_id && !blocksMap.get(author.user_id)?.has(u.user_id));
      const shuffledUsers = [...availableForMention];
      for (let j = shuffledUsers.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [shuffledUsers[j], shuffledUsers[k]] = [shuffledUsers[k], shuffledUsers[j]];
      }
      const mentionedUsers = shuffledUsers.slice(0, randomInt(0, 3));

      // Build text content
      const hashtagString = selectedHashtags.map(t => `#${t}`).join(' ');
      const mentionString = mentionedUsers.map((u: any) => `@${u.username}`).join(' ');
      const textContent = `Found this amazing piece! ${mentionString} Check it out! ${hashtagString}`.trim().slice(0, 500);

      // Create content
      const content = await prisma.contents.create({
        data: {
          user_id: author.user_id,
          type: 'post',
          visibility: random(['public', 'followers', 'private']),
          content_map: {
            text: textContent,
            ...(randomBool(0.7) && { image: random(MEDIA_URLS.images) }),
            ...(randomBool(0.2) && { video: random(MEDIA_URLS.videos) }),
          },
        },
      });

      // Create post
      const post = await prisma.posts.create({
        data: {
          content_id: content.content_id,
          category_id: category.category_id,
          location_id: location.location_id,
          text_content: textContent,
        },
      });
      posts.push(post);

      // Link hashtags
      for (const tagName of selectedHashtags) {
        const hashtagId = hashtagMap.get(tagName);
        if (hashtagId) {
          await prisma.content_hashtags.create({
            data: { content_id: content.content_id, hashtag_id: hashtagId }
          });
        }
      }

      // Add tags (0-3 per post)
      const numTags = randomInt(0, 3);
      const shuffledTags = [...tags];
      for (let j = shuffledTags.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [shuffledTags[j], shuffledTags[k]] = [shuffledTags[k]!, shuffledTags[j]!];
      }
      for (let t = 0; t < numTags; t++) {
        const tag = shuffledTags[t];
        if (tag) {
          await prisma.post_tags.create({
            data: { post_id: post.content_id, tag_id: tag.tag_id }
          });
        }
      }
    }
  }
  console.log(`   ✅ ${posts.length} posts\n`);

  // Helper to get post with content
  const getPostWithContent = async (post: any) => {
    return await prisma.posts.findUnique({
      where: { content_id: post.content_id },
      include: { content: true }
    });
  };

  // 11. POST LIKES (0-200 per user)
  console.log('❤️ Creating post likes...');
  let likeCount = 0;
  for (const user of users) {
    const numLikes = randomInt(0, 200);
    const shuffledPosts = [...posts];
    for (let j = shuffledPosts.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [shuffledPosts[j], shuffledPosts[k]] = [shuffledPosts[k], shuffledPosts[j]];
    }
    const likedPosts = shuffledPosts.slice(0, Math.min(numLikes, shuffledPosts.length));
    for (const post of likedPosts) {
      const postWithContent = await getPostWithContent(post);
      if (postWithContent && postWithContent.content.user_id !== user.user_id && !blocksMap.get(user.user_id)?.has(postWithContent.content.user_id)) {
        try {
          await prisma.post_likes.create({
            data: { user_id: user.user_id, post_id: post.content_id }
          });
          likeCount++;
        } catch (e) { }
      }
    }
  }
  console.log(`   ✅ ${likeCount} post likes\n`);

  // 12. SAVED POSTS (0-10 per user)
  console.log('💾 Creating saved posts...');
  let saveCount = 0;
  for (const user of users) {
    const numSaves = randomInt(0, 10);
    const shuffledPosts = [...posts];
    for (let j = shuffledPosts.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [shuffledPosts[j], shuffledPosts[k]] = [shuffledPosts[k], shuffledPosts[j]];
    }
    const savedPosts = shuffledPosts.slice(0, Math.min(numSaves, shuffledPosts.length));
    for (const post of savedPosts) {
      try {
        await prisma.saved_posts.create({
          data: { user_id: user.user_id, post_id: post.content_id }
        });
        saveCount++;
      } catch (e) { }
    }
  }
  console.log(`   ✅ ${saveCount} saved posts\n`);

  // 13. COMMENTS (0-8 per post, 0-3 replies per comment)
  console.log('💬 Creating comments...');
  const comments: any[] = [];

  for (const post of posts) {
    const numComments = randomInt(0, 8);
    for (let c = 0; c < numComments; c++) {
      const postWithContent = await getPostWithContent(post);
      if (!postWithContent) continue;

      const availableAuthors = users.filter((u: any) => !blocksMap.get(postWithContent.content.user_id)?.has(u.user_id));
      if (availableAuthors.length === 0) continue;
      const author = random(availableAuthors);

      // Select hashtags for comment (0-3)
      const commentHashtags: string[] = [];
      const numCommentHashtags = randomInt(0, 3);
      const shuffledForComment = [...HASHTAGS];
      for (let j = shuffledForComment.length - 1; j > 0; j--) {
        const k = Math.floor(Math.random() * (j + 1));
        [shuffledForComment[j], shuffledForComment[k]] = [shuffledForComment[k]!, shuffledForComment[j]!];
      }
      for (let h = 0; h < numCommentHashtags; h++) {
        commentHashtags.push(shuffledForComment[h]!);
      }

      const commentHashtagString = commentHashtags.map(t => `#${t}`).join(' ');
      const commentContent = `Nice find! ${commentHashtagString}`.slice(0, 500);

      const comment = await prisma.comments.create({
        data: {
          content: commentContent,
          user_id: author.user_id,
          post_id: post.content_id,
        },
      });
      comments.push(comment);

      // Link comment hashtags
      for (const tagName of commentHashtags) {
        const hashtagId = hashtagMap.get(tagName);
        if (hashtagId) {
          await prisma.comment_hashtags.create({
            data: { comment_id: comment.comment_id, hashtag_id: hashtagId }
          });
        }
      }

      // Add replies (0-3)
      const numReplies = randomInt(0, 3);
      for (let r = 0; r < numReplies; r++) {
        const replyAuthors = users.filter((u: any) => !blocksMap.get(postWithContent.content.user_id)?.has(u.user_id));
        if (replyAuthors.length === 0) continue;
        const replyAuthor = random(replyAuthors);

        const replyContent = `Great point! #${random(HASHTAGS)}`;
        const reply = await prisma.comments.create({
          data: {
            content: replyContent,
            user_id: replyAuthor.user_id,
            post_id: post.content_id,
            comment_parent_id: comment.comment_id,
          },
        });
        comments.push(reply);
      }
    }
  }
  console.log(`   ✅ ${comments.length} comments\n`);

  // 14. COMMENT LIKES (0-200 per user)
  console.log('👍 Creating comment likes...');
  let commentLikeCount = 0;
  for (const user of users) {
    const numLikes = randomInt(0, 200);
    const shuffledComments = [...comments];
    for (let j = shuffledComments.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [shuffledComments[j], shuffledComments[k]] = [shuffledComments[k], shuffledComments[j]];
    }
    const likedComments = shuffledComments.slice(0, Math.min(numLikes, shuffledComments.length));
    for (const comment of likedComments) {
      try {
        await prisma.comment_likes.create({
          data: { user_id: user.user_id, comment_id: comment.comment_id }
        });
        commentLikeCount++;
      } catch (e) { }
    }
  }
  console.log(`   ✅ ${commentLikeCount} comment likes\n`);

  // 15. STORIES (0-5 per user)
  console.log('📸 Creating stories...');
  let storyCount = 0;
  for (const user of users) {
    const numStories = randomInt(0, 5);
    for (let s = 0; s < numStories; s++) {
      const content = await prisma.contents.create({
        data: {
          user_id: user.user_id,
          type: 'story',
          visibility: 'public',
          content_map: {
            text: `Quick update! #${random(HASHTAGS)}`,
            image: random(MEDIA_URLS.images),
          },
        },
      });
      await prisma.stories.create({
        data: {
          content_id: content.content_id,
          expires_at: new Date(Date.now() + randomInt(1, 24) * 60 * 60 * 1000),
        },
      });
      storyCount++;
    }
  }
  console.log(`   ✅ ${storyCount} stories\n`);

  // 16. STORY VIEWS (0-100 per story)
  console.log('👁️ Creating story views...');
  const allStories = await prisma.stories.findMany();
  let viewCount = 0;
  for (const story of allStories) {
    const storyContent = await prisma.contents.findUnique({ where: { content_id: story.content_id } });
    if (!storyContent) continue;

    const numViews = randomInt(0, 100);
    const availableViewers = users.filter((u: any) =>
      u.user_id !== storyContent.user_id &&
      !blocksMap.get(storyContent.user_id)?.has(u.user_id)
    );
    const shuffledViewers = [...availableViewers];
    for (let j = shuffledViewers.length - 1; j > 0; j--) {
      const k = Math.floor(Math.random() * (j + 1));
      [shuffledViewers[j], shuffledViewers[k]] = [shuffledViewers[k], shuffledViewers[j]];
    }
    const viewers = shuffledViewers.slice(0, Math.min(numViews, shuffledViewers.length));
    for (const viewer of viewers) {
      try {
        await prisma.story_views.create({
          data: { viewer_id: viewer.user_id, story_id: story.content_id }
        });
        viewCount++;
      } catch (e) { }
    }
  }
  console.log(`   ✅ ${viewCount} story views\n`);

  // 17. SCANS (0-10 per user)
  console.log('🔍 Creating scans...');
  let scanCount = 0;
  for (const user of users) {
    const numScans = randomInt(0, 10);
    for (let s = 0; s < numScans; s++) {
      const location = random(locations);
      const content = await prisma.contents.create({
        data: {
          user_id: user.user_id,
          type: 'scan',
          visibility: random(['public', 'private']),
          content_map: { text: `Scan result: Found something interesting!` },
        },
      });
      await prisma.scans.create({
        data: {
          content_id: content.content_id,
          location_id: location.location_id,
          metadata: { depth: randomInt(10, 100), signal: randomInt(1, 100) },
        },
      });
      scanCount++;
    }
  }
  console.log(`   ✅ ${scanCount} scans\n`);

  // 18. NOTIFICATIONS (0-10 per user)
  console.log('🔔 Creating notifications...');
  let notifCount = 0;

  // First, create notification targets for posts that don't have them
  const existingTargets = await prisma.notification_targets.findMany({
    select: { post_id: true }
  });
  const existingPostIds = new Set(existingTargets.map(t => t.post_id));

  for (const post of posts) {
    if (!existingPostIds.has(post.content_id)) {
      try {
        await prisma.notification_targets.create({
          data: { post_id: post.content_id }
        });
      } catch (e) { }
    }
  }

  // Get all targets after creation
  const allTargets = await prisma.notification_targets.findMany();
  const targetByPost = new Map(allTargets.map(t => [t.post_id, t.target_id]));

  // Create notifications
  for (const user of users) {
    const numNotifs = randomInt(0, 10);
    for (let n = 0; n < numNotifs; n++) {
      const actors = users.filter((u: any) => u.user_id !== user.user_id);
      if (actors.length === 0) continue;
      const actor = random(actors);
      if (posts.length === 0) continue;
      const post = random(posts);

      const targetId = targetByPost.get(post.content_id);
      if (!targetId) continue;

      await prisma.notifications.create({
        data: {
          user_id: user.user_id,
          actor_id: actor.user_id,
          type: random(['like', 'comment', 'mention']),
          message: `${actor.username} interacted with your post`,
          notification_target_id: targetId,
        },
      });
      notifCount++;
    }
  }
  console.log(`   ✅ ${notifCount} notifications\n`);

  // 19. REPORTS (only admins/moderators can report)
  console.log('⚠️ Creating reports...');
  const adminsAndMods = users.filter((u: any) => u.role_id === 1 || u.role_id === 2);
  let reportCount = 0;
  for (const reporter of adminsAndMods) {
    const numReports = randomInt(0, 10);
    for (let r = 0; r < numReports; r++) {
      if (posts.length === 0) continue;
      const post = random(posts);

      const target = await prisma.report_targets.create({
        data: { post_id: post.content_id }
      });

      await prisma.reports.create({
        data: {
          reporter_id: reporter.user_id,
          report_target_id: target.target_id,
          reason: random(['Spam', 'Inappropriate', 'Harassment', 'Scam']),
          status: random(['pending', 'reviewed', 'resolved', 'dismissed']),
        },
      });
      reportCount++;
    }
  }
  console.log(`   ✅ ${reportCount} reports\n`);

  console.log('\n🎉 SEEDING COMPLETE!');
  console.log(`📊 Summary:`);
  console.log(`   - ${users.length} users`);
  console.log(`   - ${posts.length} posts`);
  console.log(`   - ${comments.length} comments`);
  console.log(`   - ${storyCount} stories`);
  console.log(`   - ${scanCount} scans`);
  console.log(`   - ${followCount} follows`);
  console.log(`   - ${requestCount} follow requests`);
  console.log(`   - ${blockCount} blocks`);
  console.log(`   - ${likeCount} post likes`);
  console.log(`   - ${saveCount} saved posts`);
  console.log(`   - ${commentLikeCount} comment likes`);
  console.log(`   - ${viewCount} story views`);
  console.log(`   - ${notifCount} notifications`);
  console.log(`   - ${reportCount} reports`);
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());