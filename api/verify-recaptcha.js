export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ success: false, message: 'Missing reCAPTCHA token' });
  }

  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    return res.status(500).json({ success: false, message: 'Server configuration error' });
  }

  try {
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

    const response = await fetch(verifyUrl, {
      method: 'POST',
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'reCAPTCHA verification failed',
        errors: data['error-codes'] || []
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Verification error' });
  }
}
