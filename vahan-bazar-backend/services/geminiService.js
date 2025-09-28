import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

class GeminiService {
  constructor() {
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Try different model names - the API might require different formatting
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
    
    // System context for Vahan Bazar
    this.systemContext = `
You are VB Assistant, the AI chatbot for Vahan Bazar - India's premier two-wheeler marketplace. 
You help users with vehicle buying, selling, test drives, financing, and general inquiries.

ABOUT VAHAN BAZAR:
- Online marketplace for motorcycles, scooters, and electric vehicles
- Connects buyers with trusted dealers and private sellers
- Offers test ride bookings, financing options, and vehicle comparisons
- Serves major cities across India

YOUR ROLE:
- Be helpful, friendly, and knowledgeable about vehicles
- Provide specific information about motorcycles, scooters, and EVs
- Help with buying decisions, price comparisons, and features
- Guide users through test drive bookings and account processes
- Answer questions about financing, insurance, and documentation

VEHICLE CATEGORIES ON PLATFORM:
1. Motorcycles/Bikes (Sports, Cruiser, Street, Adventure, Commuter)
2. Scooters (Automatic, Manual, Electric)
3. Electric Vehicles (E-bikes, E-scooters)

GUIDELINES:
- Keep responses concise and helpful (2-3 sentences max for simple queries)
- For vehicle recommendations, ask about budget, usage, and preferences
- Always encourage test rides before purchase decisions
- Suggest contacting dealers for specific pricing and availability
- For complex issues, direct users to contact support
- Use a conversational, friendly tone
- Include relevant emojis where appropriate

NEVER:
- Give exact pricing (prices vary by location and dealer)
- Make definitive purchase recommendations without knowing user needs
- Provide personal financial advice
- Share contact details of specific dealers
- Make claims about vehicle performance you're not certain about
`;
  }

