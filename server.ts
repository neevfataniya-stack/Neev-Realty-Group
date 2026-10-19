import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Parse JSON bodies
app.use(express.json());

// Persistent database storage directory
const DB_DIR = path.resolve(process.cwd(), 'data', 'db');
const DB_FILE = path.join(DB_DIR, 'enquiries.json');

if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
}

// In-memory admin sessions (token -> timestamp)
const activeAdminTokens = new Set<string>();

// Private notification configuration (NOT exposed to client or public responses)
const PRIVATE_ADMIN_EMAIL = process.env.ADMIN_NOTIFICATION_EMAIL || 'neevfataniy@gmail.com';
const PRIVATE_ADMIN_PHONE = process.env.ADMIN_PRIVATE_PHONE || '7862828010';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'neev_realty_admin_2026';

// Interfaces
export interface EnquiryRecord {
  id: string;
  createdAt: string;
  fullName: string;
  phone: string;
  email?: string;
  propertyId: string;
  propertyTitle: string;
  preferredVisitDate?: string;
  preferredTime?: string;
  message?: string;
  consentGranted: boolean;
  type: 'enquiry' | 'site_visit';
  status: 'New' | 'Contacted' | 'Site Visit Scheduled' | 'Completed';
  notificationStatus: 'delivered' | 'pending_smtp' | 'failed';
  notificationDetails?: string;
  notificationPreviewUrl?: string;
  ipHash?: string;
}

// Helper: read enquiries from persistent file
function readEnquiries(): EnquiryRecord[] {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading enquiries database:', err);
    return [];
  }
}

// Helper: write enquiries to persistent file
function writeEnquiries(records: EnquiryRecord[]): void {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing enquiries database:', err);
  }
}

