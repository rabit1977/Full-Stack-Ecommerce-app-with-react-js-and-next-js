import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';

interface ResetPasswordEmailProps {
  email: string;
  resetUrl: string;
}

export const ResetPasswordEmail = ({
  email,
  resetUrl,
}: ResetPasswordEmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className='bg-gray-100 font-sans py-10 px-5'>
        <Container className='bg-white rounded-2xl mx-auto max-w-lg overflow-hidden shadow-lg'>
          {/* Linear Header */}
          <Section className='p-0'>
            <div className='h-1.5 bg-gradient-to-r from-indigo-500 to-purple-600' />
          </Section>

          {/* Icon */}
          <Section className='text-center pt-10 pb-5'>
            <div className='inline-block p-4 rounded-full bg-indigo-50'>
              <svg 
                className="w-10 h-10 text-indigo-600"
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth="2" 
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11.536 16.293a1 1 0 01-.175.75l-1.636 1.636a1 1 0 01-.707.293h-1.414A1 1 0 016.293 17.586l-1.636-1.636a1 1 0 01-.293-.707l-1.636-1.636a1 1 0 010-1.414l5.742-5.742A6 6 0 0121.536 8.464z" 
                />
              </svg>
            </div>
          </Section>

          {/* Main Content */}
          <Heading className='text-gray-900 text-3xl font-bold leading-tight m-0 mb-6 px-10 text-center'>
            Reset your password
          </Heading>

          <Text className='text-gray-600 text-base leading-relaxed m-0 mb-8 px-10 text-center'>
            We received a request to reset the password for your account associated with <strong>{email}</strong>. 
            No changes have been made to your account yet.
          </Text>

          {/* CTA Button */}
          <Section className="text-center pb-8 px-10">
            <Button
              className="bg-indigo-600 text-white rounded-xl px-12 py-3.5 font-semibold text-base no-underline block w-full"
              href={resetUrl}
            >
              Reset Password
            </Button>
          </Section>

          <Text className='text-gray-500 text-sm leading-relaxed mb-8 px-10 text-center'>
            You can skip this email if you didn&apos;t make this request. The link is valid for 1 hour.
          </Text>

          <Hr className='border-gray-200 mx-10 my-8' />

          {/* Footer */}
          <Section className='bg-gray-50 py-6 px-10 text-center'>
            <Text className='text-gray-500 text-xs leading-normal m-1'>
              © {new Date().getFullYear()} Electro Store. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default ResetPasswordEmail;
