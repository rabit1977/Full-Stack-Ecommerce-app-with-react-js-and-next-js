import { getShippingRates, getShippingZones } from '@/actions/admin/shipping-actions';
import { ShippingClient } from '@/components/admin/shipping-client';

export default async function ShippingPage() {
  const [zonesResult, ratesResult] = await Promise.all([
    getShippingZones(),
    getShippingRates()
  ]);

  const zones = zonesResult.success && zonesResult.zones ? zonesResult.zones : [];
  // @ts-ignore
  const rates = ratesResult.success && ratesResult.rates ? ratesResult.rates : [];

  return (
    <div className='flex-1 space-y-4 p-8 pt-6'>
      <ShippingClient initialZones={zones} initialRates={rates} />
    </div>
  );
}
