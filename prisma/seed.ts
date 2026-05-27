import { prisma } from '../src/config/prisma.js';
import bcrypt from 'bcrypt';


async function cleanDatabase() {
  // Delete in reverse dependency order
  await prisma.messages.deleteMany();
  await prisma.chat_participants.deleteMany();
  await prisma.chats.deleteMany();
  await prisma.saved_posts.deleteMany();
  await prisma.comment_likes.deleteMany();
  await prisma.comments.deleteMany();
  await prisma.post_likes.deleteMany();
  await prisma.post_tags.deleteMany();
  await prisma.content_hashtags.deleteMany();
  await prisma.hashtags.deleteMany();
  await prisma.posts.deleteMany();
  await prisma.stories.deleteMany();
  await prisma.scans.deleteMany();
  await prisma.media.deleteMany();
  await prisma.contents.deleteMany();
  await prisma.follows.deleteMany();
  await prisma.follow_requests.deleteMany();
  await prisma.profiles.deleteMany();
  await prisma.device_tokens.deleteMany();
  await prisma.users.deleteMany();
  await prisma.blocks.deleteMany();
  await prisma.reports.deleteMany();
  await prisma.report_targets.deleteMany();
  await prisma.locations.deleteMany();
  await prisma.cities.deleteMany();
  await prisma.countries.deleteMany();
  await prisma.categories.deleteMany();
  await prisma.tags.deleteMany();
  await prisma.roles.deleteMany();
}

