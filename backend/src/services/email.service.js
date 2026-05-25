const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    });
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
};

const sendWelcomeEmail = async (user) => {
  const html = `
    <h1>Bienvenue sur TerraCI! 🏘️</h1>
    <p>Bonjour ${user.firstName},</p>
    <p>Nous sommes ravis de vous accueillir sur la plateforme TerraCI.</p>
    <p>Vous pouvez maintenant :</p>
    <ul>
      <li>Publier vos terrains</li>
      <li>Rechercher des terrains</li>
      <li>Faire des offres</li>
      <li>Converser avec d'autres utilisateurs</li>
    </ul>
    <p>Bonne chance! 🚀</p>
  `;
  return sendEmail(user.email, 'Bienvenue sur TerraCI', html);
};

const sendVerificationEmail = async (user, token) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email/${token}`;
  const html = `
    <h1>Vérifier votre email</h1>
    <p>Cliquez sur le lien ci-dessous pour vérifier votre adresse email :</p>
    <a href="${verificationLink}">Vérifier mon email</a>
    <p>Ce lien expire dans 24 heures.</p>
  `;
  return sendEmail(user.email, 'Vérification de votre email', html);
};

const sendOfferNotificationEmail = async (seller, offer, land) => {
  const html = `
    <h1>Nouvelle offre reçue 💰</h1>
    <p>Vous avez reçu une nouvelle offre pour votre terrain : <strong>${land.title}</strong></p>
    <p><strong>Prix offert :</strong> ${offer.offeredPrice} XOF</p>
    <p><strong>Message :</strong> ${offer.message || 'Aucun message'}</p>
    <p><a href="${process.env.FRONTEND_URL}/dashboard/offers">Voir les offres</a></p>
  `;
  return sendEmail(seller.email, 'Nouvelle offre reçue', html);
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const html = `
    <h1>Réinitialiser votre mot de passe</h1>
    <p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
    <a href="${resetLink}">Réinitialiser mon mot de passe</a>
    <p>Ce lien expire dans 1 heure.</p>
    <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
  `;
  return sendEmail(user.email, 'Réinitialisation de votre mot de passe', html);
};

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
  sendOfferNotificationEmail,
  sendPasswordResetEmail
};
