// NODE_ENV is also "production" for preview builds; use Vercel's deployment
// environment instead. Missing configuration defaults to non-indexable.
export function isProductionDeployment() {
  return process.env.VERCEL_ENV === "production"
}
