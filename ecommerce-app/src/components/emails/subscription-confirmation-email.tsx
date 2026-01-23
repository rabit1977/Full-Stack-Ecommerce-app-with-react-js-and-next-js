import {
    Body,
    Container,
    Head,
    Heading,
    Hr,
    Html,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';

interface SubscriptionConfirmationEmailProps {
  email: string;
}

export const SubscriptionConfirmationEmail = ({
  email,
}: SubscriptionConfirmationEmailProps) => (
  <Html>
    <Head />
    <Tailwind>
      <Body className='bg-gray-100 font-sans py-10 px-5'>
        <Container className='bg-white rounded-2xl mx-auto max-w-150 overflow-hidden shadow-lg'>
          {/* linear Header */}
          <Section className='p-0'>
            <div className='h-1.5 bg-linear-to-r from-indigo-500 to-purple-600' />
          </Section>

          {/* Success Icon */}
          <Section className='text-center pt-10 pb-5'>
            <div className='inline-block'>
              <svg width='64' height='64' viewBox='0 0 64 64' fill='none'>
                <circle cx='32' cy='32' r='32' fill='url(#linear)' />
                <path
                  d='M20 32L28 40L44 24'
                  stroke='white'
                  strokeWidth='4'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <defs>
                  <linearGradient id='linear' x1='0' y1='0' x2='64' y2='64'>
                    <stop offset='0%' stopColor='#667eea' />
                    <stop offset='100%' stopColor='#764ba2' />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </Section>

          {/* Main Content */}
          <Heading className='text-gray-900 text-3xl font-bold leading-tight m-0 mb-6 px-10 text-center'>
            Welcome Aboard! 🎉
          </Heading>

          <Text className='text-gray-600 text-base leading-relaxed m-0 mb-8 px-10 text-center'>
            You&apos;ve successfully joined our community! Get ready for exclusive
            content, early access to new products, insider tips, and special
            offers delivered straight to your inbox.
          </Text>

          {/* Email Badge */}
          <Section className='px-10 pb-8'>
            <div className='bg-gray-50 border-2 border-gray-200 rounded-xl p-5 text-center'>
              <Text className='text-gray-500 text-xs font-semibold tracking-wide uppercase m-0 mb-2'>
                Your subscription email
              </Text>
              <Text className='text-indigo-500 text-base font-semibold m-0'>
                {email}
              </Text>
            </div>
          </Section>

          <Hr className='border-gray-200 mx-10 my-8' />

          {/* Features Grid */}
          <Section className='px-10 pb-10'>
            <Text className='text-gray-800 text-lg font-semibold m-0 mb-6 text-center'>
              What to expect:
            </Text>

            <table className='w-full border-collapse'>
              <tbody>
                <tr>
                  <td className='p-3 text-center align-top w-1/2'>
                    <Text className='text-3xl m-0 mb-2'>📬</Text>
                    <Text className='text-gray-600 text-sm font-medium m-0'>
                      Weekly updates
                    </Text>
                  </td>
                  <td className='p-3 text-center align-top w-1/2'>
                    <Text className='text-3xl m-0 mb-2'>🎁</Text>
                    <Text className='text-gray-600 text-sm font-medium m-0'>
                      Exclusive offers
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td className='p-3 text-center align-top w-1/2'>
                    <Text className='text-3xl m-0 mb-2'>⚡</Text>
                    <Text className='text-gray-600 text-sm font-medium m-0'>
                      Early access
                    </Text>
                  </td>
                  <td className='p-3 text-center align-top w-1/2'>
                    <Text className='text-3xl m-0 mb-2'>💡</Text>
                    <Text className='text-gray-600 text-sm font-medium m-0'>
                      Expert tips
                    </Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>

          {/* Footer */}
          <Section className='bg-gray-50 py-6 px-10 text-center'>
            <Text className='text-gray-500 text-xs leading-normal m-1'>
              You can unsubscribe at any time from the link in our emails.
            </Text>
            <Text className='text-gray-500 text-xs leading-normal m-1'>
              © 2026 Your Company. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);

export default SubscriptionConfirmationEmail;
