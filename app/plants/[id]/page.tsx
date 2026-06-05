import PageClient from './PageClient'
import { getSeedPlantStaticParams } from '@/lib/plantCatalog'

export function generateStaticParams() {
  return getSeedPlantStaticParams()
}

export default function Page() {
  return <PageClient />
}
