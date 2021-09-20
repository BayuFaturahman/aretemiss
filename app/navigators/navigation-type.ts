import React from 'react';

/* Type for App Route */
export type AppRoute = {
  name: string;
  component: React.FC<any>; // Component for Route
};
