/** @type {import('next').NextConfig} */
const isProdBuild =
  process.env.NODE_ENV === 'production' || process.env.EXPORT_STATIC === 'true'

const nextConfig = {
  ...(isProdBuild ? { output: 'export' } : {}),
  images: { unoptimized: true },
  trailingSlash: true,
}
module.exports = nextConfig
