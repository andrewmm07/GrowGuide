import PageClient from './PageClient'

export function generateStaticParams() {
  return [{ id: 'tomatoes' }]
}

export default function Page() {
  return <PageClient />
}
