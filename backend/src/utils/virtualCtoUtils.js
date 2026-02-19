const CATEGORY_LABELS = {
  saas: 'SaaS',
  mobile: 'Mobile App',
  web3: 'Web3 / Blockchain',
  ai: 'AI / ML',
  ecommerce: 'E-commerce',
  other: 'General Product',
};

const CATEGORY_KEYWORDS = {
  mobile: ['mobile', 'ios', 'android', 'react native', 'app store', 'play store'],
  web3: ['web3', 'blockchain', 'crypto', 'defi', 'nft', 'solidity', 'wallet'],
  ai: ['ai', 'ml', 'machine learning', 'llm', 'chatbot', 'recommendation', 'computer vision'],
  ecommerce: ['ecommerce', 'e-commerce', 'shop', 'store', 'cart', 'checkout', 'marketplace'],
  saas: ['saas', 'platform', 'dashboard', 'workspace', 'crm', 'b2b', 'subscription'],
};

const NAME_HINTS = [
  { pattern: /\bdog\b|\bpet\b|\bwalk\b/i, name: 'PawPath' },
  { pattern: /\bgym\b|\bfitness\b|\bworkout\b/i, name: 'FitCircle' },
  { pattern: /\bchat\b|\bmessage\b|\bcommunity\b/i, name: 'PulseLink' },
  { pattern: /\bmarket\b|\bshop\b|\bstore\b/i, name: 'MarketNest' },
  { pattern: /\btravel\b|\btrip\b/i, name: 'TripMosaic' },
  { pattern: /\beducation\b|\blearn\b|\bcourse\b/i, name: 'LearnBridge' },
  { pattern: /\bhealth\b|\bdoctor\b|\bclinic\b/i, name: 'CareRoute' },
];

const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'app',
  'build',
  'create',
  'for',
  'help',
  'i',
  'in',
  'is',
  'make',
  'of',
  'platform',
  'project',
  'that',
  'the',
  'to',
  'want',
  'website',
  'with',
]);

const CATEGORY_STACKS = {
  saas: [
    'React',
    'TypeScript',
    'Node.js',
    'Express',
    'PostgreSQL',
    'Redis',
    'Docker',
  ],
  mobile: [
    'React Native',
    'Expo',
    'TypeScript',
    'Node.js',
    'Firebase',
    'Push Notifications',
  ],
  web3: [
    'React',
    'TypeScript',
    'Solidity',
    'Hardhat',
    'ethers.js',
    'Node.js',
    'PostgreSQL',
  ],
  ai: [
    'React',
    'TypeScript',
    'Python',
    'FastAPI',
    'PyTorch',
    'Vector Database',
    'Node.js',
  ],
  ecommerce: [
    'Next.js',
    'TypeScript',
    'Node.js',
    'Express',
    'PostgreSQL',
    'Stripe',
    'Redis',
  ],
  other: [
    'React',
    'TypeScript',
    'Node.js',
    'Express',
    'PostgreSQL',
  ],
};

