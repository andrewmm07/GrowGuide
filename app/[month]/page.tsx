import PageClient from './PageClient'

export function generateStaticParams() {
  return ['january','february','march','april','may','june',
          'july','august','september','october','november','december']
    .map(month => ({ month }))
}

export default function Page() {
  return <PageClient />
}
