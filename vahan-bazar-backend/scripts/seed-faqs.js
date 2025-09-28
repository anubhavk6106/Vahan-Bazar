import { sequelize } from '../config/database.js';
import FAQ from '../models/FAQ.js';

const faqData = [
  // General FAQs
  {
    question: "What is Vahan Bazar?",
    answer: "Vahan Bazar is a comprehensive online marketplace for buying and selling vehicles. We connect buyers with trusted dealers and private sellers across India, offering a wide range of cars, bikes, and commercial vehicles.",
    category: "general",
    tags: ["about", "marketplace", "introduction"],
    sort_order: 1
  },
  {
    question: "Is Vahan Bazar free to use?",
    answer: "Yes, browsing vehicles and basic features are completely free for buyers. Sellers may have listing fees depending on their subscription plan. We offer various pricing tiers to suit different needs.",
    category: "general",
    tags: ["pricing", "free", "cost"],
    sort_order: 2
  },
  {
    question: "Which cities does Vahan Bazar serve?",
    answer: "We currently serve major cities across India including Delhi, Mumbai, Bangalore, Chennai, Hyderabad, Pune, Kolkata, and many more. We are continuously expanding to new locations.",
    category: "general",
    tags: ["locations", "cities", "coverage"],
    sort_order: 3
  },

  // Account FAQs
  {
    question: "How do I create an account on Vahan Bazar?",
    answer: "Creating an account is simple! Click on 'Sign Up' on our homepage, fill in your basic details like name, email, and phone number, verify your phone number, and you're ready to go.",
    category: "account",
    tags: ["signup", "registration", "account creation"],
    sort_order: 1
  },
  {
    question: "I forgot my password. How can I reset it?",
    answer: "Click on 'Forgot Password' on the login page, enter your registered email address, and we'll send you a reset link. Follow the instructions in the email to set a new password.",
    category: "account",
    tags: ["password", "reset", "forgot"],
    sort_order: 2
  },
  {
    question: "How can I update my profile information?",
    answer: "Log in to your account, go to 'My Profile' section, and click on 'Edit Profile'. You can update your personal information, contact details, and preferences. Don't forget to save your changes.",
    category: "account",
    tags: ["profile", "update", "edit"],
    sort_order: 3
  },

  // Vehicle FAQs
  {
    question: "How do I search for vehicles on Vahan Bazar?",
    answer: "Use our advanced search filters on the homepage. You can filter by vehicle type, brand, model, price range, year, fuel type, transmission, and location to find exactly what you're looking for.",
    category: "vehicles",
    tags: ["search", "filters", "find vehicles"],
    sort_order: 1
  },
  {
    question: "Are all vehicles on the platform verified?",
    answer: "We have a verification process for all listings. However, we recommend buyers to personally inspect the vehicle and verify all documents before making a purchase decision.",
    category: "vehicles",
    tags: ["verification", "inspection", "authenticity"],
    sort_order: 2
  },
  {
    question: "Can I sell my vehicle on Vahan Bazar?",
    answer: "Absolutely! Both dealers and individual owners can list their vehicles. Create a seller account, provide vehicle details and photos, and our team will review and publish your listing.",
    category: "vehicles",
    tags: ["sell", "listing", "seller"],
    sort_order: 3
  },

  // Booking FAQs
  {
    question: "How do I book a test drive?",
    answer: "On any vehicle listing page, click on 'Book Test Drive', select your preferred date and time, provide your contact details, and submit the request. The seller will contact you to confirm the appointment.",
    category: "booking",
    tags: ["test drive", "booking", "appointment"],
    sort_order: 1
  },
  {
    question: "Can I cancel or reschedule a test drive?",
    answer: "Yes, you can cancel or reschedule your test drive by going to 'My Bookings' section in your account. We recommend doing this at least 4 hours before the scheduled time to be courteous to the seller.",
    category: "booking",
    tags: ["cancel", "reschedule", "test drive"],
    sort_order: 2
  },
  {
    question: "What should I bring for a test drive?",
    answer: "Please bring a valid driving license, a form of ID (Aadhar card, PAN card, etc.), and if possible, someone knowledgeable about vehicles. The seller may also ask for a security deposit which will be returned after the test drive.",
    category: "booking",
    tags: ["test drive", "documents", "requirements"],
    sort_order: 3
  },

  // Payment FAQs
  {
    question: "What payment methods are accepted?",
    answer: "We accept various payment methods including credit/debit cards, net banking, UPI, digital wallets, and bank transfers. For high-value transactions, we recommend using secure banking channels.",
    category: "payment",
    tags: ["payment methods", "cards", "upi"],
    sort_order: 1
  },
  {
    question: "Is my payment information secure?",
    answer: "Yes, we use industry-standard encryption and security measures to protect your payment information. We are PCI DSS compliant and never store your complete card details.",
    category: "payment",
    tags: ["security", "encryption", "safety"],
    sort_order: 2
  },
  {
    question: "Do I need to pay to browse vehicles?",
    answer: "No, browsing vehicles is completely free. You only pay when you purchase listing credits as a seller or subscribe to premium features.",
    category: "payment",
    tags: ["free browsing", "costs", "pricing"],
    sort_order: 3
  },

  // Technical FAQs
  {
    question: "The website is loading slowly. What should I do?",
    answer: "Try clearing your browser cache and cookies, ensure you have a stable internet connection, disable browser extensions temporarily, or try using a different browser. If the issue persists, contact our support team.",
    category: "technical",
    tags: ["slow loading", "performance", "troubleshooting"],
    sort_order: 1
  },
  {
    question: "I can't upload photos of my vehicle. What's wrong?",
    answer: "Ensure your images are in JPG, PNG, or WebP format and each file is under 5MB. Try using a different browser or device. If you continue to face issues, contact our technical support team.",
    category: "technical",
    tags: ["upload", "photos", "images"],
    sort_order: 2
  },
  {
    question: "The mobile app is crashing. How can I fix this?",
    answer: "Try force-closing and reopening the app, restart your phone, ensure you have the latest app version, or clear the app cache. If the problem continues, uninstall and reinstall the app.",
    category: "technical",
    tags: ["mobile app", "crash", "troubleshooting"],
    sort_order: 3
  },

  // Policies FAQs
  {
    question: "What is your refund policy?",
    answer: "Refunds are processed according to our refund policy which varies by service type. Generally, listing fees for sellers are non-refundable, but premium subscription fees may be refunded within 48 hours of purchase. Vehicle purchases are governed by the agreement between buyer and seller.",
    category: "policies",
    tags: ["refund", "policy", "returns"],
    sort_order: 1
  },
  {
    question: "What happens if I encounter a fraudulent listing?",
    answer: "Report it immediately using the 'Report' button on the listing or contact our support team. We take fraud seriously and will investigate promptly. We also recommend buyers to verify all details independently before making any payments.",
    category: "policies",
    tags: ["fraud", "report", "safety"],
    sort_order: 2
  },
  {
    question: "Can I get a warranty on vehicles purchased through Vahan Bazar?",
    answer: "Warranty terms depend on the seller and vehicle type. Some dealers offer warranties while private sellers typically don't. Check the listing details or contact the seller directly for warranty information. We also partner with third-party warranty providers.",
    category: "policies",
    tags: ["warranty", "guarantee", "protection"],
    sort_order: 3
  }
];

