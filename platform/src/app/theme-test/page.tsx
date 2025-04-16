'use client';

import * as React from 'react';
import { Button, Card, Badge, Chip, Tabs, Tab, Spinner, Switch } from '@heroui/react';

// Debug component to display CSS variables
function CssVarDebug() {
  const [vars, setVars] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    const root = getComputedStyle(document.documentElement);
    const primaryVars = {
      '--heroui-primary-500': root.getPropertyValue('--heroui-primary-500'),
      '--hero-primary-500': root.getPropertyValue('--hero-primary-500'),
      '--primary': root.getPropertyValue('--primary'),
      '--primary-500': root.getPropertyValue('--primary-500'),
    };

    setVars(primaryVars);
  }, []);

  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">CSS Variables Debug</h2>
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-auto text-xs">
        {JSON.stringify(vars, null, 2)}
      </pre>
    </Card>
  );
}

// Purple theme components with direct style overrides
function PurpleButtons() {
  return (
    <div className="flex flex-wrap gap-2">
      <Button style={{ backgroundColor: '#7828C8' }} variant="solid">
        Solid Purple
      </Button>
      <Button style={{ color: '#7828C8', borderColor: '#7828C8' }} variant="bordered">
        Bordered Purple
      </Button>
      <Button
        style={{ backgroundColor: 'rgba(120, 40, 200, 0.12)', color: '#7828C8' }}
        variant="light"
      >
        Light Purple
      </Button>
      <Button style={{ color: '#7828C8' }} variant="flat">
        Flat Purple
      </Button>
      <Button style={{ color: '#7828C8' }} variant="ghost">
        Ghost Purple
      </Button>
      <Button style={{ backgroundColor: '#7828C8' }} variant="shadow">
        Shadow Purple
      </Button>
    </div>
  );
}

function PurpleChips() {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge style={{ backgroundColor: '#7828C8' }}>Purple Badge</Badge>
      <Chip style={{ backgroundColor: '#7828C8' }}>Purple Chip</Chip>
      <Chip style={{ color: '#7828C8', borderColor: '#7828C8' }} variant="bordered">
        Bordered Purple
      </Chip>
      <Chip
        style={{ backgroundColor: 'rgba(120, 40, 200, 0.12)', color: '#7828C8' }}
        variant="light"
      >
        Light Purple
      </Chip>
      <Chip style={{ color: '#7828C8' }} variant="flat">
        Flat Purple
      </Chip>
      <Chip style={{ backgroundColor: '#7828C8' }} variant="shadow">
        Shadow Purple
      </Chip>
    </div>
  );
}

export default function ThemeTestPage() {
  return (
    <div className="p-8 flex flex-col gap-8">
      <h1 className="text-2xl font-bold">HeroUI Theme Test Page</h1>
      <p>This page showcases HeroUI components with primary colors to test the theme change.</p>

      {/* Add debug component */}
      <CssVarDebug />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Buttons with Direct Style</h2>
          <PurpleButtons />
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Badges & Chips with Direct Style</h2>
          <PurpleChips />
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Original Buttons</h2>
          <div className="flex flex-wrap gap-2">
            <Button color="primary" variant="solid">
              Solid Primary
            </Button>
            <Button color="primary" variant="bordered">
              Bordered Primary
            </Button>
            <Button color="primary" variant="light">
              Light Primary
            </Button>
            <Button color="primary" variant="flat">
              Flat Primary
            </Button>
            <Button color="primary" variant="ghost">
              Ghost Primary
            </Button>
            <Button color="primary" variant="shadow">
              Shadow Primary
            </Button>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Original Badges & Chips</h2>
          <div className="flex flex-wrap gap-2">
            <Badge color="primary">Primary Badge</Badge>
            <Chip color="primary">Primary Chip</Chip>
            <Chip color="primary" variant="bordered">
              Bordered Chip
            </Chip>
            <Chip color="primary" variant="light">
              Light Chip
            </Chip>
            <Chip color="primary" variant="flat">
              Flat Chip
            </Chip>
            <Chip color="primary" variant="shadow">
              Shadow Chip
            </Chip>
          </div>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Tabs</h2>
          <Tabs aria-label="Tabs" color="primary">
            <Tab key="tab1" title="Tab 1" />
            <Tab key="tab2" title="Tab 2" />
            <Tab key="tab3" title="Tab 3" />
          </Tabs>
          <div className="mt-2">Content of Tab 1</div>
        </Card>

        <Card className="p-4">
          <h2 className="text-xl font-semibold mb-4">Other Components</h2>
          <div className="flex items-center gap-4">
            <Spinner color="primary" />
            <Switch defaultSelected color="primary" />
          </div>
        </Card>
      </div>

      <div className="mt-8">
        <p className="font-semibold">Primary color should be purple (#7828C8).</p>
        <p>If you're still seeing blue colors, try:</p>
        <ul className="list-disc ml-5 mt-2">
          <li>Hard refreshing your browser (Ctrl+Shift+R or Cmd+Shift+R)</li>
          <li>Clearing your browser cache</li>
          <li>Restarting your development server</li>
          <li>Deleting the .next folder and rebuilding</li>
        </ul>
      </div>
    </div>
  );
}
