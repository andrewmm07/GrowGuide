'use client'

interface Resource {
  title: string
  description: string
  link: string
  type: 'video' | 'website' | 'book'
  image?: string
  author?: string
  rating?: number
  tags?: string[]
}

const RESOURCES: Resource[] = [
  {
    title: 'Gardening Australia',
    description: 'Official website with extensive guides, videos, and fact sheets for Australian gardeners.',
    link: 'https://www.abc.net.au/gardening',
    type: 'website',
    image: '/images/resources/gardening-australia.jpg',
    tags: ['Australian', 'Educational', 'Comprehensive']
  },
  {
    title: 'One Magic Square',
    description: 'How to grow your own food on one square metre.',
    link: 'https://www.bookdepository.com/One-Magic-Square-Lolo-Houbein/9781862548657',
    type: 'book',
    image: '/images/resources/one-magic-square.jpg',
    author: 'Lolo Houbein',
    rating: 4.5,
    tags: ['Small Space', 'Beginner Friendly', 'Sustainable']
  },
  // Add more resources...
]

export default function Resources() {
  const videoResources = RESOURCES.filter(r => r.type === 'video')
  const websiteResources = RESOURCES.filter(r => r.type === 'website')
  const bookResources = RESOURCES.filter(r => r.type === 'book')

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Gardening Resources</h1>
          <p className="text-lg text-gray-600">Curated collection of the best gardening resources to help you succeed.</p>
        </div>

        {/* Videos Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Video Guides
            </h2>
            <button className="text-green-600 hover:text-green-700 font-medium">View All</button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videoResources.map((resource, index) => (
              <ResourceCard key={index} resource={resource} />
            ))}
          </div>
        </section>

        {/* Websites Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
            Useful Websites
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {websiteResources.map((resource, index) => (
              <ResourceCard key={index} resource={resource} />
            ))}
          </div>
        </section>

        {/* Books Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Recommended Books
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookResources.map((resource, index) => (
              <ResourceCard key={index} resource={resource} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
      {resource.image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={resource.image}
            alt={resource.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 right-3">
            <span className="px-3 py-1 bg-white/90 rounded-full text-sm font-medium text-gray-700">
              {resource.type}
            </span>
          </div>
        </div>
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">
          {resource.title}
        </h3>
        {resource.author && (
          <p className="text-sm text-gray-500 mb-2">by {resource.author}</p>
        )}
        <p className="text-gray-600 mb-4">{resource.description}</p>
        {resource.tags && (
          <div className="flex flex-wrap gap-2 mb-4">
            {resource.tags.map((tag, index) => (
              <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                {tag}
              </span>
            ))}
          </div>
        )}
        <a
          href={resource.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-green-600 hover:text-green-700 font-medium"
        >
          Learn More
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </a>
      </div>
    </div>
  )
} 