import { render, RenderOptions } from '@testing-library/react';
import React, { PropsWithChildren } from 'react';

function Providers({ children }: PropsWithChildren) {
  // Add context providers here when needed (Theme, QueryClient, etc.)
  return <>{children}</>;
}

export function renderWithProviders(
  ui: React.ReactElement,
  options?: RenderOptions
) {
  return render(ui, { wrapper: Providers, ...options });
}

