#!/bin/bash
# Generate self-signed SSL certificates for local development (localhost)
# Usage: ./generate-selfsigned-cert.sh

CERT_DIR="$(dirname "$0")/letsencrypt/live/localhost"
mkdir -p "$CERT_DIR"

openssl req -x509 -nodes -days 365 \
  -newkey rsa:2048 \
  -keyout "$CERT_DIR/privkey.pem" \
  -out "$CERT_DIR/fullchain.pem" \
  -subj "/C=FR/ST=Local/L=Local/O=Local/OU=Dev/CN=localhost"

echo "Self-signed certificate generated at $CERT_DIR."
