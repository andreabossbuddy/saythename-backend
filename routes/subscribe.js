import express from 'express';
import SibApiV3Sdk from 'sib-api-v3-sdk';
const router = express.Router();

// Configure Brevo
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

// Initialize APIs
const contactsApi = new SibApiV3Sdk.ContactsApi();
const transactionalEmailsApi = new SibApiV3Sdk.TransactionalEmailsApi();

router.post('/subscribe', async (req, res) => {
  const { email, name } = req.body;

  try {
    // Create contact
    const createContact = new SibApiV3Sdk.CreateContact();
    createContact.email = email;
    createContact.attributes = { FIRSTNAME: name };
    createContact.listIds = [2]; // change to your actual Brevo list ID

    await contactsApi.createContact(createContact);

    // Send welcome email
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.sender = { name: "Say the Name", email: "paula.ira2222@gmail.com" };
    sendSmtpEmail.to = [{ email, name }];
    sendSmtpEmail.subject = "Welcome to Say the Name!";
    sendSmtpEmail.htmlContent = `
      <h1>Welcome, ${name}!</h1>
      <p>Thank you for subscribing to our notifications.</p>
    `;

    await transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);

    res.json({ success: true, message: "Successfully subscribed and welcome email sent!" });
  } catch (error) {
    console.error('Subscription error:', error);

    if (error.status === 400) {
      return res.status(400).json({
        error: "This email is already subscribed.",
      });
    }

    res.status(500).json({
      error: "Failed to subscribe. Please try again later.",
    });
  }
});

export default router;