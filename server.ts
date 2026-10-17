import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Password hashing helper
function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password + '_beautilicious_salt_2026').digest('hex');
}

// Generate Auth Token
function generateToken(userId: string): string {
  return crypto.randomBytes(32).toString('hex') + '_' + userId;
}

// Default Seed Data
function getDefaultData() {
  const adminPasswordHash = hashPassword('beautilicious2026!');

  return {
    admin: {
      id: 'admin-1',
      username: 'admin',
      name: 'Ketna & Studio Management',
      passwordHash: adminPasswordHash,
      token: '',
      role: 'owner'
    },
    settings: {
      brandName: 'Beautilicious by Ketna',
      nailsStudioName: 'Beautilicious Nails Studio',
      ownerName: 'Ketna',
      tagline: 'Editorial Soft Luxury Beauty & Bespoke Nail Artistry',
      phone: '+1 (415) 890-5241',
      whatsappNumber: '14158905241',
      email: 'appointments@beautilicious.com',
      address: 'Suite 402, Couture Atelier Boulevard (By Appointment Only)',
      city: 'San Francisco Bay Area',
      googleMapsEmbed: 'https://maps.google.com/?q=Luxury+Boutique+Beauty+Studio',
      instagramMain: 'https://www.instagram.com/_beautilicious_by_ketna_/',
      instagramNails: 'https://www.instagram.com/_beautilicious_nails_studio__/',
      openingHours: [
        { day: 'Monday', open: '10:00 AM', close: '07:00 PM', closed: false },
        { day: 'Tuesday', open: '10:00 AM', close: '07:00 PM', closed: false },
        { day: 'Wednesday', open: '10:00 AM', close: '07:00 PM', closed: false },
        { day: 'Thursday', open: '10:00 AM', close: '08:00 PM', closed: false },
        { day: 'Friday', open: '09:30 AM', close: '08:00 PM', closed: false },
        { day: 'Saturday', open: '09:00 AM', close: '06:30 PM', closed: false },
        { day: 'Sunday', open: '11:00 AM', close: '05:00 PM', closed: true }
      ],
      brandArchitecture: 'dual', // Dual handles both accounts smoothly
      bookingApprovalMode: 'owner_approval',
      cancellationPolicy: 'Appointments may be rescheduled or cancelled up to 24 hours prior without penalty. Late cancellations or no-shows incur a 50% reservation fee.',
      seoTitle: 'Beautilicious by Ketna | Luxury Beauty & Nail Studio',
      seoDescription: 'Bespoke couture nail artistry, Russian manicure technique, and bespoke luxury beauty treatments curated by Ketna.',
      heroHeadline: 'Beauty in Every Detail',
      heroSubheadline: 'Where bespoke couture nail artistry meets high-fashion beauty care in an editorial sanctuary designed for modern refinement.',
      enableOffers: true,
      seasonalOfferText: 'Complimentary cuticle elixir and hand massage included with all Signature Couture Manicures this season.'
    },
    categories: [
      { id: 'cat-1', name: 'Couture Nail Art & Extensions', studio: 'nails', description: 'Handcrafted custom nail artistry, chrome finishes, and structured builder gel.', order: 1 },
      { id: 'cat-2', name: 'Precision Gel & Russian Care', studio: 'nails', description: 'Flawless dry manicure technique, cuticle perfection, and long-lasting non-toxic gel.', order: 2 },
      { id: 'cat-3', name: 'Refills, Restorations & Removals', studio: 'nails', description: 'Gentle safe removals, apex rebalancing, and natural nail health reinforcement.', order: 3 },
      { id: 'cat-4', name: 'Lash Architecture & Brow Couture', studio: 'beauty', description: 'Soft lash lifting, keratin lamination, and bespoke architectural brow sculpting.', order: 4 },
      { id: 'cat-5', name: 'Luminous Editorial Facials', studio: 'beauty', description: 'Hydrating glass skin therapies, lymphatic sculpting, and bespoke glow treatments.', order: 5 },
      { id: 'cat-6', name: 'Bridal & Red Carpet Packages', studio: 'both', description: 'Comprehensive curated bridal beauty and bespoke heirloom nail styling.', order: 6 }
    ],
    services: [
      {
        id: 'srv-1',
        name: 'The Signature Couture Gel Set',
        category: 'Couture Nail Art & Extensions',
        studio: 'nails',
        description: 'Bespoke manicure with Japanese builder gel, delicate hand-painted minimalist nail art, pearlescent micro-chrome, and botanical cuticle bath.',
        priceType: 'starting_at',
        price: 2800,
        currency: '₹',
        durationMinutes: 90,
        image: '/src/assets/images/nail_art_couture_showcase_1791786283381.jpg',
        featured: true,
        order: 1,
        active: true,
        packageVariants: [
          { name: 'Tier 1: Minimalist Chrome & Negative Space', price: 2800, duration: 90 },
          { name: 'Tier 2: Intricate Hand-Painted & 3D Charms', price: 3600, duration: 110 }
        ]
      },
      {
        id: 'srv-2',
        name: 'Precision Russian Dry Manicure',
        category: 'Precision Gel & Russian Care',
        studio: 'nails',
        description: 'Advanced e-file cuticle detailing for immaculate precision, flawless polish placement under the cuticle line, and strengthening rubber base.',
        priceType: 'fixed',
        price: 2400,
        currency: '₹',
        durationMinutes: 75,
        image: '/src/assets/images/hero_luxury_studio_editorial_1791786271003.jpg',
        featured: true,
        order: 2,
        active: true
      },
      {
        id: 'srv-3',
        name: 'Sculpted Gel Extensions (Apres / Hard Gel)',
        category: 'Couture Nail Art & Extensions',
        studio: 'nails',
        description: 'Full-set tailored nail extensions designed with ideal apex architecture to flatter natural finger proportions. Includes single tone gel or glazed donut sheen.',
        priceType: 'starting_at',
        price: 3800,
        currency: '₹',
        durationMinutes: 105,
        image: '/src/assets/images/nail_art_couture_showcase_1791786283381.jpg',
        featured: true,
        order: 3,
        active: true
      },
      {
        id: 'srv-4',
        name: 'Gentle Restoration, Rebalance & Refill',
        category: 'Refills, Restorations & Removals',
        studio: 'nails',
        description: '3–4 week infill, structural apex rebalancing, natural plate repair, and fresh glossy gel application.',
        priceType: 'fixed',
        price: 1900,
        currency: '₹',
        durationMinutes: 60,
        image: '/src/assets/images/hero_luxury_studio_editorial_1791786271003.jpg',
        featured: false,
        order: 4,
        active: true
      },
      {
        id: 'srv-5',
        name: 'Luminous Sculpting Facial Glow',
        category: 'Luminous Editorial Facials',
        studio: 'beauty',
        description: 'Deep hydration infusion, buccal lymphatic contouring, cryo-sculpting globes, and high-potency antioxidant serum veil for red carpet radiance.',
        priceType: 'fixed',
        price: 3500,
        currency: '₹',
        durationMinutes: 75,
        image: '/src/assets/images/beauty_facial_glow_portrait_1791786295901.jpg',
        featured: true,
        order: 5,
        active: true
      },
      {
        id: 'srv-6',
        name: 'Couture Lash Lift & Keratin Tint',
        category: 'Lash Architecture & Brow Couture',
        studio: 'beauty',
        description: 'Natural lash elevation infused with strengthening vegan keratin and deep glossy pigment for effortless 6–8 week flutter.',
        priceType: 'fixed',
        price: 2200,
        currency: '₹',
        durationMinutes: 60,
        image: '/src/assets/images/beauty_facial_glow_portrait_1791786295901.jpg',
        featured: true,
        order: 6,
        active: true
      },
      {
        id: 'srv-7',
        name: 'Bespoke Bridal Atelier Experience',
        category: 'Bridal & Red Carpet Packages',
        studio: 'both',
        description: 'Comprehensive wedding preparation: consultation, personalized nail moodboard, tailored champagne manicure with heirloom crystals, and skin prep glow.',
        priceType: 'quote',
        price: 7500,
        currency: '₹',
        durationMinutes: 150,
        image: '/src/assets/images/studio_interior_warm_ivory_1791786307960.jpg',
        featured: true,
        order: 7,
        active: true
      }
    ],
    gallery: [
      {
        id: 'gal-1',
        title: 'Micro-French Chrome Almond',
        category: 'Couture Nail Art',
        studio: 'nails',
        imageUrl: '/src/assets/images/nail_art_couture_showcase_1791786283381.jpg',
        caption: 'Refined silver mirror tips on glazed sheer milky base with subtle delicate pearl accents.',
        featured: true,
        order: 1,
        likesCount: 142,
        createdAt: '2026-03-15'
      },
      {
        id: 'gal-2',
        title: 'Editorial Studio Atmosphere',
        category: 'Studio Experience',
        studio: 'both',
        imageUrl: '/src/assets/images/studio_interior_warm_ivory_1791786307960.jpg',
        caption: 'Our serene travertine reception and dedicated custom manicure suites designed for tranquil luxury.',
        featured: true,
        order: 2,
        likesCount: 98,
        createdAt: '2026-03-20'
      },
      {
        id: 'gal-3',
        title: 'Minimalist Clean Radiance',
        category: 'Skin & Radiance',
        studio: 'beauty',
        imageUrl: '/src/assets/images/beauty_facial_glow_portrait_1791786295901.jpg',
        caption: 'Post-treatment luminous finish using cold-pressed botanical hydration.',
        featured: true,
        order: 3,
        likesCount: 119,
        createdAt: '2026-03-22'
      },
      {
        id: 'gal-4',
        title: 'Founder Ketna at Atelier',
        category: 'Master Artistry',
        studio: 'both',
        imageUrl: '/src/assets/images/founder_ketna_portrait_1791786317917.jpg',
        caption: 'Ketna — Dedicated to high-precision artistry and warm personal hospitality.',
        featured: true,
        order: 4,
        likesCount: 230,
        createdAt: '2026-03-25'
      },
      {
        id: 'gal-5',
        title: 'Signature Russian Manicure Detail',
        category: 'Precision Gel & Russian Care',
        studio: 'nails',
        imageUrl: '/src/assets/images/hero_luxury_studio_editorial_1791786271003.jpg',
        caption: 'Flawless edge refinement and natural nail strengthening with botanical cuticle elixir.',
        featured: true,
        order: 5,
        likesCount: 167,
        createdAt: '2026-03-28'
      }
    ],
    bookings: [
      {
        id: 'bk-1',
        referenceNumber: 'BL-8241',
        customerName: 'Elena Rostova',
        customerEmail: 'elena.rostova@example.com',
        customerPhone: '+1 (415) 555-0192',
        serviceId: 'srv-1',
        serviceName: 'The Signature Couture Gel Set',
        category: 'Couture Nail Art & Extensions',
        studio: 'nails',
        artist: 'Ketna (Founder / Master Artist)',
        date: '2026-10-14',
        timeSlot: '11:00 AM',
        durationMinutes: 90,
        priceEstimate: '₹2,800+',
        specialRequests: 'Preference for subtle chrome almond shape and soft champagne tone.',
        status: 'confirmed',
        internalNotes: 'VIP client, prefers warm herbal tea on arrival.',
        createdAt: '2026-10-10T14:20:00Z',
        updatedAt: '2026-10-10T15:00:00Z'
      },
      {
        id: 'bk-2',
        referenceNumber: 'BL-9104',
        customerName: 'Sophia Chen',
        customerEmail: 'sophia.chen@example.com',
        customerPhone: '+1 (415) 555-0381',
        serviceId: 'srv-5',
        serviceName: 'Luminous Sculpting Facial Glow',
        category: 'Luminous Editorial Facials',
        studio: 'beauty',
        artist: 'Ketna (Founder / Master Artist)',
        date: '2026-10-15',
        timeSlot: '02:00 PM',
        durationMinutes: 75,
        priceEstimate: '₹3,500',
        specialRequests: 'Sensitive skin prone to seasonal redness.',
        status: 'pending',
        internalNotes: 'Follow up regarding gentle rosehip calming oil.',
        createdAt: '2026-10-11T09:15:00Z',
        updatedAt: '2026-10-11T09:15:00Z'
      },
      {
        id: 'bk-3',
        referenceNumber: 'BL-7749',
        customerName: 'Marcus & Camille Ward',
        customerEmail: 'camille.ward@example.com',
        customerPhone: '+1 (415) 555-0814',
        serviceId: 'srv-7',
        serviceName: 'Bespoke Bridal Atelier Experience',
        category: 'Bridal & Red Carpet Packages',
        studio: 'both',
        artist: 'Ketna (Founder / Master Artist)',
        date: '2026-10-18',
        timeSlot: '10:00 AM',
        durationMinutes: 150,
        priceEstimate: 'Custom Quote (₹7,500+)',
        specialRequests: 'Wedding is scheduled for November 14th in Napa Valley.',
        status: 'confirmed',
        internalNotes: 'Bridal trial set + custom moodboard confirmed.',
        createdAt: '2026-10-09T18:30:00Z',
        updatedAt: '2026-10-09T19:10:00Z'
      }
    ],
    inquiries: [
      {
        id: 'inq-1',
        name: 'Victoria Vance',
        email: 'victoria.v@example.com',
        phone: '+1 (415) 555-7822',
        subject: 'Bridal Party Appointment Inquiry',
        message: 'Hello Ketna! I am planning my wedding party for 4 bridesmaids next spring. Do you provide full studio buyout or group sessions for customized manicures and facial prep?',
        preferredContact: 'whatsapp',
        status: 'new',
        createdAt: '2026-10-11T16:45:00Z'
      },
      {
        id: 'inq-2',
        name: 'Isabelle Moreau',
        email: 'isabelle.m@example.com',
        phone: '+1 (415) 555-4920',
        subject: 'Nail Art Custom Reference Question',
        message: 'I have a couture runway reference for glazed chrome with hand-painted micro calla lilies. Can I book an extended session to ensure sufficient time?',
        preferredContact: 'email',
        status: 'replied',
        createdAt: '2026-10-08T11:20:00Z'
      }
    ],
    blockedDates: [
      {
        id: 'blk-1',
        date: '2026-11-26',
        reason: 'Thanksgiving Holiday Studio Closure',
        allDay: true
      }
    ]
  };
}