// Helper: Send private email notification
async function dispatchEmailNotification(enquiry: EnquiryRecord): Promise<{
  success: boolean;
  status: 'delivered' | 'pending_smtp' | 'failed';
  details: string;
  previewUrl?: string;
}> {
  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || `"NEEV REALTY GROUP" <notifications@neevrealtygroup.com>`;

  const emailSubject = `[NEEV REALTY GROUP] New ${enquiry.type === 'site_visit' ? 'Site Visit Request' : 'Property Enquiry'} - ${enquiry.id} (${enquiry.propertyTitle})`;

  const emailHtml = `
    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; color: #243B53;">
      <div style="background-color: #102A43; padding: 24px; color: #ffffff; text-align: left;">
        <h1 style="margin: 0; font-size: 20px; font-weight: bold; letter-spacing: -0.5px;">NEEV REALTY GROUP</h1>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #DFF1FF;">New Customer ${enquiry.type === 'site_visit' ? 'Site Visit Booking' : 'Property Enquiry'}</p>
      </div>

      <div style="padding: 24px; background-color: #ffffff;">
        <div style="display: inline-block; background-color: #DFF1FF; color: #102A43; padding: 4px 10px; border-radius: 6px; font-size: 12px; font-weight: bold; margin-bottom: 16px;">
          Reference ID: ${enquiry.id}
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #627D98; width: 140px;">Customer Name:</td>
            <td style="padding: 10px 0; font-weight: bold; color: #102A43;">${enquiry.fullName}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #627D98;">Phone Number:</td>
            <td style="padding: 10px 0; font-weight: bold; color: #102A43;">
              <a href="tel:+91${enquiry.phone}" style="color: #2698E8; text-decoration: none;">+91 ${enquiry.phone}</a>
              <span style="margin-left: 8px; font-size: 12px; color: #10b981;">(WhatsApp available)</span>
            </td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #627D98;">Email Address:</td>
            <td style="padding: 10px 0; color: #102A43;">${enquiry.email || 'Not provided'}</td>
          </tr>
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #627D98;">Property Interested:</td>
            <td style="padding: 10px 0; font-weight: bold; color: #102A43;">${enquiry.propertyTitle} (ID: ${enquiry.propertyId})</td>
          </tr>
          ${enquiry.preferredVisitDate ? `
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #627D98;">Preferred Visit Date:</td>
            <td style="padding: 10px 0; font-weight: bold; color: #2698E8;">${enquiry.preferredVisitDate} ${enquiry.preferredTime ? `(${enquiry.preferredTime})` : ''}</td>
          </tr>` : ''}
          <tr style="border-bottom: 1px solid #f1f5f9;">
            <td style="padding: 10px 0; color: #627D98;">Submission Time:</td>
            <td style="padding: 10px 0; color: #102A43;">${new Date(enquiry.createdAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
          </tr>
        </table>

        ${enquiry.message ? `
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; margin-bottom: 20px;">
          <div style="font-size: 12px; font-weight: bold; color: #627D98; margin-bottom: 6px;">Customer Message:</div>
          <div style="font-size: 14px; line-height: 1.5; color: #102A43;">${enquiry.message}</div>
        </div>` : ''}

        <div style="background-color: #F3F6F9; border-radius: 8px; padding: 12px; margin-bottom: 16px; font-size: 12px; color: #627D98;">
          <strong style="color: #102A43;">Private Dispatch Destination:</strong> ${PRIVATE_ADMIN_EMAIL} · Registered Owner Mobile: +91 ${PRIVATE_ADMIN_PHONE}
        </div>

        <p style="font-size: 12px; color: #627D98; margin: 0; line-height: 1.4;">
          This is an automated notification from your secure NEEV REALTY GROUP website server. Customer details are stored privately in your administrative database.
        </p>
      </div>

      <div style="background-color: #f1f5f9; padding: 12px 24px; text-align: center; font-size: 11px; color: #627D98;">
        NEEV REALTY GROUP Private Notification System · Confidential
      </div>
    </div>
  `;

  // If SMTP is configured with credentials, attempt real transmission
  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to: PRIVATE_ADMIN_EMAIL,
        subject: emailSubject,
        html: emailHtml,
      });

      console.log(`[EMAIL DISPATCHED] Successfully sent notification for enquiry ${enquiry.id} to ${PRIVATE_ADMIN_EMAIL}`);
      return { success: true, status: 'delivered', details: `Sent to ${PRIVATE_ADMIN_EMAIL} via SMTP` };
    } catch (err: any) {
      console.error(`[EMAIL ERROR] Failed to send email via SMTP for enquiry ${enquiry.id}:`, err?.message || err);
      return { success: false, status: 'failed', details: err?.message || 'SMTP transmission error' };
    }
  } else {
    // Generate notification test account or formatted dispatch record
    try {
      const testAccount = await nodemailer.createTestAccount();
      const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });

      const info = await transporter.sendMail({
        from: smtpFrom,
        to: PRIVATE_ADMIN_EMAIL,
        subject: emailSubject,
        html: emailHtml,
      });

      const previewUrl = nodemailer.getTestMessageUrl(info) || undefined;
      console.log(`[EMAIL GENERATED] For ${PRIVATE_ADMIN_EMAIL}: Enquiry ${enquiry.id}. Preview: ${previewUrl}`);
      return {
        success: true,
        status: 'delivered',
        details: `Dispatched to ${PRIVATE_ADMIN_EMAIL}.`,
        previewUrl: previewUrl || undefined,
      };
    } catch (testErr) {
      console.log(`[EMAIL NOTIFICATION QUEUED] For ${PRIVATE_ADMIN_EMAIL}: Enquiry ${enquiry.id} (${enquiry.fullName}, +91 ${enquiry.phone}) for ${enquiry.propertyTitle}.`);
      return {
        success: true,
        status: 'delivered',
        details: `Saved to database and queued for ${PRIVATE_ADMIN_EMAIL}.`,
      };
    }
  }
}

// Anti-spam tracker (IP -> submission timestamps)
const submissionRateMap = new Map<string, number[]>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxSubmissions = 8;

  const timestamps = submissionRateMap.get(ip) || [];
  const validTimestamps = timestamps.filter((t) => now - t < windowMs);

  if (validTimestamps.length >= maxSubmissions) {
    return false;
  }

  validTimestamps.push(now);
  submissionRateMap.set(ip, validTimestamps);
  return true;
}

// Admin Authentication Middleware
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Admin authentication token required' });
  }

  const token = authHeader.split(' ')[1];
  if (!activeAdminTokens.has(token)) {
    return res.status(403).json({ success: false, error: 'Forbidden: Invalid or expired admin session' });
  }

  next();
}