const CATEGORY_ROLES = {
  saas: [
    {
      title: 'Frontend Engineer',
      skills: ['React', 'TypeScript', 'State Management', 'Tailwind CSS'],
      spots: 1,
      durationHours: 120,
    },
    {
      title: 'Backend Engineer',
      skills: ['Node.js', 'Express', 'PostgreSQL', 'API Design'],
      spots: 1,
      durationHours: 140,
    },
    {
      title: 'UI/UX Designer',
      skills: ['Figma', 'User Flows', 'Wireframing', 'Design Systems'],
      spots: 1,
      durationHours: 70,
    },
  ],
  mobile: [
    {
      title: 'Mobile App Developer',
      skills: ['React Native', 'Expo', 'TypeScript', 'Mobile UI'],
      spots: 1,
      durationHours: 150,
    },
    {
      title: 'Backend Engineer',
      skills: ['Node.js', 'Express', 'Firebase', 'Auth Flows'],
      spots: 1,
      durationHours: 120,
    },
    {
      title: 'UI/UX Designer',
      skills: ['Figma', 'Mobile UX', 'Prototyping'],
      spots: 1,
      durationHours: 80,
    },
  ],
  web3: [
    {
      title: 'Smart Contract Developer',
      skills: ['Solidity', 'Hardhat', 'OpenZeppelin', 'Smart Contract Testing'],
      spots: 1,
      durationHours: 160,
    },
    {
      title: 'Web3 Frontend Developer',
      skills: ['React', 'TypeScript', 'ethers.js', 'Wallet Integration'],
      spots: 1,
      durationHours: 130,
    },
    {
      title: 'Backend Engineer',
      skills: ['Node.js', 'Event Indexing', 'PostgreSQL', 'Security Best Practices'],
      spots: 1,
      durationHours: 110,
    },
  ],
  ai: [
    {
      title: 'ML Engineer',
      skills: ['Python', 'PyTorch', 'Model Evaluation', 'Prompt Engineering'],
      spots: 1,
      durationHours: 170,
    },
    {
      title: 'Backend AI Engineer',
      skills: ['FastAPI', 'Node.js', 'Vector Database', 'Inference APIs'],
      spots: 1,
      durationHours: 140,
    },
    {
      title: 'Frontend Engineer',
      skills: ['React', 'TypeScript', 'Data Visualization', 'UX for AI Flows'],
      spots: 1,
      durationHours: 120,
    },
  ],
  ecommerce: [
    {
      title: 'Frontend Engineer',
      skills: ['Next.js', 'React', 'TypeScript', 'Responsive UI'],
      spots: 1,
      durationHours: 130,
    },
    {
      title: 'Backend Engineer',
      skills: ['Node.js', 'Express', 'PostgreSQL', 'Payment Integrations'],
      spots: 1,
      durationHours: 150,
    },
    {
      title: 'UI/UX Designer',
      skills: ['Figma', 'Checkout UX', 'Conversion Design'],
      spots: 1,
      durationHours: 80,
    },
  ],
  other: [
    {
      title: 'Full Stack Developer',
      skills: ['React', 'TypeScript', 'Node.js', 'API Development'],
      spots: 1,
      durationHours: 140,
    },
    {
      title: 'UI/UX Designer',
      skills: ['Figma', 'User Journeys', 'Wireframing'],
      spots: 1,
      durationHours: 70,
    },
  ],
};