// Database helper functions
function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    const initial = getDefaultData();
    writeDb(initial);
    return initial;
  }
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const data = JSON.parse(raw);
    
    // Auto-migrate any dollar symbols to INR (₹)
    let migrated = false;
    if (data.services) {
      for (const s of data.services) {
        if (s.currency === '$') {
          s.currency = '₹';
          // Convert dollar amounts to luxury salon INR equivalents if in old range
          if (s.price < 500) {
            s.price = Math.round(s.price * 30);
          }
          if (s.packageVariants) {
            for (const v of s.packageVariants) {
              if (v.price < 500) v.price = Math.round(v.price * 30);
            }
          }
          migrated = true;
        }
      }
    }
    if (data.bookings) {
      for (const b of data.bookings) {
        if (b.priceEstimate && b.priceEstimate.includes('$')) {
          b.priceEstimate = b.priceEstimate.replace(/\$/g, '₹').replace(/95/g, '2,800').replace(/140/g, '3,500').replace(/240/g, '7,500');
          migrated = true;
        }
      }
    }
    if (migrated) {
      writeDb(data);
    }
    return data;
  } catch (err) {
    console.error('Error reading DB, re-initializing:', err);
    const initial = getDefaultData();
    writeDb(initial);
    return initial;
  }
}

function writeDb(data: any) {
  const tmpFile = `${DB_FILE}.tmp`;
  fs.writeFileSync(tmpFile, JSON.stringify(data, null, 2), 'utf-8');
  fs.renameSync(tmpFile, DB_FILE);
}

