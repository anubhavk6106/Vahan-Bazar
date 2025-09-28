import express from 'express';
import { Op } from 'sequelize';
import Support from '../models/Support.js';
import FAQ from '../models/FAQ.js';
import { validateSupportTicket, validateFAQ } from '../middleware/validation.js';

const router = express.Router();

// Support Ticket Routes

// Create new support ticket
router.post('/tickets', validateSupportTicket, async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      subject,
      category,
      priority,
      message,
      user_id
    } = req.body;

    const ticket = await Support.create({
      name,
      email,
      phone,
      subject,
      category,
      priority: priority || 'medium',
      message,
      user_id
    });

    res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: {
        ticket_id: ticket.ticket_id,
        id: ticket.id,
        status: ticket.status,
        priority: ticket.priority
      }
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create support ticket',
      error: error.message
    });
  }
});

// Get support ticket by ticket ID
router.get('/tickets/:ticketId', async (req, res) => {
  try {
    const { ticketId } = req.params;

    const ticket = await Support.findOne({
      where: { ticket_id: ticketId },
      attributes: { exclude: ['user_id', 'assigned_to'] }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
    }

    res.json({
      success: true,
      data: ticket
    });
  } catch (error) {
    console.error('Error fetching support ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch support ticket',
      error: error.message
    });
  }
});

// Get all support tickets (with filters)
router.get('/tickets', async (req, res) => {
  try {
    const {
      status,
      category,
      priority,
      page = 1,
      limit = 10,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const whereConditions = {};

    // Apply filters
    if (status) whereConditions.status = status;
    if (category) whereConditions.category = category;
    if (priority) whereConditions.priority = priority;

    // Search functionality
    if (search) {
      whereConditions[Op.or] = [
        { ticket_id: { [Op.like]: `%${search}%` } },
        { name: { [Op.like]: `%${search}%` } },
        { subject: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    const { count, rows: tickets } = await Support.findAndCountAll({
      where: whereConditions,
      attributes: { exclude: ['user_id', 'assigned_to'] },
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.json({
      success: true,
      data: {
        tickets,
        pagination: {
          total: count,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(count / limit)
        }
      }
    });
  } catch (error) {
    console.error('Error fetching support tickets:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch support tickets',
      error: error.message
    });
  }
});

// Update support ticket status
router.patch('/tickets/:ticketId/status', async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, admin_response } = req.body;

    const ticket = await Support.findOne({
      where: { ticket_id: ticketId }
    });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Support ticket not found'
      });
    }

    const updateData = { status };
    
    if (admin_response) {
      updateData.admin_response = admin_response;
    }

    if (status === 'resolved') {
      updateData.resolved_at = new Date();
    } else if (status === 'closed') {
      updateData.closed_at = new Date();
    }

    await ticket.update(updateData);

    res.json({
      success: true,
      message: 'Support ticket updated successfully',
      data: {
        ticket_id: ticket.ticket_id,
        status: ticket.status
      }
    });
  } catch (error) {
    console.error('Error updating support ticket:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update support ticket',
      error: error.message
    });
  }
});

// FAQ Routes

// Get all FAQs (with filters and search)
router.get('/faqs', async (req, res) => {
  try {
    const {
      category,
      search,
      active_only = 'true',
      limit = 50
    } = req.query;

    const whereConditions = {};

    // Filter by active status
    if (active_only === 'true') {
      whereConditions.is_active = true;
    }

    // Filter by category
    if (category) {
      whereConditions.category = category;
    }

    // Search functionality
    if (search) {
      whereConditions[Op.or] = [
        { question: { [Op.like]: `%${search}%` } },
        { answer: { [Op.like]: `%${search}%` } },
        { tags: { [Op.like]: `%${search}%` } }
      ];
    }

    const faqs = await FAQ.findAll({
      where: whereConditions,
      order: [
        ['sort_order', 'ASC'],
        ['helpful_count', 'DESC'],
        ['view_count', 'DESC'],
        ['createdAt', 'DESC']
      ],
      limit: parseInt(limit)
    });

    res.json({
      success: true,
      data: faqs
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQs',
      error: error.message
    });
  }
});

// Get FAQ by ID and increment view count
router.get('/faqs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findByPk(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    // Increment view count
    await faq.increment('view_count');

    res.json({
      success: true,
      data: faq
    });
  } catch (error) {
    console.error('Error fetching FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQ',
      error: error.message
    });
  }
});

// Create new FAQ (admin only)
router.post('/faqs', validateFAQ, async (req, res) => {
  try {
    const {
      question,
      answer,
      category,
      tags,
      sort_order,
      created_by
    } = req.body;

    const faq = await FAQ.create({
      question,
      answer,
      category,
      tags: tags || [],
      sort_order: sort_order || 0,
      created_by
    });

    res.status(201).json({
      success: true,
      message: 'FAQ created successfully',
      data: faq
    });
  } catch (error) {
    console.error('Error creating FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create FAQ',
      error: error.message
    });
  }
});

// Update FAQ (admin only)
router.put('/faqs/:id', validateFAQ, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      question,
      answer,
      category,
      tags,
      is_active,
      sort_order,
      updated_by
    } = req.body;

    const faq = await FAQ.findByPk(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    await faq.update({
      question,
      answer,
      category,
      tags: tags || [],
      is_active: is_active !== undefined ? is_active : faq.is_active,
      sort_order: sort_order !== undefined ? sort_order : faq.sort_order,
      updated_by
    });

    res.json({
      success: true,
      message: 'FAQ updated successfully',
      data: faq
    });
  } catch (error) {
    console.error('Error updating FAQ:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update FAQ',
      error: error.message
    });
  }
});

// Mark FAQ as helpful
router.post('/faqs/:id/helpful', async (req, res) => {
  try {
    const { id } = req.params;

    const faq = await FAQ.findByPk(id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    await faq.increment('helpful_count');

    res.json({
      success: true,
      message: 'Thank you for your feedback!',
      data: {
        helpful_count: faq.helpful_count + 1
      }
    });
  } catch (error) {
    console.error('Error marking FAQ as helpful:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update FAQ',
      error: error.message
    });
  }
});

// Get FAQ categories
router.get('/faq-categories', async (req, res) => {
  try {
    const categories = [
      'general',
      'account',
      'vehicles',
      'booking',
      'payment',
      'technical',
      'policies'
    ];

    res.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching FAQ categories:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQ categories',
      error: error.message
    });
  }
});

// Support statistics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalTickets,
      openTickets,
      resolvedTickets,
      highPriorityTickets,
      totalFAQs,
      activeFAQs
    ] = await Promise.all([
      Support.count(),
      Support.count({ where: { status: 'open' } }),
      Support.count({ where: { status: 'resolved' } }),
      Support.count({ where: { priority: 'high' } }),
      FAQ.count(),
      FAQ.count({ where: { is_active: true } })
    ]);

    res.json({
      success: true,
      data: {
        tickets: {
          total: totalTickets,
          open: openTickets,
          resolved: resolvedTickets,
          high_priority: highPriorityTickets
        },
        faqs: {
          total: totalFAQs,
          active: activeFAQs
        }
      }
    });
  } catch (error) {
    console.error('Error fetching support stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch support statistics',
      error: error.message
    });
  }
});

export default router;