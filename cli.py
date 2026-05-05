import argparse
import asyncio
from core.scanner import AsyncScanner


def main():
    parser = argparse.ArgumentParser(description='Async Web Vulnerability Scanner')
    parser.add_argument('url', help='Target URL to scan')
    parser.add_argument('--config', help='Path to YAML config', default=None)
    args = parser.parse_args()

    scanner = AsyncScanner(config_path=args.config)
    results = asyncio.run(scanner.scan(args.url))
    print('Scan complete. Findings:', len(results.get('findings', [])))


if __name__ == '__main__':
    main()
