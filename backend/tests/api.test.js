process.env.NODE_ENV = 'test';
const http = require('http');
const { app } = require('../server');

const PORT = 5088;

function makeRequest(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const headers = {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const options = {
      hostname: '127.0.0.1',
      port: PORT,
      path,
      method,
      headers,
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runTests() {
  const server = app.listen(PORT, async () => {
    console.log(`[WORKLX TestRunner] Test server listening on port ${PORT}...`);
    let passed = 0;
    let failed = 0;

    try {
      // 1. Health check
      console.log('1. Testing /api/health...');
      const health = await makeRequest('/api/health');
      if (health.status === 200 && health.body.service.includes('WORKLX')) {
        console.log('PASS: Health Check');
        passed++;
      } else {
        console.error('FAIL: Health Check', health);
        failed++;
      }

      // 2. Categories
      console.log('2. Testing /api/workers/categories/all...');
      const cats = await makeRequest('/api/workers/categories/all');
      if (cats.status === 200 && cats.body.categories.length >= 6) {
        console.log(`PASS: Categories returned (${cats.body.categories.length} categories)`);
        passed++;
      } else {
        console.error('FAIL: Categories', cats);
        failed++;
      }

      // 3. Worker Search
      console.log('3. Testing /api/workers (filter by Electrician)...');
      const workers = await makeRequest('/api/workers?category=Electrician');
      if (workers.status === 200 && workers.body.workers.length > 0) {
        console.log(`PASS: Workers Search returned ${workers.body.workers.length} electricians`);
        passed++;
      } else {
        console.error('FAIL: Workers Search', workers);
        failed++;
      }

      // 4. Seeker Login
      console.log('4. Testing /api/auth/login (Seeker)...');
      const seekerLogin = await makeRequest('/api/auth/login', 'POST', {
        email: 'gokul@gmail.com',
        password: 'Seeker@123',
      });
      let seekerToken = null;
      if (seekerLogin.status === 200 && seekerLogin.body.token) {
        seekerToken = seekerLogin.body.token;
        console.log('PASS: Seeker Login successful');
        passed++;
      } else {
        console.error('FAIL: Seeker Login', seekerLogin);
        failed++;
      }

      // 5. Admin Login
      console.log('5. Testing /api/auth/login (Admin)...');
      const adminLogin = await makeRequest('/api/auth/login', 'POST', {
        email: 'admin@worklx.com',
        password: 'Admin@123',
      });
      let adminToken = null;
      if (adminLogin.status === 200 && adminLogin.body.token && adminLogin.body.user.role === 'ADMIN') {
        adminToken = adminLogin.body.token;
        console.log('PASS: Admin Login successful');
        passed++;
      } else {
        console.error('FAIL: Admin Login', adminLogin);
        failed++;
      }

      // 6. Admin Stats
      console.log('6. Testing /api/admin/stats (Admin Protected)...');
      const stats = await makeRequest('/api/admin/stats', 'GET', null, adminToken);
      if (stats.status === 200 && stats.body.stats.totalUsers > 0) {
        console.log(`PASS: Admin Stats (Total Users: ${stats.body.stats.totalUsers}, Total Bookings: ${stats.body.stats.totalBookings})`);
        passed++;
      } else {
        console.error('FAIL: Admin Stats', stats);
        failed++;
      }

      // 7. Create Booking
      console.log('7. Testing /api/bookings (Create Booking)...');
      const bookingRes = await makeRequest('/api/bookings', 'POST', {
        workerId: 'user_worker_01',
        service: 'Electrician',
        date: '2026-09-26',
        time: '11:00 AM',
        address: '100 Junction Main Road, Salem',
        description: 'Living room light fitting and plug socket installation',
        amount: 500,
      }, seekerToken);
      let bookingId = null;
      if (bookingRes.status === 201 && bookingRes.body.booking) {
        bookingId = bookingRes.body.booking._id;
        console.log(`PASS: Booking created with ID: ${bookingId}`);
        passed++;
      } else {
        console.error('FAIL: Create Booking', bookingRes);
        failed++;
      }

      // 8. Payment Flow
      console.log('8. Testing /api/payments/create-order and /verify...');
      const orderRes = await makeRequest('/api/payments/create-order', 'POST', {
        bookingId,
        amount: 500,
      }, seekerToken);
      const verifyRes = await makeRequest('/api/payments/verify', 'POST', {
        bookingId,
        razorpayOrderId: orderRes.body.order.id,
        amount: 500,
      }, seekerToken);
      if (verifyRes.status === 200 && verifyRes.body.success) {
        console.log('PASS: Payment order & verification successful');
        passed++;
      } else {
        console.error('FAIL: Payment verification', verifyRes);
        failed++;
      }

      // 9. Submit Review
      console.log('9. Testing /api/reviews (Submit Review)...');
      const reviewRes = await makeRequest('/api/reviews', 'POST', {
        bookingId: 'booking_02',
        workerId: 'user_worker_02',
        rating: 5,
        comment: 'Outstanding plumbing work and fast response!',
      }, seekerToken);
      if (reviewRes.status === 201 && reviewRes.body.success) {
        console.log('PASS: Review created successfully');
        passed++;
      } else {
        console.error('FAIL: Review creation', reviewRes);
        failed++;
      }

      console.log(`\n======================================================`);
      console.log(`WORKLX Backend API Test Suite: ${passed} Passed, ${failed} Failed`);
      console.log(`======================================================\n`);
    } catch (err) {
      console.error('[WORKLX TestRunner] Unexpected error:', err);
      failed++;
    } finally {
      server.close(() => {
        process.exit(failed === 0 ? 0 : 1);
      });
    }
  });
}

runTests();
