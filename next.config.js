/** @type {import('next').NextConfig} */
const isStaticExport = process.env.EXPORT_STATIC === 'true'

const nextConfig = {
  ...(isStaticExport ? {
    output: 'export',
    images: { unoptimized: true },
    trailingSlash: true,
  } : {}),
}

module.exports = nextConfig
