export default async function handler(req, res) {
  // Autoriser uniquement les requêtes POST
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    });
  }

  // Récupérer le token reCAPTCHA
  const { token } = req.body || {};

  if (!token || typeof token !== 'string') {
    return res.status(400).json({
      success: false,
      message: 'Missing reCAPTCHA token'
    });
  }

  // Clé secrète stockée dans Vercel
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    console.error('RECAPTCHA_SECRET_KEY is missing');

    return res.status(500).json({
      success: false,
      message: 'Server configuration error'
    });
  }

  try {
    // Vérification auprès de Google reCAPTCHA
    const response = await fetch(
      'https://www.google.com/recaptcha/api/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          secret: secretKey,
          response: token
        })
      }
    );

    const data = await response.json();

    // Le CAPTCHA doit être validé par Google
    if (!data.success) {
      console.log(
        'reCAPTCHA verification failed:',
        data['error-codes'] || []
      );

      return res.status(400).json({
        success: false,
        message: 'reCAPTCHA verification failed'
      });
    }

    // Vérifier que le CAPTCHA vient bien de ton domaine
    if (data.hostname !== 'archive-x-iota.vercel.app') {
      console.log('Invalid reCAPTCHA hostname:', data.hostname);

      return res.status(400).json({
        success: false,
        message: 'Invalid reCAPTCHA domain'
      });
    }

    // Vérification réussie
    return res.status(200).json({
      success: true
    });

  } catch (error) {
    console.error('reCAPTCHA verification error:', error);

    return res.status(500).json({
      success: false,
      message: 'Verification error'
    });
  }
}
