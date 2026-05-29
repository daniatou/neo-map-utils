# Security Policy

Neo Maps handles map configuration, SVG icons, URLs, and browser persistence, so security-sensitive changes should be reviewed carefully.

## Reporting a Vulnerability

If you find a vulnerability, please avoid opening a public issue with exploit details.

Open a private report through the repository security page, or contact the maintainers directly once a security contact is published.

## Areas To Review Carefully

- SVG icon registration and sanitization
- URL synchronization and query parsing
- local storage persistence
- remote layer loading
- WMS, tile, and GeoJSON URL handling
- any code touching DOM rendering or HTML injection

## Supported Versions

The project is still pre-1.0. Security fixes will target the latest development version until the first stable release.
