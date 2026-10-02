variable "project_id" {
  description = "Dedicated Google Cloud project that hosts authoritative DNS for armada.nu."
  type        = string
}

variable "dns_name" {
  description = "Authoritative DNS suffix. Cloud DNS requires a trailing dot."
  type        = string
  default     = "armada.nu."

  validation {
    condition     = endswith(var.dns_name, ".")
    error_message = "dns_name must be a fully-qualified DNS name ending in a dot."
  }
}

variable "dnssec_state" {
  description = "DNSSEC state for the authoritative production zone. Production is expected to remain on."
  type        = string
  default     = "on"

  validation {
    condition     = contains(["off", "on"], var.dnssec_state)
    error_message = "dnssec_state must be either off or on."
  }
}
