#!/usr/bin/env python3
import json
import os

workdir = "c:\\Users\\EUROPEOLINE\\Desktop\\schoolParent"

# Fix tsconfig.json
tsconfig = {
    "compilerOptions": {
        "target": "ES2020",
        "useDefineForClassFields": True,
        "lib": ["ES2020", "DOM", "DOM.Iterable"],
        "module": "ESNext",
        "skipLibCheck": True,
        "moduleResolution": "bundler",
        "allowImportingTsExtensions": True,
        "resolveJsonModule": True,
        "isolatedModules": True,
        "noEmit": True,
        "jsx": "react-jsx",
        "strict": True,
        "noUnusedLocals": False,
        "noUnusedParameters": False,
        "noFallthroughCasesInSwitch": True,
        "esModuleInterop": True,
        "baseUrl": ".",
        "paths": {
            "@/*": ["./*"]
        }
    },
    "include": ["**/*.ts", "**/*.tsx"],
    "exclude": ["node_modules"]
}

with open(os.path.join(workdir, "tsconfig.json"), "w") as f:
    json.dump(tsconfig, f, indent=2)
print("✓ Fixed tsconfig.json")

# Fix tsconfig.node.json
tsconfig_node = {
    "compilerOptions": {
        "composite": True,
        "skipLibCheck": True,
        "module": "ESNext",
        "moduleResolution": "bundler",
        "allowSyntheticDefaultImports": True
    },
    "include": ["vite.config.ts"]
}

with open(os.path.join(workdir, "tsconfig.node.json"), "w") as f:
    json.dump(tsconfig_node, f, indent=2)
print("✓ Fixed tsconfig.node.json")

# Fix tailwind.config.js
tailwind_content = """/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
"""

with open(os.path.join(workdir, "tailwind.config.js"), "w") as f:
    f.write(tailwind_content)
print("✓ Fixed tailwind.config.js")

# Fix postcss.config.js
postcss_content = """module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
"""

with open(os.path.join(workdir, "postcss.config.js"), "w") as f:
    f.write(postcss_content)
print("✓ Fixed postcss.config.js")

print("\n✅ All configuration files fixed!")