async function seed() {
  console.log('Cleaning database...');
  await cleanDatabase();

  // ── Roles ─────────────────────────────────────────
  const roles = await Promise.all([
    prisma.roles.create({ data: { role_name: 'admin' } }),
    prisma.roles.create({ data: { role_name: 'moderator' } }),
    prisma.roles.create({ data: { role_name: 'user' } }),
  ]);
  const [adminRole, modRole, userRole] = roles;

  // ── Categories ────────────────────────────────────
  const categoryNames = [
    "Coins & Currency",
    "Gemstones & Minerals",
    "Jewelry & Accessories",
    "Artifacts & Relics",
    "Gold & Precious Metals",
    "Silver & Base Metals",
    "Underwater Finds",
    "Land Detecting",
    "Cache & Hoard",
    "Tools & Equipment",
    "Maps & Research",
    "Identification Help",
    "Questions & Help",
    "Show & Tell",
    "Tips & Techniques",
    "Legal & Permissions",
    "Locations & Sites",
    "Restoration & Cleaning",
    "Valuation & Appraisal",
    "Beginner's Corner",
    "News & Events",
    "Trade & Sell",
  ];
  await prisma.categories.createMany({ data: categoryNames.map(name => ({ name })) });
  const categories = await prisma.categories.findMany();

  // ── Tags ──────────────────────────────────────────
  const tagNames = ['prisma', 'graphql', 'metal detecting', 'gem hunting', 'underwater'];
  await prisma.tags.createMany({ data: tagNames.map(name => ({ name })) });
  const tags = await prisma.tags.findMany();

  // ── Countries, Cities, Locations ──────────────────
  const countryNames = [
    'United States', 'Russia', 'France', 'Egypt', 'Italy', 'United Kingdom',
    'Germany', 'Japan', 'Australia', 'Canada', 'Brazil', 'India',
  ];
  await prisma.countries.createMany({ data: countryNames.map(name => ({ name })) });
  const countries = await prisma.countries.findMany();
  const countryMap = new Map(countries.map(c => [c.name, c.country_id]));

  const citiesData = [
    { name: 'New York',         country: 'United States' },
    { name: 'Los Angeles',      country: 'United States' },
    { name: 'Chicago',          country: 'United States' },
    { name: 'Texas',            country: 'United States' },
    { name: 'Moscow',           country: 'Russia' },
    { name: 'Saint Petersburg', country: 'Russia' },
    { name: 'Paris',            country: 'France' },
    { name: 'Lyon',             country: 'France' },
    { name: 'Marseille',        country: 'France' },
    { name: 'Cairo',            country: 'Egypt' },
    { name: 'Luxor',            country: 'Egypt' },
    { name: 'Rome',             country: 'Italy' },
    { name: 'Milan',            country: 'Italy' },
    { name: 'Naples',           country: 'Italy' },
    { name: 'London',           country: 'United Kingdom' },
    { name: 'Manchester',       country: 'United Kingdom' },
    { name: 'Berlin',           country: 'Germany' },
    { name: 'Munich',           country: 'Germany' },
    { name: 'Tokyo',            country: 'Japan' },
    { name: 'Osaka',            country: 'Japan' },
    { name: 'Sydney',           country: 'Australia' },
    { name: 'Melbourne',        country: 'Australia' },
    { name: 'Toronto',          country: 'Canada' },
    { name: 'Vancouver',        country: 'Canada' },
    { name: 'São Paulo',        country: 'Brazil' },
    { name: 'Rio de Janeiro',   country: 'Brazil' },
    { name: 'Delhi',            country: 'India' },
    { name: 'Mumbai',           country: 'India' },
  ];
  await prisma.cities.createMany({
    data: citiesData.map(c => ({
      name: c.name,
      country_id: countryMap.get(c.country)!,
    })),
  });
  const cities = await prisma.cities.findMany();

  // Create a few locations
  const locations = await Promise.all([
    prisma.locations.create({
      data: {
        country_id: countryMap.get('United States')!,
        city_id: cities.find(c => c.name === 'New York')!.city_id,
        lat: 40.7128,
        lng: -74.006,
        place_id: 'nyc',
      },
    }),
    prisma.locations.create({
      data: {
        country_id: countryMap.get('France')!,
        city_id: cities.find(c => c.name === 'Paris')!.city_id,
        lat: 48.8566,
        lng: 2.3522,
        place_id: 'paris',
      },
    }),
    prisma.locations.create({
      data: {
        country_id: countryMap.get('Egypt')!,
        city_id: cities.find(c => c.name === 'Luxor')!.city_id,
        lat: 25.6833,
        lng: 32.65,
        place_id: 'luxor',
      },
    }),
  ]);
  const [locNY, locParis, locLuxor] = locations;

  // ── Users ─────────────────────────────────────────
  const hashedPassword = await bcrypt.hash('password123', 10);
  const users = await Promise.all([
    prisma.users.create({
      data: {
        username: 'admin',
        email: 'admin@treasure.com',
        password: hashedPassword,
        role_id: adminRole.role_id,
      },
    }),
    prisma.users.create({
      data: {
        username: 'moderator',
        email: 'mod@treasure.com',
        password: hashedPassword,
        role_id: modRole.role_id,
      },
    }),
    prisma.users.create({
      data: {
        username: 'john_digger',
        email: 'john@treasure.com',
        password: hashedPassword,
        role_id: userRole.role_id,
      },
    }),
    prisma.users.create({
      data: {
        username: 'gem_hunter',
        email: 'gem@treasure.com',
        password: hashedPassword,
        role_id: userRole.role_id,
      },
    }),
    prisma.users.create({
      data: {
        username: 'coin_lover',
        email: 'coin@treasure.com',
        password: hashedPassword,
        role_id: userRole.role_id,
      },
    }),
    prisma.users.create({
      data: {
        username: 'deep_diver',
        email: 'diver@treasure.com',
        password: hashedPassword,
        role_id: userRole.role_id,
      },
    }),
    prisma.users.create({
      data: {
        username: 'relic_rose',
        email: 'relic@treasure.com',
        password: hashedPassword,
        role_id: userRole.role_id,
      },
    }),
  ]);
  const [adminUser, modUser, john, gem, coin, dive, rose] = users;

  // ── Profiles ─────────────────────────────────────
  await Promise.all([
    prisma.profiles.create({
      data: {
        user_id: adminUser.user_id,
        first_name: 'Admin',
        last_name: 'User',
        bio: 'System administrator',
        birth_location_id: locNY.location_id,
        current_location_id: locNY.location_id,
      },
    }),
    prisma.profiles.create({
      data: {
        user_id: john.user_id,
        first_name: 'John',
        last_name: 'Smith',
        bio: 'Metal detectorist for 10 years. Love finding old coins!',
        birth_location_id: locParis.location_id,
        current_location_id: locNY.location_id,
      },
    }),
    prisma.profiles.create({
      data: {
        user_id: gem.user_id,
        first_name: 'Emma',
        last_name: 'Carter',
        bio: 'Gemstone collector and amateur geologist.',
        birth_location_id: locLuxor.location_id,
        current_location_id: locParis.location_id,
      },
    }),
    prisma.profiles.create({
      data: {
        user_id: coin.user_id,
        first_name: 'Mike',
        last_name: 'Turner',
        bio: 'Numismatist and history enthusiast.',
        birth_location_id: locNY.location_id,
        current_location_id: locNY.location_id,
      },
    }),
    prisma.profiles.create({
      data: {
        user_id: dive.user_id,
        first_name: 'Sara',
        last_name: 'Nguyen',
        bio: 'Underwater treasure hunter and scuba diver.',
        birth_location_id: locParis.location_id,
        current_location_id: locLuxor.location_id,
      },
    }),
    prisma.profiles.create({
      data: {
        user_id: rose.user_id,
        first_name: 'Rose',
        last_name: 'Patel',
        bio: 'Relic hunter, focusing on ancient artifacts.',
        birth_location_id: locLuxor.location_id,
        current_location_id: locParis.location_id,
      },
    }),
  ]);

  // ── Follows ─────────────────────────────────────
  await prisma.follows.createMany({
    data: [
      { follower_id: john.user_id, following_id: gem.user_id },
      { follower_id: john.user_id, following_id: dive.user_id },
      { follower_id: gem.user_id,  following_id: john.user_id },
      { follower_id: coin.user_id, following_id: john.user_id },
      { follower_id: dive.user_id, following_id: rose.user_id },
      { follower_id: rose.user_id, following_id: gem.user_id },
    ],
  });

  // ── Content & Posts ─────────────────────────────
  const catGems = categories.find(c => c.name === "Gemstones & Minerals")!;
  const catCoins = categories.find(c => c.name === "Coins & Currency")!;
  const catUnder = categories.find(c => c.name === "Underwater Finds")!;
  const catQA = categories.find(c => c.name === "Questions & Help")!;
  const catShow = categories.find(c => c.name === "Show & Tell")!;

  async function createPost(userId: string, categoryId: number, locationId: string | null, text: string) {
    const content = await prisma.contents.create({
      data: {
        user_id: userId,
        type: 'post',
        visibility: 'public',
        content_map: {'': ''}
      },
    });
    return prisma.posts.create({
      data: {
        content_id: content.content_id,
        category_id: categoryId,
        location_id: locationId,
        text_content: text,
      },
    });
  }

  const post1 = await createPost(gem.user_id, catGems.category_id, locParis.location_id,
    "Just found this beautiful alexandrite gemstone! The color change from green to red is stunning. Anyone else collect alexandrite?");
  const post2 = await createPost(john.user_id, catCoins.category_id, locNY.location_id,
    "Found a 1921 Morgan Silver Dollar today with my detector. In pretty good condition too!");
  const post3 = await createPost(dive.user_id, catUnder.category_id, locLuxor.location_id,
    "Diving off the coast last weekend and found what looks like an old anchor. Possibly 18th century? Thoughts?");
  const post4 = await createPost(coin.user_id, catQA.category_id, null,
    "What's the best metal detector for beginners under $300? Looking to get into the hobby.");
  const post5 = await createPost(rose.user_id, catShow.category_id, locParis.location_id,
    "My latest haul from an old farmstead. Roman-era bronze brooch and some medieval pottery shards!");

  // ── Post Likes ──────────────────────────────────
  await prisma.post_likes.createMany({
    data: [
      { user_id: john.user_id, post_id: post1.content_id },
      { user_id: coin.user_id, post_id: post1.content_id },
      { user_id: dive.user_id, post_id: post1.content_id },
      { user_id: gem.user_id,  post_id: post2.content_id },
      { user_id: rose.user_id, post_id: post2.content_id },
      { user_id: john.user_id, post_id: post3.content_id },
      { user_id: gem.user_id,  post_id: post5.content_id },
      { user_id: coin.user_id, post_id: post5.content_id },
    ],
  });

  // ── Comments & Likes ────────────────────────────
  const comment1 = await prisma.comments.create({
    data: {
      content: "That color change is incredible! Alexandrite is one of my favorites.",
      user_id: john.user_id,
      post_id: post1.content_id,
    },
  });
  const comment2 = await prisma.comments.create({
    data: {
      content: "Where did you find it? Was it at a gem show or in the wild?",
      user_id: coin.user_id,
      post_id: post1.content_id,
    },
  });
  // reply
  await prisma.comments.create({
    data: {
      content: "Found it at a small gem show actually. Got lucky!",
      user_id: gem.user_id,
      post_id: post1.content_id,
      comment_parent_id: comment2.comment_id,
    },
  });
  await prisma.comments.create({
    data: {
      content: "Amazing find! Morgan dollars are so beautiful.",
      user_id: gem.user_id,
      post_id: post2.content_id,
    },
  });
  await prisma.comments.create({
    data: {
      content: "I started with a Garrett ACE 300, great beginner detector!",
      user_id: rose.user_id,
      post_id: post4.content_id,
    },
  });
  await prisma.comments.create({
    data: {
      content: "Minelab GO-FIND 40 is also worth checking out in that budget.",
      user_id: john.user_id,
      post_id: post4.content_id,
    },
  });

  // Comment Likes
  await prisma.comment_likes.createMany({
    data: [
      { user_id: gem.user_id,  comment_id: comment1.comment_id },
      { user_id: dive.user_id, comment_id: comment1.comment_id },
      { user_id: gem.user_id,  comment_id: comment2.comment_id },
    ],
  });

  // ── Hashtags & content_hashtags ──────────────────
  const hashtagNames = ['alexandrite', 'gemhunting', 'metaldetecting', 'silverdollar', 'underwaterfinds', 'treasurehunting', 'relics'];
  await prisma.hashtags.createMany({ data: hashtagNames.map(name => ({ name })) });
  const hashtags = await prisma.hashtags.findMany();
  const htMap = new Map(hashtags.map(h => [h.name, h.hashtag_id]));

  await prisma.content_hashtags.createMany({
    data: [
      { content_id: post1.content_id, hashtag_id: htMap.get('alexandrite')! },
      { content_id: post1.content_id, hashtag_id: htMap.get('gemhunting')! },
      { content_id: post1.content_id, hashtag_id: htMap.get('treasurehunting')! },
      { content_id: post2.content_id, hashtag_id: htMap.get('metaldetecting')! },
      { content_id: post2.content_id, hashtag_id: htMap.get('silverdollar')! },
      { content_id: post2.content_id, hashtag_id: htMap.get('treasurehunting')! },
      { content_id: post3.content_id, hashtag_id: htMap.get('underwaterfinds')! },
      { content_id: post3.content_id, hashtag_id: htMap.get('treasurehunting')! },
      { content_id: post5.content_id, hashtag_id: htMap.get('relics')! },
    ],
  });

  // ── Post Tags (optional) ────────────────────────
  const prismaTag = tags.find(t => t.name === 'prisma')!;
  const graphqlTag = tags.find(t => t.name === 'graphql')!;
  await prisma.post_tags.createMany({
    data: [
      { post_id: post1.content_id, tag_id: prismaTag.tag_id },
      { post_id: post2.content_id, tag_id: graphqlTag.tag_id },
    ],
  });

  // ── Saved Posts ─────────────────────────────────
  await prisma.saved_posts.createMany({
    data: [
      { user_id: john.user_id, post_id: post1.content_id },
      { user_id: gem.user_id,  post_id: post2.content_id },
      { user_id: coin.user_id, post_id: post3.content_id },
      { user_id: dive.user_id, post_id: post5.content_id },
    ],
  });

  // ── Chat & Messages ─────────────────────────────
  const chat = await prisma.chats.create({
    data: { title: 'Gem Hunters', is_group_chat: true },
  });
  await prisma.chat_participants.createMany({
    data: [
      { chat_id: chat.chat_id, user_id: gem.user_id },
      { chat_id: chat.chat_id, user_id: john.user_id },
      { chat_id: chat.chat_id, user_id: dive.user_id },
    ],
  });
  await prisma.messages.createMany({
    data: [
      { chat_id: chat.chat_id, sender_id: gem.user_id,  text_content: "Hey everyone! Anyone going to the gem show next weekend?" },
      { chat_id: chat.chat_id, sender_id: john.user_id, text_content: "I'll be there! Hope to find some alexandrite." },
      { chat_id: chat.chat_id, sender_id: dive.user_id, text_content: "Can't make it, going diving. Good luck though!" },
    ],
  });

  console.log("Seeding complete!");
}

seed()
  .catch(console.error)
  .finally(() => prisma.$disconnect());