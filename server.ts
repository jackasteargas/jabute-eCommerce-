import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { MOCK_PRODUCTS, PROMO_CODES } from './src/data/mockProducts.js';
import { CATEGORIES } from './src/data/categories.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lazy Gemini SDK client instance
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}


async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory persistent state for dev session
  let products = [...MOCK_PRODUCTS];
  let categories = [...CATEGORIES];
  let orders: any[] = [
    {
      id: 'ord-1001',
      orderNumber: 'APX-98241',
      date: new Date(Date.now() - 86400000 * 2).toISOString(),
      items: [
        {
          productId: 'prod-1',
          name: 'Aether Flow Studio Wireless Headphones',
          price: 349,
          quantity: 1,
          selectedColor: 'Matte Obsidian',
          image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80'
        },
        {
          productId: 'prod-12',
          name: 'Vessel Ultra-Insulated Ceramic Flask',
          price: 49,
          quantity: 2,
          selectedColor: 'Matte Sage',
          image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=1000&q=80'
        }
      ],
      customer: {
        fullName: 'Eleanor Vance',
        email: 'eleanor.vance@example.com',
        phone: '+1 (555) 234-5678',
        address: '742 Evergreen Terrace',
        city: 'Portland',
        state: 'OR',
        postalCode: '97201',
        country: 'United States'
      },
      subtotal: 447,
      discount: 44.7,
      shipping: 0,
      tax: 32.18,
      total: 434.48,
      status: 'Processing',
      paymentMethod: 'credit_card',
      trackingNumber: 'TRK-982410-US',
      carrier: 'FedEx Express',
      estimatedDelivery: 'Tomorrow by 4:00 PM'
    }
  ];

  // API Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), totalProducts: products.length });
  });

  // GET /api/categories
  app.get('/api/categories', (req: Request, res: Response) => {
    res.json({ success: true, data: categories });
  });

  // GET /api/products (with filtering, sorting, pagination)
  app.get('/api/products', (req: Request, res: Response) => {
    let result = [...products];
    const { category, search, sort, tag, minPrice, maxPrice, inStock, featured } = req.query;

    if (category && typeof category === 'string' && category !== 'all') {
      result = result.filter(
        (p) => p.categorySlug === category || p.category.toLowerCase() === category.toLowerCase()
      );
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (tag && typeof tag === 'string') {
      result = result.filter((p) => p.tags.includes(tag.toLowerCase()));
    }

    if (minPrice) {
      result = result.filter((p) => p.price >= Number(minPrice));
    }

    if (maxPrice) {
      result = result.filter((p) => p.price <= Number(maxPrice));
    }

    if (inStock === 'true') {
      result = result.filter((p) => p.stock > 0);
    }

    if (featured === 'true') {
      result = result.filter((p) => p.isFeatured);
    }

    // Sort
    if (sort === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sort === 'rating-desc') {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sort === 'newest') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'popularity') {
      result.sort((a, b) => b.reviewCount - a.reviewCount);
    }

    res.json({
      success: true,
      total: result.length,
      data: result
    });
  });

  // GET /api/products/:id
  app.get('/api/products/:id', (req: Request, res: Response) => {
    const product = products.find((p) => p.id === req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  });

  // POST /api/products (Admin create)
  app.post('/api/products', (req: Request, res: Response) => {
    const newProduct = {
      id: `prod-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      rating: 5.0,
      reviewCount: 0,
      tags: [],
      ...req.body
    };
    products.unshift(newProduct);
    res.status(201).json({ success: true, data: newProduct });
  });

  // PUT /api/products/:id (Admin update)
  app.put('/api/products/:id', (req: Request, res: Response) => {
    const idx = products.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    products[idx] = { ...products[idx], ...req.body };
    res.json({ success: true, data: products[idx] });
  });

  // DELETE /api/products/:id (Admin delete)
  app.delete('/api/products/:id', (req: Request, res: Response) => {
    const idx = products.findIndex((p) => p.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    const deleted = products.splice(idx, 1);
    res.json({ success: true, data: deleted[0] });
  });

  // GET /api/orders
  app.get('/api/orders', (req: Request, res: Response) => {
    res.json({ success: true, data: orders });
  });

  // POST /api/orders (Create order)
  app.post('/api/orders', (req: Request, res: Response) => {
    const newOrder = {
      id: `ord-${Date.now()}`,
      orderNumber: `APX-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString(),
      status: 'Processing',
      trackingNumber: `TRK-${Math.floor(100000 + Math.random() * 900000)}-US`,
      carrier: 'FedEx Priority',
      estimatedDelivery: '3 business days',
      ...req.body
    };
    orders.unshift(newOrder);

    // Deduct stock
    if (newOrder.items && Array.isArray(newOrder.items)) {
      newOrder.items.forEach((item: any) => {
        const prod = products.find((p) => p.id === item.productId);
        if (prod && prod.stock >= item.quantity) {
          prod.stock -= item.quantity;
        }
      });
    }

    res.status(201).json({ success: true, data: newOrder });
  });

  // POST /api/promos/validate
  app.post('/api/promos/validate', (req: Request, res: Response) => {
    const { code, subtotal } = req.body;
    const promo = PROMO_CODES.find((p) => p.code.toUpperCase() === (code || '').trim().toUpperCase());
    if (!promo) {
      return res.status(400).json({ success: false, error: 'Invalid or expired promotional code' });
    }
    if (promo.minSpend && (subtotal || 0) < promo.minSpend) {
      return res.status(400).json({
        success: false,
        error: `Promo code ${promo.code} requires a minimum spend of $${promo.minSpend.toFixed(2)}`
      });
    }
    res.json({ success: true, data: promo });
  });

  // GET /api/admin/stats
  app.get('/api/admin/stats', (req: Request, res: Response) => {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const totalOrders = orders.length;
    const lowStockItems = products.filter((p) => p.stock < 15).length;
    const totalCustomers = new Set(orders.map((o) => o.customer?.email)).size;

    res.json({
      success: true,
      data: {
        totalRevenue,
        totalOrders,
        totalProducts: products.length,
        lowStockItems,
        totalCustomers: Math.max(totalCustomers, 1)
      }
    });
  });

  // POST /api/chat (Multi-turn Gemini AI Chatbot)
  app.post('/api/chat', async (req: Request, res: Response) => {
    try {
      const { messages, selectedProduct, storeInfo } = req.body;

      if (!messages || !Array.isArray(messages) || messages.length === 0) {
        return res.status(400).json({ success: false, error: 'Messages array is required' });
      }

      // Catalog overview for grounding
      const catalogSummary = products.map((p) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        originalPrice: p.originalPrice,
        rating: p.rating,
        stock: p.stock,
        features: p.features || [],
        description: p.description
      }));

      const activePromos = PROMO_CODES.map((pr) => `${pr.code}: ${pr.description}`).join(', ');

      const systemInstruction = `You are "JABUTE Store AI Assistant", the official expert concierge and shopping advisor for JABUTE (an independent premium online retail store).
Your purpose is to answer customer questions about:
1. Products & recommendations: Suggest exact products from the store inventory below, matching customer needs, budget, preferences, and technical specifications.
2. Orders & tracking: Explain how to track orders with order IDs (e.g., APX-*, JAB-*), review order status, or manage order items in "My Orders & Tracking".
3. Store policies & services:
   - Shipping: Free 2-Day Express Shipping on orders over $50 (standard is $9.99). Fast direct warehouse fulfillment.
   - Returns: 30-Day Hassle-Free Money-Back Guarantee. Full refunds processed within 3-5 days.
   - Active Promo Codes: ${activePromos}.
   - Payment Methods: Credit/Debit cards (Visa, Mastercard, AMEX), Apple Pay, Google Pay, Cash on Delivery.
   - Quality guarantee: 100% genuine verified brand items with manufacturer warranty.

Store Catalog Grounding Data:
${JSON.stringify(catalogSummary, null, 2)}

${selectedProduct ? `Currently Viewed Product by Customer:\n${JSON.stringify(selectedProduct, null, 2)}` : ''}

Guidelines for your responses:
- Be friendly, professional, helpful, and concise.
- Use clean Markdown with bullet points or bold text where appropriate.
- When recommending products, explicitly mention the exact product name, its price ($), and key benefits from the catalog.
- If a customer asks about a product not in the catalog, politely let them know what similar items JABUTE carries instead.
- Provide practical follow-up guidance or tips when helpful.`;

      const ai = getGenAI();

      let replyText = '';
      let suggestedProducts: any[] = [];

      if (ai) {
        // Prepare multi-turn contents format for @google/genai
        const contents = messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }]
        }));

        const geminiResponse = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            topP: 0.95
          }
        });

        replyText = geminiResponse.text || "I'm here to help! How can I assist you with JABUTE products or your shopping experience?";
      } else {
        // Fallback response if GEMINI_API_KEY is not configured in local environment
        const lastUserMessage = messages[messages.length - 1]?.content.toLowerCase() || '';

        if (lastUserMessage.includes('shipping') || lastUserMessage.includes('delivery')) {
          replyText = `### 🚚 JABUTE Shipping Information
- **Free 2-Day Express Shipping** is automatically applied to all orders over **$50.00**!
- Standard shipping is **$9.99** for smaller orders.
- All items are dispatched directly from our verified fulfillment warehouses within 24 hours with real-time tracking numbers (FedEx / UPS).`;
        } else if (lastUserMessage.includes('return') || lastUserMessage.includes('refund') || lastUserMessage.includes('warranty')) {
          replyText = `### 🛡️ Returns & Guarantee Policy
- **30-Day Risk-Free Returns**: If you are not completely satisfied with your purchase, you can return it within 30 days for a full refund.
- **Direct Warranty**: All electronic devices, tools, and accessories include full 1-year direct manufacturer warranty coverage.
- **Fast Processing**: Refunds are issued back to your original payment method within 3–5 business days.`;
        } else if (lastUserMessage.includes('promo') || lastUserMessage.includes('discount') || lastUserMessage.includes('coupon') || lastUserMessage.includes('code')) {
          replyText = `### 🏷️ Active Promo Codes
Use these at checkout to save instantly:
- **WELCOME10**: 10% off your entire order (No minimum spend!)
- **SAVE20**: $20 off on orders of $100 or more
- **JABUTEVIP**: 15% off orders of $150 or more

Simply apply the code inside your Cart or Checkout summary!`;
        } else if (lastUserMessage.includes('order') || lastUserMessage.includes('track')) {
          replyText = `### 📦 Tracking Your JABUTE Order
You can track your order live anytime by clicking **"My Orders & Tracking"** in the top navigation header. Enter your order ID (such as **APX-98241**) to see real-time carrier status and estimated delivery time!`;
        } else {
          // Find matching products
          const matched = products.filter(
            (p) =>
              lastUserMessage.includes(p.name.toLowerCase()) ||
              lastUserMessage.includes(p.category.toLowerCase()) ||
              p.tags.some((t) => lastUserMessage.includes(t.toLowerCase()))
          );

          if (matched.length > 0) {
            replyText = `Here are the best items from our inventory matching your query:
${matched.slice(0, 3).map((p) => `- **${p.name}** ($${p.price.toFixed(2)}) — ${p.description}`).join('\n')}

Would you like more details, color options, or help adding these to your cart?`;
          } else {
            replyText = `Welcome to **JABUTE Store AI Assistant**! I can help you with:
- Finding top-rated electronics, audio gear, apparel, home essentials, and tools
- Checking shipping times & free delivery thresholds ($50+)
- Finding active discounts and promo codes (try **WELCOME10**)
- Tracking existing orders or checking warranty details

What can I help you find today?`;
          }
        }
      }

      // Match suggested products based on replyText or user query to provide interactive UI cards
      const lastMsg = messages[messages.length - 1]?.content.toLowerCase() || '';
      const replyLower = replyText.toLowerCase();

      suggestedProducts = products
        .filter((p) => {
          const nameLower = p.name.toLowerCase();
          const categoryLower = p.category.toLowerCase();
          return (
            replyLower.includes(nameLower) ||
            lastMsg.includes(nameLower) ||
            (lastMsg.includes(categoryLower) && p.isFeatured) ||
            p.tags.some((t) => lastMsg.includes(t.toLowerCase()))
          );
        })
        .slice(0, 3)
        .map((p) => ({
          id: p.id,
          name: p.name,
          price: p.price,
          originalPrice: p.originalPrice,
          image: p.images[0],
          category: p.category,
          rating: p.rating,
          inStock: p.stock > 0
        }));

      res.json({
        success: true,
        reply: replyText,
        suggestedProducts
      });
    } catch (err: any) {
      console.error('Chat endpoint error:', err);
      res.status(500).json({
        success: false,
        error: err.message || 'Internal server error while processing chat request'
      });
    }
  });


  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ApexStore server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