function toDateInputString(dateValue) {
  const year = dateValue.getFullYear();
  const month = String(dateValue.getMonth() + 1).padStart(2, '0');
  const day = String(dateValue.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function toTitleCase(value) {
  return String(value || '')
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

function hashString(value) {
  return String(value || '').split('').reduce((acc, char) => {
    return (acc * 31 + char.charCodeAt(0)) >>> 0;
  }, 0);
}

function uniqueCaseInsensitive(values = []) {
  const seen = new Set();
  return values.filter((value) => {
    const normalized = String(value || '').trim();
    if (!normalized) return false;
    const key = normalized.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function detectCategory(ideaText) {
  const lowered = String(ideaText || '').toLowerCase();
  const orderedCategories = ['mobile', 'web3', 'ai', 'ecommerce', 'saas'];
  for (const category of orderedCategories) {
    const keywords = CATEGORY_KEYWORDS[category] || [];
    if (keywords.some((keyword) => lowered.includes(keyword))) {
      return category;
    }
  }
  if (lowered.includes('website') || lowered.includes('web app')) return 'saas';
  return 'other';
}

function buildProjectName(ideaText, category) {
  const normalizedIdea = String(ideaText || '').trim();
  for (const entry of NAME_HINTS) {
    if (entry.pattern.test(normalizedIdea)) {
      return entry.name;
    }
  }

  const prefixesByCategory = {
    saas: ['Flow', 'Sync', 'Scale', 'Cloud'],
    mobile: ['Go', 'Pocket', 'Pulse', 'Swift'],
    web3: ['Chain', 'Block', 'Token', 'Ledger'],
    ai: ['Cortex', 'Signal', 'Neuro', 'Insight'],
    ecommerce: ['Cart', 'Shop', 'Market', 'Retail'],
    other: ['Nova', 'Launch', 'Orbit', 'Bridge'],
  };
  const suffixes = ['Hub', 'Link', 'Forge', 'Pilot', 'Nest', 'Core'];

  const words = normalizedIdea
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((word) => word && word.length > 2 && !STOP_WORDS.has(word));

  if (words.length > 0) {
    const seed = hashString(normalizedIdea);
    const rootWord = toTitleCase(words[seed % words.length]);
    const suffix = suffixes[seed % suffixes.length];
    return `${rootWord}${suffix}`;
  }

  const categoryPrefixes = prefixesByCategory[category] || prefixesByCategory.other;
  const seed = hashString(normalizedIdea || category);
  return `${categoryPrefixes[seed % categoryPrefixes.length]}${suffixes[seed % suffixes.length]}`;
}

function buildTechStack(category, ideaText) {
  const lowered = String(ideaText || '').toLowerCase();
  const baseStack = CATEGORY_STACKS[category] || CATEGORY_STACKS.other;
  const additions = [];

  if (lowered.includes('chat') || lowered.includes('message') || lowered.includes('real-time')) {
    additions.push('Socket.IO');
  }
  if (lowered.includes('payment') || lowered.includes('checkout')) {
    additions.push('Stripe');
  }
  if (lowered.includes('analytics') || lowered.includes('dashboard')) {
    additions.push('Product Analytics');
  }
  if (lowered.includes('notification')) {
    additions.push('Push Notifications');
  }

  return uniqueCaseInsensitive([...baseStack, ...additions]);
}

function buildRoles(category, ideaText) {
  const lowered = String(ideaText || '').toLowerCase();
  const baseRoles = CATEGORY_ROLES[category] || CATEGORY_ROLES.other;
  const roles = baseRoles.map((role) => ({ ...role, skills: [...role.skills] }));

  const hasRole = (titleKeyword) =>
    roles.some((role) => String(role.title).toLowerCase().includes(titleKeyword));

  if ((lowered.includes('chat') || lowered.includes('real-time')) && hasRole('backend')) {
    roles.forEach((role) => {
      if (String(role.title).toLowerCase().includes('backend')) {
        role.skills = uniqueCaseInsensitive([...role.skills, 'Socket.IO', 'WebSockets']);
      }
    });
  }

  if (lowered.includes('admin') || lowered.includes('analytics')) {
    roles.forEach((role) => {
      if (String(role.title).toLowerCase().includes('frontend')) {
        role.skills = uniqueCaseInsensitive([...role.skills, 'Dashboard UI', 'Charts']);
      }
    });
  }

  if ((lowered.includes('design') || lowered.includes('ux')) && !hasRole('designer')) {
    roles.push({
      title: 'UI/UX Designer',
      skills: ['Figma', 'UX Research', 'Wireframing'],
      spots: 1,
      durationHours: 60,
    });
  }

  return roles;
}

function chooseCommitment(category, ideaText) {
  const lowered = String(ideaText || '').toLowerCase();
  if (lowered.includes('weekend') || lowered.includes('side project')) return 'flexible';
  if (category === 'web3' || category === 'ai') return 'full_time';
  return 'part_time';
}

function estimateTimeline(category, ideaText) {
  const complexityByCategory = {
    saas: 10,
    mobile: 12,
    web3: 14,
    ai: 14,
    ecommerce: 11,
    other: 10,
  };
  let weeks = complexityByCategory[category] || 10;
  const lowered = String(ideaText || '').toLowerCase();

  if (lowered.includes('chat') || lowered.includes('real-time')) weeks += 1;
  if (lowered.includes('payment') || lowered.includes('blockchain')) weeks += 1;
  if (lowered.includes('marketplace')) weeks += 1;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 3);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + weeks * 7);

  return {
    startDate: toDateInputString(startDate),
    endDate: toDateInputString(endDate),
    estimatedWeeks: weeks,
  };
}

function buildDescription(projectName, category, ideaText, techStack) {
  const label = CATEGORY_LABELS[category] || CATEGORY_LABELS.other;
  const cleanedIdea = String(ideaText || '').trim().replace(/\s+/g, ' ');
  const stackPreview = techStack.slice(0, 3).join(', ');

  return [
    `${projectName} is a ${label.toLowerCase()} product built around the idea: "${cleanedIdea}".`,
    `The MVP will focus on a polished user flow, secure authentication, and reliable collaboration features to validate product-market fit quickly.`,
    `The recommended implementation stack starts with ${stackPreview}, allowing fast delivery and room to scale.`,
  ].join(' ');
}

function generateVirtualCtoPlan(ideaText) {
  const normalizedIdea = String(ideaText || '').trim().replace(/\s+/g, ' ');
  const category = detectCategory(normalizedIdea);
  const title = buildProjectName(normalizedIdea, category);
  const techStack = buildTechStack(category, normalizedIdea);
  const roles = buildRoles(category, normalizedIdea);
  const commitment = chooseCommitment(category, normalizedIdea);
  const timeline = estimateTimeline(category, normalizedIdea);
  const description = buildDescription(title, category, normalizedIdea, techStack);

  return {
    title,
    description,
    category,
    categoryLabel: CATEGORY_LABELS[category] || CATEGORY_LABELS.other,
    commitment,
    startDate: timeline.startDate,
    endDate: timeline.endDate,
    estimatedWeeks: timeline.estimatedWeeks,
    techStack,
    roles,
    summary: `Built a ${CATEGORY_LABELS[category] || 'project'} blueprint with ${roles.length} hiring roles and a ${timeline.estimatedWeeks}-week delivery plan.`,
  };
}

module.exports = {
  generateVirtualCtoPlan,
};
