type LinkedInIconProps = {
    className?: string
}

export function LinkedInIcon({ className }: LinkedInIconProps) {
    return (
        <svg
            role="img"
            viewBox="0 0 24 24"
            aria-label="LinkedIn"
            className={className}
            fill="currentColor">
            <path d="M20.451 20.451h-3.554V14.89c0-1.327-.027-3.036-1.852-3.036-1.853 0-2.136 1.445-2.136 2.939v5.658H9.355V9h3.414v1.561h.049c.477-.9 1.637-1.85 3.368-1.85 3.601 0 4.267 2.37 4.267 5.455v6.285zM5.337 7.433a2.063 2.063 0 110-4.126 2.063 2.063 0 010 4.126zM7.119 20.451H3.555V9h3.564v11.451zM22.225 0H1.771A1.771 1.771 0 000 1.771v20.451A1.771 1.771 0 001.771 24h20.451A1.771 1.771 0 0024 22.229V1.771A1.771 1.771 0 0022.222 0h.003z" />
        </svg>
    )
}