// Initialize server
async function startServer() {
  const app = express();

  // Middleware
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Helper Auth middleware
  function requireAdmin(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: missing or invalid authentication token' });
    }
    const token = authHeader.split(' ')[1];
    const db = readDb();
    if (!db.admin.token || db.admin.token !== token) {
      return res.status(401).json({ error: 'Session expired or unauthorized' });
    }
    next();
  }

  // API Router
  const api = express.Router();

  // 1. Auth routes
  api.post('/auth/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const db = readDb();
    const hash = hashPassword(password);

    if (username.trim().toLowerCase() === db.admin.username.toLowerCase() && hash === db.admin.passwordHash) {
      const token = generateToken(db.admin.id);
      db.admin.token = token;
      writeDb(db);
      return res.json({
        token,
        user: {
          id: db.admin.id,
          username: db.admin.username,
          name: db.admin.name,
          role: db.admin.role
        }
      });
    }

    return res.status(401).json({ error: 'Invalid administrator credentials' });
  });

  api.get('/auth/me', (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const token = authHeader.split(' ')[1];
    const db = readDb();
    if (db.admin.token && db.admin.token === token) {
      return res.json({
        user: {
          id: db.admin.id,
          username: db.admin.username,
          name: db.admin.name,
          role: db.admin.role
        }
      });
    }
    return res.status(401).json({ error: 'Session invalid' });
  });

  api.post('/auth/logout', (req: Request, res: Response) => {
    const db = readDb();
    db.admin.token = '';
    writeDb(db);
    res.json({ success: true });
  });

  api.post('/auth/change-password', requireAdmin, (req: Request, res: Response) => {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }
    const db = readDb();
    if (hashPassword(currentPassword) !== db.admin.passwordHash) {
      return res.status(400).json({ error: 'Incorrect current password' });
    }
    db.admin.passwordHash = hashPassword(newPassword);
    writeDb(db);
    return res.json({ success: true, message: 'Password updated successfully' });
  });

  // 2. Settings routes
  api.get('/settings', (_req: Request, res: Response) => {
    const db = readDb();
    res.json(db.settings);
  });

  api.put('/settings', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    db.settings = { ...db.settings, ...req.body };
    writeDb(db);
    res.json({ success: true, settings: db.settings });
  });

  // 3. Categories routes
  api.get('/categories', (_req: Request, res: Response) => {
    const db = readDb();
    res.json(db.categories.sort((a: any, b: any) => a.order - b.order));
  });

  api.post('/categories', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const newCat = {
      id: `cat-${Date.now()}`,
      name: req.body.name || 'New Category',
      studio: req.body.studio || 'nails',
      description: req.body.description || '',
      order: db.categories.length + 1
    };
    db.categories.push(newCat);
    writeDb(db);
    res.status(201).json(newCat);
  });

  // 4. Services routes
  api.get('/services', (req: Request, res: Response) => {
    const db = readDb();
    let services = [...db.services];
    const { studio, category, activeOnly } = req.query;

    if (activeOnly === 'true') {
      services = services.filter((s: any) => s.active);
    }
    if (studio && studio !== 'all') {
      services = services.filter((s: any) => s.studio === studio || s.studio === 'both');
    }
    if (category) {
      services = services.filter((s: any) => s.category === category);
    }

    services.sort((a: any, b: any) => a.order - b.order);
    res.json(services);
  });

  api.post('/services', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const newService = {
      id: `srv-${Date.now()}`,
      name: req.body.name || 'New Atelier Service',
      category: req.body.category || 'Couture Nail Art & Extensions',
      studio: req.body.studio || 'nails',
      description: req.body.description || '',
      priceType: req.body.priceType || 'fixed',
      price: Number(req.body.price) || 0,
      currency: req.body.currency || '₹',
      durationMinutes: Number(req.body.durationMinutes) || 60,
      image: req.body.image || '/src/assets/images/nail_art_couture_showcase_1791786283381.jpg',
      featured: Boolean(req.body.featured),
      order: db.services.length + 1,
      active: req.body.active !== undefined ? Boolean(req.body.active) : true,
      packageVariants: req.body.packageVariants || []
    };
    db.services.push(newService);
    writeDb(db);
    res.status(201).json(newService);
  });

  api.put('/services/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const idx = db.services.findIndex((s: any) => s.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Service not found' });
    }
    db.services[idx] = { ...db.services[idx], ...req.body, id: req.params.id };
    writeDb(db);
    res.json(db.services[idx]);
  });

  api.delete('/services/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    db.services = db.services.filter((s: any) => s.id !== req.params.id);
    writeDb(db);
    res.json({ success: true });
  });

  // 5. Gallery routes
  api.get('/gallery', (req: Request, res: Response) => {
    const db = readDb();
    let gallery = [...db.gallery];
    const { studio, category, featuredOnly } = req.query;

    if (studio && studio !== 'all') {
      gallery = gallery.filter((g: any) => g.studio === studio || g.studio === 'both');
    }
    if (category && category !== 'all') {
      gallery = gallery.filter((g: any) => g.category === category);
    }
    if (featuredOnly === 'true') {
      gallery = gallery.filter((g: any) => g.featured);
    }

    gallery.sort((a: any, b: any) => a.order - b.order);
    res.json(gallery);
  });

  api.post('/gallery', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const newItem = {
      id: `gal-${Date.now()}`,
      title: req.body.title || 'Studio Artistry Showcase',
      category: req.body.category || 'Couture Nail Art',
      studio: req.body.studio || 'nails',
      imageUrl: req.body.imageUrl || '/src/assets/images/nail_art_couture_showcase_1791786283381.jpg',
      caption: req.body.caption || '',
      featured: Boolean(req.body.featured),
      order: db.gallery.length + 1,
      likesCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    db.gallery.push(newItem);
    writeDb(db);
    res.status(201).json(newItem);
  });

  api.put('/gallery/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const idx = db.gallery.findIndex((g: any) => g.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }
    db.gallery[idx] = { ...db.gallery[idx], ...req.body, id: req.params.id };
    writeDb(db);
    res.json(db.gallery[idx]);
  });

  api.delete('/gallery/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    db.gallery = db.gallery.filter((g: any) => g.id !== req.params.id);
    writeDb(db);
    res.json({ success: true });
  });

  // 6. Bookings routes
  // Conflict Check & Available slots
  api.get('/bookings/check-availability', (req: Request, res: Response) => {
    const { date, timeSlot, artist } = req.query;
    if (!date || !timeSlot) {
      return res.status(400).json({ error: 'Date and time slot required' });
    }

    const db = readDb();
    // Check blocked dates
    const isBlocked = db.blockedDates.some((b: any) => b.date === date && b.allDay);
    if (isBlocked) {
      return res.json({ available: false, reason: 'The studio is closed or fully booked on this date' });
    }

    // Check confirmed conflicts
    const conflict = db.bookings.some(
      (b: any) =>
        b.date === date &&
        b.timeSlot === timeSlot &&
        b.status === 'confirmed' &&
        (!artist || b.artist === artist)
    );

    return res.json({ available: !conflict, reason: conflict ? 'Slot already confirmed for this time' : null });
  });

  // Public Booking creation (atomic conflict verification)
  api.post('/bookings', (req: Request, res: Response) => {
    const {
      customerName,
      customerEmail,
      customerPhone,
      serviceId,
      date,
      timeSlot,
      artist,
      specialRequests,
      referenceImageUrl
    } = req.body;

    if (!customerName || !customerEmail || !customerPhone || !serviceId || !date || !timeSlot) {
      return res.status(400).json({ error: 'Please provide all mandatory booking details' });
    }

    const db = readDb();

    // Check if date is blocked
    const isDateBlocked = db.blockedDates.some((b: any) => b.date === date && b.allDay);
    if (isDateBlocked) {
      return res.status(409).json({ error: 'Selected date is currently unavailable for studio bookings' });
    }

    // Conflict prevention check for confirmed bookings at that exact slot
    const existingConfirmed = db.bookings.some(
      (b: any) =>
        b.date === date &&
        b.timeSlot === timeSlot &&
        b.status === 'confirmed' &&
        (!artist || b.artist === artist)
    );

    if (existingConfirmed) {
      return res.status(409).json({
        error: 'This appointment slot was just booked by another client. Please select an alternate time.'
      });
    }

    // Locate service
    const service = db.services.find((s: any) => s.id === serviceId);
    const serviceName = service ? service.name : 'Custom Studio Service';
    const serviceCategory = service ? service.category : 'General Artistry';
    const serviceStudio = service ? service.studio : 'nails';
    const durationMinutes = service ? service.durationMinutes : 75;
    const priceEstimate = service
      ? `${service.priceType === 'starting_at' ? 'from ' : ''}${service.currency}${service.price}`
      : 'Quote upon consultation';

    // Generate reference code
    const randDigits = Math.floor(1000 + Math.random() * 9000);
    const referenceNumber = `BL-${randDigits}`;

    const initialStatus = db.settings.bookingApprovalMode === 'auto_confirm' ? 'confirmed' : 'pending';

    const newBooking = {
      id: `bk-${Date.now()}`,
      referenceNumber,
      customerName: customerName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      serviceId,
      serviceName,
      category: serviceCategory,
      studio: serviceStudio,
      artist: artist || 'Ketna (Founder / Master Artist)',
      date,
      timeSlot,
      durationMinutes,
      priceEstimate,
      specialRequests: specialRequests || '',
      referenceImageUrl: referenceImageUrl || '',
      status: initialStatus,
      internalNotes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    db.bookings.push(newBooking);
    writeDb(db);

    return res.status(201).json({
      success: true,
      booking: newBooking,
      message:
        initialStatus === 'confirmed'
          ? 'Your booking is confirmed!'
          : 'Appointment request received! Ketna and studio concierge will review and confirm within 24 hours.'
    });
  });

  // Admin Bookings Management
  api.get('/bookings', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const { status, date, search } = req.query;
    let list = [...db.bookings];

    if (status && status !== 'all') {
      list = list.filter((b: any) => b.status === status);
    }
    if (date) {
      list = list.filter((b: any) => b.date === date);
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (b: any) =>
          b.customerName.toLowerCase().includes(q) ||
          b.customerEmail.toLowerCase().includes(q) ||
          b.customerPhone.toLowerCase().includes(q) ||
          b.referenceNumber.toLowerCase().includes(q) ||
          b.serviceName.toLowerCase().includes(q)
      );
    }

    // Sort newest first
    list.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(list);
  });

  api.patch('/bookings/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const idx = db.bookings.findIndex((b: any) => b.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = db.bookings[idx];
    const { status, internalNotes, date, timeSlot, artist } = req.body;

    // If changing to confirmed or rescheduling, check conflict
    if ((status === 'confirmed' || date || timeSlot) && status !== 'cancelled') {
      const targetDate = date || booking.date;
      const targetSlot = timeSlot || booking.timeSlot;
      const targetArtist = artist || booking.artist;

      const hasConflict = db.bookings.some(
        (b: any) =>
          b.id !== req.params.id &&
          b.date === targetDate &&
          b.timeSlot === targetSlot &&
          b.status === 'confirmed' &&
          b.artist === targetArtist
      );

      if (hasConflict) {
        return res.status(409).json({
          error: `Another confirmed booking already occupies ${targetDate} at ${targetSlot} for ${targetArtist}.`
        });
      }
    }

    db.bookings[idx] = {
      ...booking,
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };

    writeDb(db);
    res.json(db.bookings[idx]);
  });

  api.delete('/bookings/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    db.bookings = db.bookings.filter((b: any) => b.id !== req.params.id);
    writeDb(db);
    res.json({ success: true });
  });

  // Export Bookings CSV
  api.get('/bookings/export', requireAdmin, (_req: Request, res: Response) => {
    const db = readDb();
    const rows = [
      [
        'Reference',
        'Customer Name',
        'Phone',
        'Email',
        'Service',
        'Category',
        'Date',
        'Time Slot',
        'Artist',
        'Status',
        'Estimated Price',
        'Created At',
        'Notes'
      ]
    ];

    for (const b of db.bookings) {
      rows.push([
        b.referenceNumber,
        `"${b.customerName.replace(/"/g, '""')}"`,
        `"${b.customerPhone}"`,
        `"${b.customerEmail}"`,
        `"${b.serviceName.replace(/"/g, '""')}"`,
        `"${b.category}"`,
        b.date,
        b.timeSlot,
        `"${b.artist}"`,
        b.status,
        `"${b.priceEstimate}"`,
        b.createdAt,
        `"${(b.internalNotes || '').replace(/"/g, '""')}"`
      ]);
    }

    const csvContent = rows.map((r) => r.join(',')).join('\n');
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="beautilicious_bookings_export.csv"');
    res.send(csvContent);
  });

  // 7. Blocked Dates routes
  api.get('/blocked-dates', (_req: Request, res: Response) => {
    const db = readDb();
    res.json(db.blockedDates);
  });

  api.post('/blocked-dates', requireAdmin, (req: Request, res: Response) => {
    const { date, reason, allDay } = req.body;
    if (!date) {
      return res.status(400).json({ error: 'Date is required' });
    }
    const db = readDb();
    const newBlock = {
      id: `blk-${Date.now()}`,
      date,
      reason: reason || 'Studio Closure',
      allDay: allDay !== undefined ? Boolean(allDay) : true
    };
    db.blockedDates.push(newBlock);
    writeDb(db);
    res.status(201).json(newBlock);
  });

  api.delete('/blocked-dates/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    db.blockedDates = db.blockedDates.filter((b: any) => b.id !== req.params.id);
    writeDb(db);
    res.json({ success: true });
  });

  // 8. Inquiries routes
  api.post('/inquiries', (req: Request, res: Response) => {
    const { name, email, phone, subject, message, preferredContact } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email and inquiry message are required' });
    }

    const db = readDb();
    const newInquiry = {
      id: `inq-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      phone: (phone || '').trim(),
      subject: (subject || 'General Studio Inquiry').trim(),
      message: message.trim(),
      preferredContact: preferredContact || 'whatsapp',
      status: 'new',
      createdAt: new Date().toISOString()
    };

    db.inquiries.push(newInquiry);
    writeDb(db);
    res.status(201).json({ success: true, inquiry: newInquiry });
  });

  api.get('/inquiries', requireAdmin, (_req: Request, res: Response) => {
    const db = readDb();
    const sorted = [...db.inquiries].sort(
      (a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    res.json(sorted);
  });

  api.patch('/inquiries/:id', requireAdmin, (req: Request, res: Response) => {
    const db = readDb();
    const idx = db.inquiries.findIndex((i: any) => i.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Inquiry not found' });
    }
    db.inquiries[idx] = { ...db.inquiries[idx], ...req.body };
    writeDb(db);
    res.json(db.inquiries[idx]);
  });

  // 9. Admin Stats
  api.get('/stats', requireAdmin, (_req: Request, res: Response) => {
    const db = readDb();
    const totalBookings = db.bookings.length;
    const pendingBookings = db.bookings.filter((b: any) => b.status === 'pending').length;
    const confirmedBookings = db.bookings.filter((b: any) => b.status === 'confirmed').length;
    const completedBookings = db.bookings.filter((b: any) => b.status === 'completed').length;
    const cancelledBookings = db.bookings.filter((b: any) => b.status === 'cancelled').length;

    const todayStr = new Date().toISOString().split('T')[0];
    const upcomingCount = db.bookings.filter(
      (b: any) => b.date >= todayStr && (b.status === 'confirmed' || b.status === 'pending')
    ).length;

    const totalInquiries = db.inquiries.length;
    const newInquiries = db.inquiries.filter((i: any) => i.status === 'new').length;

    // Approximate revenue from completed + confirmed
    let estimatedRevenue = 0;
    for (const b of db.bookings) {
      if (b.status === 'confirmed' || b.status === 'completed') {
        const srv = db.services.find((s: any) => s.id === b.serviceId);
        if (srv && srv.price) {
          estimatedRevenue += srv.price;
        }
      }
    }

    res.json({
      totalBookings,
      pendingBookings,
      confirmedBookings,
      completedBookings,
      cancelledBookings,
      upcomingCount,
      totalInquiries,
      newInquiries,
      totalServices: db.services.length,
      totalGalleryItems: db.gallery.length,
      estimatedRevenue
    });
  });

  // Mount API router
  app.use('/api', api);

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true'
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Beautilicious Server] Running on http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Server Start Error]', err);
  process.exit(1);
});