  async generateResponse(userMessage, conversationHistory = []) {
    try {
      // Build conversation context
      let contextPrompt = this.systemContext + "\n\nCONVERSATION:\n";
      
      // Add conversation history (last 5 messages for context)
      const recentHistory = conversationHistory.slice(-5);
      recentHistory.forEach(msg => {
        contextPrompt += `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.text}\n`;
      });
      
      contextPrompt += `User: ${userMessage}\nAssistant:`;

      const result = await this.model.generateContent(contextPrompt);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        message: text.trim()
      };
    } catch (error) {
      console.error('Gemini API error:', error);
      
      // Fallback to rule-based responses
      return this.getFallbackResponse(userMessage);
    }
  }

  getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Enhanced vehicle recommendations with specific models
    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('best')) {
      if (lowerMessage.includes('bike') || lowerMessage.includes('motorcycle')) {
        // Check for budget hints in the message
        if (lowerMessage.includes('budget') || lowerMessage.includes('cheap') || lowerMessage.includes('under') || lowerMessage.includes('lakh')) {
          return {
            success: true,
            message: "🏍️ Perfect! For budget-friendly bikes, I recommend:\n\n• **Honda CB Shine** (₹75,000) - Excellent mileage, reliable\n• **Bajaj CT 100** (₹65,000) - Most affordable, great for daily use\n• **TVS Star City** (₹70,000) - Good build quality\n• **Hero HF Deluxe** (₹68,000) - Trusted brand, low maintenance\n\nWould you like detailed specs for any of these, or shall I help you book a test ride? 🚗"
          };
        }
        if (lowerMessage.includes('sports') || lowerMessage.includes('racing') || lowerMessage.includes('fast')) {
          return {
            success: true,
            message: "🏁 For sports bikes, here are the top performers:\n\n• **KTM Duke 390** - Ultimate street fighter\n• **Yamaha R15 V4** - Track-focused performance\n• **TVS Apache RR 310** - Made-in-India superbike\n• **Bajaj Dominar 400** - Touring sports bike\n\nThese offer excellent power-to-weight ratios and thrilling rides! Which style interests you more - street naked or fully-faired?"
          };
        }
        return {
          success: true,
          message: "🏍️ I'd love to help you find the perfect bike! Let me know:\n\n📊 **Budget range**: Under ₹1L, ₹1-2L, or ₹2L+?\n🎯 **Usage**: Daily commuting, weekend rides, or long tours?\n⚡ **Preference**: Mileage-focused, performance, or balanced?\n\nWith this info, I can suggest the perfect bikes for you!"
        };
      }
      if (lowerMessage.includes('scooter')) {
        if (lowerMessage.includes('electric') || lowerMessage.includes('ev')) {
          return {
            success: true,
            message: "⚡ Electric scooters are amazing for city rides! Top picks:\n\n• **Ola S1 Pro** - 181km range, smart features\n• **TVS iQube** - Reliable, good service network\n• **Bajaj Chetak** - Premium build, vintage styling\n• **Hero Vida V1** - Latest launch, competitive price\n\nElectric scooters save ₹30,000+ annually on fuel! What's your daily travel distance?"
          };
        }
        return {
          success: true,
          message: "🛵 Excellent choice for city commuting! Here are top scooters:\n\n**Petrol Scooters:**\n• **Honda Activa 6G** - Most trusted, ₹75,000\n• **TVS Jupiter** - Feature-rich, ₹73,000\n• **Suzuki Access 125** - Powerful, ₹78,000\n\n**Electric Options:**\n• **Ola S1** - Smart & eco-friendly\n• **TVS iQube** - Reliable electric\n\nWhat's your priority - fuel efficiency, features, or performance?"
        };
      }
      if (lowerMessage.includes('electric') || lowerMessage.includes('ev')) {
        return {
          success: true,
          message: "⚡ Electric vehicles are revolutionary! Here's why they're perfect:\n\n💰 **Savings**: ₹30,000+ annual fuel savings\n🌱 **Eco-friendly**: Zero emissions\n🔧 **Low maintenance**: Fewer moving parts\n⚡ **Instant torque**: Smooth acceleration\n\n**Top EVs:**\n• **Ola S1 Pro** - Premium features\n• **TVS iQube** - Reliable choice\n• **Bajaj Chetak** - Classic design\n\nWhat's your daily commute distance? This helps determine the right range!"
        };
      }
    }

    // Enhanced test drive queries
    if (lowerMessage.includes('test drive') || lowerMessage.includes('test ride')) {
      if (lowerMessage.includes('document') || lowerMessage.includes('requirement') || lowerMessage.includes('need')) {
        return {
          success: true,
          message: "📋 **Test Drive Requirements:**\n\n🆔 **Must bring:**\n• **Valid Driving License** (mandatory)\n• **Aadhar Card** or any photo ID\n• **Original documents** (no photocopies)\n\n🕰️ **Process:**\n• Duration: 10-15 minutes\n• Security deposit: ₹500-2000 (refundable)\n• Accompanied by dealer executive\n\n✅ **What to check:**\n• Engine performance & pickup\n• Braking and handling\n• Comfort and ergonomics\n\nReady to book your test ride?"
        };
      }
      if (lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
        return {
          success: true,
          message: "🗓️ **Easy Test Drive Booking:**\n\n**Step 1**: Choose your vehicle from our listings\n**Step 2**: Click 'Book Test Drive' button\n**Step 3**: Select preferred date & time\n**Step 4**: Enter your contact details\n**Step 5**: Dealer will confirm within 2 hours\n\n📍 **Available timings:**\n• Monday-Saturday: 10 AM to 7 PM\n• Sunday: 10 AM to 6 PM\n\n🎯 **Pro tip**: Book for weekday mornings for the best experience!\n\nWhich vehicle interests you for a test drive?"
        };
      }
      return {
        success: true,
        message: "🏍️ **Test rides are crucial before buying!**\n\n✨ **Why test drive?**\n• Feel the engine performance\n• Check comfort & ergonomics\n• Test braking & handling\n• Ensure it fits your riding style\n\n📱 **Quick booking process:**\n1️⃣ Visit vehicle listing page\n2️⃣ Click 'Book Test Drive'\n3️⃣ Choose date/time\n4️⃣ Dealer confirms booking\n\n📄 **Just bring**: Valid driving license + ID\n\nWhich vehicle would you like to test?"
      };
    }

    // Enhanced financing queries with calculations
    if (lowerMessage.includes('loan') || lowerMessage.includes('finance') || lowerMessage.includes('emi')) {
      if (lowerMessage.includes('emi') || lowerMessage.includes('monthly')) {
        return {
          success: true,
          message: "💳 **EMI Calculator Examples** (at 12% interest):\n\n**₹50,000 vehicle:**\n• 12 months: ₹4,442/month\n• 24 months: ₹2,354/month\n• 36 months: ₹1,662/month\n\n**₹1,00,000 vehicle:**\n• 12 months: ₹8,885/month\n• 24 months: ₹4,707/month\n• 36 months: ₹3,325/month\n\n🏦 **Partner Banks**: HDFC, ICICI, SBI, Bajaj Finserv\n📋 **Documents needed**: Aadhar, PAN, Salary slips\n\nWant exact EMI for a specific vehicle?"
        };
      }
      return {
        success: true,
        message: "💰 **Easy Vehicle Financing Available!**\n\n✨ **Benefits:**\n• Interest rates starting from 10.5%\n• Quick approval in 30 minutes\n• Minimal documentation required\n• Up to 90% financing available\n\n🏦 **Partner Banks:**\n• HDFC Bank, ICICI Bank\n• SBI, Axis Bank\n• Bajaj Finserv, TVS Credit\n\n📋 **Required documents**: Aadhar, PAN, Income proof\n\nWhich vehicle are you planning to finance?"
      };
    }

    // Enhanced pricing queries with specific ranges
    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('expensive')) {
      if (lowerMessage.includes('under') && (lowerMessage.includes('50') || lowerMessage.includes('fifty'))) {
        return {
          success: true,
          message: "💰 **Under ₹50,000 options:**\n\n**Bikes:**\n• **Bajaj CT 100** - ₹48,000 (65+ kmpl)\n• **Hero HF 100** - ₹49,500 (70+ kmpl)\n• **TVS Sport** - ₹47,000 (Great starter bike)\n\n**Scooters:**\n• **TVS Scooty Pep+** - ₹48,000\n• **Hero Pleasure+** - ₹49,000\n\nThese are ex-showroom prices. On-road prices include insurance & registration. Need help finding dealers?"
        };
      }
      if (lowerMessage.includes('under') && (lowerMessage.includes('1') || lowerMessage.includes('one') || lowerMessage.includes('lakh'))) {
        return {
          success: true,
          message: "💵 **Under ₹1 Lakh - Excellent choices!**\n\n**Popular Bikes:**\n• **Honda CB Shine** - ₹75,000 (65 kmpl)\n• **Bajaj Pulsar 125** - ₹85,000 (50 kmpl)\n• **Yamaha Saluto** - ₹72,000 (68 kmpl)\n• **TVS Raider 125** - ₹89,000 (Sporty)\n\n**Top Scooters:**\n• **Honda Activa 6G** - ₹75,000 (Most popular)\n• **TVS Jupiter** - ₹73,000 (Feature-rich)\n\nPrices include excellent build quality and reliability! Need financing options?"
        };
      }
      return {
        success: true,
        message: "💲 **Vehicle Price Ranges:**\n\n🔹 **Under ₹50K**: Entry-level bikes & scooters\n🔹 **₹50K-1L**: Premium commuter bikes\n🔹 **₹1L-2L**: Performance bikes, premium scooters\n🔹 **₹2L+**: Premium & sports bikes\n\n💡 **Price includes:**\n• Ex-showroom price\n• Road tax & insurance\n• Registration charges\n\nWhat's your budget range? I'll show you the best options with current offers!"
      };
    }

    // Account and technical queries
    if (lowerMessage.includes('account') || lowerMessage.includes('login') || lowerMessage.includes('signup')) {
      return {
        success: true,
        message: "👤 You can create a free account to save favorites, book test drives, and get personalized recommendations. Just click 'Sign Up' and verify your phone number. Need help with login issues?"
      };
    }

    // Contact and support
    if (lowerMessage.includes('contact') || lowerMessage.includes('support') || lowerMessage.includes('help')) {
      return {
        success: true,
        message: "📞 I'm here to help! For complex issues, you can also visit our Help Center or contact our support team through the Contact Us page. What specific question do you have?"
      };
    }

    // Brand comparison queries
    if (lowerMessage.includes('honda vs') || lowerMessage.includes('yamaha vs') || lowerMessage.includes('compare') || lowerMessage.includes('better')) {
      if (lowerMessage.includes('honda') && lowerMessage.includes('yamaha')) {
        return {
          success: true,
          message: "⚖️ **Honda vs Yamaha Comparison:**\n\n**Honda Strengths:**\n• Best-in-class reliability & resale value\n• Excellent fuel efficiency\n• Wide service network\n• Lower maintenance costs\n\n**Yamaha Strengths:**\n• Superior performance & styling\n• Better build quality\n• Advanced features\n• Sportier riding experience\n\n**Popular matchups:**\n• Honda CB Shine vs Yamaha Saluto\n• Honda Activa vs Yamaha Fascino\n\nWhich specific models are you comparing?"
        };
      }
      if (lowerMessage.includes('bajaj') && (lowerMessage.includes('honda') || lowerMessage.includes('tvs'))) {
        return {
          success: true,
          message: "🏆 **Brand Comparison Guide:**\n\n**Bajaj**: Performance & affordability leader\n• Aggressive pricing\n• Powerful engines\n• Good for young riders\n\n**Honda**: Reliability & efficiency champion\n• Best resale value\n• Excellent mileage\n• Trusted quality\n\n**TVS**: Innovation & technology focus\n• Advanced features\n• Good build quality\n• Balanced performance\n\nTell me your priorities: performance, mileage, or reliability?"
        };
      }
    }

    // Mileage-specific queries
    if (lowerMessage.includes('mileage') || lowerMessage.includes('fuel') || lowerMessage.includes('economy')) {
      return {
        success: true,
        message: "⛽ **Best Mileage Champions:**\n\n**Bikes (70+ kmpl):**\n• **Hero HF Deluxe** - 75 kmpl\n• **Bajaj CT 100** - 70 kmpl\n• **Honda CB Shine** - 68 kmpl\n• **TVS Star City+** - 69 kmpl\n\n**Scooters (60+ kmpl):**\n• **Honda Activa 6G** - 60 kmpl\n• **TVS Jupiter** - 62 kmpl\n• **Hero Maestro Edge** - 61 kmpl\n\n💡 **Mileage tips:**\n• Regular servicing improves efficiency\n• Proper tire pressure matters\n• Gentle acceleration saves fuel\n\nLooking for maximum fuel efficiency?"
      };
    }

    // First bike queries
    if (lowerMessage.includes('first bike') || lowerMessage.includes('beginner') || lowerMessage.includes('starter')) {
      return {
        success: true,
        message: "🎆 **Perfect First Bikes for Beginners:**\n\n**Easy to handle:**\n• **Honda CB Shine** - Lightweight, forgiving\n• **Bajaj CT 100** - Simple, affordable\n• **Hero HF Deluxe** - User-friendly\n• **TVS Star City** - Good build quality\n\n🎯 **Why these work:**\n• Light weight & manageable power\n• Comfortable riding position\n• Easy maintenance\n• Good resale value\n• Forgiving handling\n\n📋 **Beginner tips:**\n• Start with 100-125cc engines\n• Focus on comfort over power\n• Choose reliable brands\n\nWhat's your budget for your first bike?"
      };
    }

    // Default response
    return {
      success: true,
      message: "Hi there! 👋 I'm VB Assistant, your smart vehicle advisor. I can help you with:\n\n🏍️ **Vehicle recommendations** (bikes, scooters, EVs)\n💰 **Pricing & financing** options\n🚗 **Test drive booking** assistance\n⚖️ **Brand comparisons** & specs\n📋 **Account & support** queries\n\nWhat would you like to explore today?"
    };
  }

  // Generate vehicle-specific responses
  async getVehicleRecommendation(budget, category, usage) {
    const prompt = `As a vehicle expert, recommend ${category} vehicles for someone with a budget of ₹${budget} who will primarily use it for ${usage}. Keep the response concise and mention 2-3 specific models with brief reasons.`;
    
    try {
      const result = await this.model.generateContent(this.systemContext + "\n\n" + prompt);
      const response = await result.response;
      return response.text().trim();
    } catch (error) {
      console.error('Vehicle recommendation error:', error);
      return `For ${category} vehicles in your budget range, I recommend checking our listings and booking test rides with multiple models to find the perfect fit. Our dealers can provide detailed comparisons based on your specific needs.`;
    }
  }

  // Check if Gemini API is available
  isAvailable() {
    return !!process.env.GEMINI_API_KEY;
  }
}

export default new GeminiService();