const seedFAQs = async () => {
  try {
    console.log('🌱 Starting FAQ seeding...');
    
    // Clear existing FAQs
    await FAQ.destroy({ where: {} });
    console.log('📝 Cleared existing FAQs');
    
    // Insert new FAQs
    await FAQ.bulkCreate(faqData);
    console.log(`✅ Successfully seeded ${faqData.length} FAQs`);
    
    // Display summary
    const counts = await Promise.all([
      FAQ.count({ where: { category: 'general' } }),
      FAQ.count({ where: { category: 'account' } }),
      FAQ.count({ where: { category: 'vehicles' } }),
      FAQ.count({ where: { category: 'booking' } }),
      FAQ.count({ where: { category: 'payment' } }),
      FAQ.count({ where: { category: 'technical' } }),
      FAQ.count({ where: { category: 'policies' } })
    ]);
    
    console.log('\n📊 FAQ Categories:');
    console.log(`   - General: ${counts[0]} FAQs`);
    console.log(`   - Account: ${counts[1]} FAQs`);
    console.log(`   - Vehicles: ${counts[2]} FAQs`);
    console.log(`   - Booking: ${counts[3]} FAQs`);
    console.log(`   - Payment: ${counts[4]} FAQs`);
    console.log(`   - Technical: ${counts[5]} FAQs`);
    console.log(`   - Policies: ${counts[6]} FAQs`);
    
  } catch (error) {
    console.error('❌ Error seeding FAQs:', error);
    throw error;
  }
};

// Run seeding if this file is executed directly
seedFAQs()
  .then(() => {
    console.log('🎉 FAQ seeding completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 FAQ seeding failed:', error);
    process.exit(1);
  });

export default seedFAQs;