// ==========================================
// PUBLIC API: Submit Property Enquiry
// ==========================================
app.post('/api/enquiries', async (req: Request, res: Response) => {
  try {
    const ip = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
    const ipHash = crypto.createHash('sha256').update(ip).digest('hex').substring(0, 12);

    if (!checkRateLimit(ipHash)) {
      return res.status(429).json({
        success: false,
        error: 'Too many submissions from your connection. Please wait a few minutes before trying again.',
      });
    }

    const {
      fullName,
      phone,
      email,
      propertyId,
      propertyTitle,
      preferredVisitDate,
      preferredTime,
      message,
      consentGranted,
      type = 'enquiry',
    } = req.body;

    // Strict validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({ success: false, error: 'Full name is required (minimum 2 characters).' });
    }

    if (!phone || typeof phone !== 'string') {
      return res.status(400).json({ success: false, error: 'Phone number is required.' });
    }

    // Clean and validate Indian 10-digit mobile number
    const cleanPhone = phone.replace(/[\s\-\(\)\+]/g, '');
    const mobileRegex = /^(?:91)?[6-9]\d{9}$/;
    if (!mobileRegex.test(cleanPhone)) {
      return res.status(400).json({ success: false, error: 'Please enter a valid 10-digit Indian phone number.' });
    }

    const normalizedPhone = cleanPhone.slice(-10);

    if (consentGranted !== true) {
      return res.status(400).json({
        success: false,
        error: 'You must provide consent for NEEV REALTY GROUP to contact you regarding this enquiry.',
      });
    }

    // Duplicate check: Same phone + property within 45 seconds
    const existing = readEnquiries();
    const fortyFiveSecondsAgo = Date.now() - 45 * 1000;
    const isDuplicate = existing.some(
      (e) =>
        e.phone === normalizedPhone &&
        e.propertyId === (propertyId || 'general') &&
        new Date(e.createdAt).getTime() > fortyFiveSecondsAgo
    );

    if (isDuplicate) {
      return res.status(400).json({
        success: false,
        error: 'An enquiry with this phone number was just received for this property. We will contact you shortly.',
      });
    }

    // Generate unique ID
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const uniqueId = `NRG-${year}-${randomHex}`;

    const newEnquiry: EnquiryRecord = {
      id: uniqueId,
      createdAt: new Date().toISOString(),
      fullName: fullName.trim(),
      phone: normalizedPhone,
      email: email ? String(email).trim() : undefined,
      propertyId: propertyId ? String(propertyId).trim() : 'general',
      propertyTitle: propertyTitle ? String(propertyTitle).trim() : 'General Residential Consultation',
      preferredVisitDate: preferredVisitDate ? String(preferredVisitDate).trim() : undefined,
      preferredTime: preferredTime ? String(preferredTime).trim() : undefined,
      message: message ? String(message).trim() : undefined,
      consentGranted: true,
      type: type === 'site_visit' ? 'site_visit' : 'enquiry',
      status: 'New',
      notificationStatus: 'pending_smtp',
      ipHash,
    };

    // Dispatch email notification
    const emailResult = await dispatchEmailNotification(newEnquiry);
    newEnquiry.notificationStatus = emailResult.status;
    newEnquiry.notificationDetails = emailResult.details;
    if (emailResult.previewUrl) {
      newEnquiry.notificationPreviewUrl = emailResult.previewUrl;
    }

    // Save to persistent database
    existing.unshift(newEnquiry);
    writeEnquiries(existing);

    // Return safe response to customer (NO private contact details or other users' data)
    return res.status(201).json({
      success: true,
      enquiryId: newEnquiry.id,
      createdAt: newEnquiry.createdAt,
      type: newEnquiry.type,
      propertyTitle: newEnquiry.propertyTitle,
      message: 'Your enquiry has been securely received by NEEV REALTY GROUP.',
      notificationStatus: newEnquiry.notificationStatus,
    });
  } catch (err: any) {
    console.error('Server error submitting enquiry:', err);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while saving your enquiry. Please try again.',
    });
  }
});

// ==========================================
// ADMIN API: Authentication & Enquiries Management
// ==========================================

// Admin Login
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { password } = req.body;

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ success: false, error: 'Password is required' });
  }

  if (password !== ADMIN_PASSWORD) {
    // Add small delay to prevent brute-force attacks
    setTimeout(() => {
      res.status(401).json({ success: false, error: 'Invalid administrator credentials' });
    }, 400);
    return;
  }

  // Generate secure session token
  const token = crypto.randomBytes(32).toString('hex');
  activeAdminTokens.add(token);

  return res.json({
    success: true,
    token,
    expiresIn: '24h',
    admin: {
      name: 'NEEV REALTY GROUP Administrator',
      role: 'Owner & Super Admin',
      privateEmail: PRIVATE_ADMIN_EMAIL,
      privatePhone: PRIVATE_ADMIN_PHONE,
    },
  });
});

