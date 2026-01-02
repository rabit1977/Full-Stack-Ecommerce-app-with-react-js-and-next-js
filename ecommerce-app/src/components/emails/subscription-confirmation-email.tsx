import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Text,
  Section,
  Hr,
} from '@react-email/components';

interface SubscriptionConfirmationEmailProps {
  email: string;
}

export const SubscriptionConfirmationEmail = ({
  email,
}: SubscriptionConfirmationEmailProps) => (
  <Html>
    <Head />
    <Body style={main}>
      <Container style={container}>
        {/* Gradient Header */}
        <Section style={header}>
          <div style={gradientBar} />
        </Section>

        {/* Success Icon */}
        <Section style={iconSection}>
          <div style={successIcon}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle cx="32" cy="32" r="32" fill="url(#gradient)" />
              <path
                d="M20 32L28 40L44 24"
                stroke="white"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="gradient" x1="0" y1="0" x2="64" y2="64">
                  <stop offset="0%" stopColor="#667eea" />
                  <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </Section>

        {/* Main Content */}
        <Heading style={h1}>Welcome Aboard! 🎉</Heading>
        
        <Text style={text}>
          You've successfully joined our community! Get ready for exclusive
          content, early access to new products, insider tips, and special
          offers delivered straight to your inbox.
        </Text>

        {/* Email Badge */}
        <Section style={emailBadgeSection}>
          <div style={emailBadge}>
            <Text style={emailLabel}>Your subscription email</Text>
            <Text style={emailText}>{email}</Text>
          </div>
        </Section>

        <Hr style={divider} />

        {/* Features Grid */}
        <Section style={featuresSection}>
          <Text style={featuresTitle}>What to expect:</Text>
          
          <table style={featuresGrid}>
            <tr>
              <td style={featureCell}>
                <Text style={featureEmoji}>📬</Text>
                <Text style={featureText}>Weekly updates</Text>
              </td>
              <td style={featureCell}>
                <Text style={featureEmoji}>🎁</Text>
                <Text style={featureText}>Exclusive offers</Text>
              </td>
            </tr>
            <tr>
              <td style={featureCell}>
                <Text style={featureEmoji}>⚡</Text>
                <Text style={featureText}>Early access</Text>
              </td>
              <td style={featureCell}>
                <Text style={featureEmoji}>💡</Text>
                <Text style={featureText}>Expert tips</Text>
              </td>
            </tr>
          </table>
        </Section>

        {/* Footer */}
        <Section style={footer}>
          <Text style={footerText}>
            You can unsubscribe at any time from the link in our emails.
          </Text>
          <Text style={footerText}>
            © 2026 Your Company. All rights reserved.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

export default SubscriptionConfirmationEmail;

const main = {
  backgroundColor: '#f0f2f5',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  padding: '40px 20px',
};

const container = {
  backgroundColor: '#ffffff',
  borderRadius: '16px',
  margin: '0 auto',
  maxWidth: '600px',
  overflow: 'hidden',
  boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
};

const header = {
  padding: '0',
};

const gradientBar = {
  height: '6px',
  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
};

const iconSection = {
  textAlign: 'center' as const,
  padding: '40px 0 20px',
};

const successIcon = {
  display: 'inline-block',
};

const h1 = {
  color: '#1a1a1a',
  fontSize: '32px',
  fontWeight: '700',
  lineHeight: '1.3',
  margin: '0 0 24px',
  padding: '0 40px',
  textAlign: 'center' as const,
};

const text = {
  color: '#4a5568',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 32px',
  padding: '0 40px',
  textAlign: 'center' as const,
};

const emailBadgeSection = {
  padding: '0 40px 32px',
};

const emailBadge = {
  backgroundColor: '#f7fafc',
  border: '2px solid #e2e8f0',
  borderRadius: '12px',
  padding: '20px',
  textAlign: 'center' as const,
};

const emailLabel = {
  color: '#718096',
  fontSize: '12px',
  fontWeight: '600',
  letterSpacing: '0.5px',
  margin: '0 0 8px',
  textTransform: 'uppercase' as const,
};

const emailText = {
  color: '#667eea',
  fontSize: '16px',
  fontWeight: '600',
  margin: '0',
};

const divider = {
  borderColor: '#e2e8f0',
  margin: '32px 40px',
};

const featuresSection = {
  padding: '0 40px 40px',
};

const featuresTitle = {
  color: '#2d3748',
  fontSize: '18px',
  fontWeight: '600',
  margin: '0 0 24px',
  textAlign: 'center' as const,
};

const featuresGrid = {
  width: '100%',
  borderCollapse: 'collapse' as const,
};

const featureCell = {
  padding: '12px',
  textAlign: 'center' as const,
  verticalAlign: 'top' as const,
  width: '50%',
};

const featureEmoji = {
  fontSize: '32px',
  margin: '0 0 8px',
};

const featureText = {
  color: '#4a5568',
  fontSize: '14px',
  fontWeight: '500',
  margin: '0',
};

const footer = {
  backgroundColor: '#f7fafc',
  padding: '24px 40px',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#718096',
  fontSize: '12px',
  lineHeight: '1.5',
  margin: '4px 0',
};