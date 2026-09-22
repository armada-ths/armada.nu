import DOMPurify from "isomorphic-dompurify"

const EVENT_DESCRIPTION_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "span"
]

const EVENT_DESCRIPTION_ATTRIBUTES = ["href", "title", "rel", "target"]

export function sanitizeEventDescription(description?: string | null) {
  return DOMPurify.sanitize(description ?? "", {
    ALLOWED_TAGS: EVENT_DESCRIPTION_TAGS,
    ALLOWED_ATTR: EVENT_DESCRIPTION_ATTRIBUTES,
    ALLOW_ARIA_ATTR: false,
    ALLOW_DATA_ATTR: false
  })
}