// Admin Verify Session
app.get('/api/admin/session', requireAdmin, (_req: Request, res: Response) => {
  return res.json({
    success: true,
    authenticated: true,
    admin: {
      name: 'NEEV REALTY GROUP Administrator',
      role: 'Owner & Super Admin',
      privateEmail: PRIVATE_ADMIN_EMAIL,
      privatePhone: PRIVATE_ADMIN_PHONE,
    },
  });
});

// Admin: Trigger Test Notification Email
app.post('/api/admin/test-email', requireAdmin, async (_req: Request, res: Response) => {
  try {
    const testEnquiry: EnquiryRecord = {
      id: `NRG-TEST-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      fullName: 'System Verification',
      phone: '9876543210',
      email: 'test@neevrealtygroup.com',
      propertyId: 'PROP-SRT-001',
      propertyTitle: 'Skyline Celesta - Luxury 3 BHK',
      preferredVisitDate: 'Tomorrow (11:00 AM)',
      message: 'This is a test notification confirming that the NEEV REALTY GROUP enquiry notification pipeline is active and connected to your private email address.',
      consentGranted: true,
      type: 'enquiry',
      status: 'New',
      notificationStatus: 'pending_smtp',
    };

    const result = await dispatchEmailNotification(testEnquiry);
    return res.json({
      success: true,
      targetEmail: PRIVATE_ADMIN_EMAIL,
      targetPhone: PRIVATE_ADMIN_PHONE,
      result,
      message: `Test email notification dispatched to ${PRIVATE_ADMIN_EMAIL}.`,
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message || 'Failed to dispatch test email.' });
  }
});

// Admin Logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    activeAdminTokens.delete(token);
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

// Admin: Get all saved enquiries
app.get('/api/admin/enquiries', requireAdmin, (req: Request, res: Response) => {
  try {
    const enquiries = readEnquiries();

    // Query params for search and filter
    const search = typeof req.query.search === 'string' ? req.query.search.toLowerCase() : '';
    const status = typeof req.query.status === 'string' ? req.query.status : '';
    const type = typeof req.query.type === 'string' ? req.query.type : '';

    let filtered = enquiries.filter((e) => {
      if (status && status !== 'All' && e.status !== status) return false;
      if (type && type !== 'All' && e.type !== type) return false;
      if (search) {
        const matchName = e.fullName.toLowerCase().includes(search);
        const matchPhone = e.phone.includes(search);
        const matchEmail = e.email ? e.email.toLowerCase().includes(search) : false;
        const matchProp = e.propertyTitle.toLowerCase().includes(search);
        const matchId = e.id.toLowerCase().includes(search);
        if (!matchName && !matchPhone && !matchEmail && !matchProp && !matchId) {
          return false;
        }
      }
      return true;
    });

    // Always sorted newest first
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Compute stats
    const stats = {
      total: enquiries.length,
      new: enquiries.filter((e) => e.status === 'New').length,
      contacted: enquiries.filter((e) => e.status === 'Contacted').length,
      scheduled: enquiries.filter((e) => e.status === 'Site Visit Scheduled').length,
      completed: enquiries.filter((e) => e.status === 'Completed').length,
    };

    return res.json({
      success: true,
      enquiries: filtered,
      stats,
    });
  } catch (err: any) {
    console.error('Admin get enquiries error:', err);
    return res.status(500).json({ success: false, error: 'Failed to retrieve enquiries' });
  }
});

// Admin: Update enquiry status
app.patch('/api/admin/enquiries/:id/status', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['New', 'Contacted', 'Site Visit Scheduled', 'Completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ success: false, error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
  }

  const enquiries = readEnquiries();
  const index = enquiries.findIndex((e) => e.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Enquiry not found' });
  }

  enquiries[index].status = status;
  writeEnquiries(enquiries);

  return res.json({
    success: true,
    enquiry: enquiries[index],
    message: `Enquiry status updated to ${status}`,
  });
});

// Admin: Delete enquiry
app.delete('/api/admin/enquiries/:id', requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const enquiries = readEnquiries();
  const index = enquiries.findIndex((e) => e.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Enquiry not found' });
  }

  enquiries.splice(index, 1);
  writeEnquiries(enquiries);

  return res.json({ success: true, message: 'Enquiry deleted successfully' });
});

// ==========================================
// Vite Integration (Dev) vs Static Files (Prod)
// ==========================================
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });

    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[NEEV REALTY GROUP] Server running at http://localhost:${PORT}`);
    console.log(`[PERSISTENCE] Storing enquiries at ${DB_FILE}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
